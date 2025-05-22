"use client";

import { cn } from "@/lib/utils";
import { useCallback, useRef, useState, type ReactNode } from "react";

// Acceptable file types
const ACCEPTED_FILE_TYPES = [".js", ".jsx", ".ts", ".tsx"];

export interface FileDropzoneProps {
  onFileAccepted: (file: File) => void;
  children?: ReactNode;
  className?: string;
}

export function FileDropzone({
  onFileAccepted,
  children,
  className,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  // File validation
  const validateFile = (file: File): boolean => {
    // Check file extension
    const fileName = file.name.toLowerCase();
    const isValidExtension = ACCEPTED_FILE_TYPES.some((ext) =>
      fileName.endsWith(ext),
    );

    if (!isValidExtension) {
      setError(`Only ${ACCEPTED_FILE_TYPES.join(", ")} files are accepted`);
      return false;
    }

    // Check file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large (max 10MB)");
      return false;
    }

    setError(null);
    return true;
  };

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set dragging to false if we're leaving the dropzone (not its children)
    if (
      dropzoneRef.current &&
      !dropzoneRef.current.contains(e.relatedTarget as Node)
    ) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle file drop
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0]; // Take only the first file

        if (validateFile(file)) {
          onFileAccepted(file);
        }
      }
    },
    [onFileAccepted],
  );

  // Handle file input change (for manual selection)
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];

        if (validateFile(file)) {
          onFileAccepted(file);
        }
      }
    },
    [onFileAccepted],
  );

  return (
    <div
      ref={dropzoneRef}
      className={cn(
        "relative flex w-full flex-col items-center justify-center rounded-lg transition-colors",
        "cursor-pointer border-2 border-dashed p-6",
        isDragging
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/25",
        className,
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        accept={ACCEPTED_FILE_TYPES.join(",")}
        onChange={handleFileInputChange}
      />

      {children || (
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="text-4xl">📄</div>
          <p className="text-sm font-medium">
            Drag & drop a file or click to browse
          </p>
          <p className="text-muted-foreground text-xs">
            Supported files: {ACCEPTED_FILE_TYPES.join(", ")}
          </p>
        </div>
      )}

      {error && <div className="text-destructive mt-2 text-sm">{error}</div>}
    </div>
  );
}
