"use client";

import React, { useState } from "react";

interface File {
  id: string;
  name: string;
  language?: string;
  lastModified?: Date;
}

interface EditorTabsProps {
  files: File[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onCreateFile: () => void;
  onCloseFile: (fileId: string) => void;
}

export default function EditorTabs({
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onCloseFile,
}: EditorTabsProps) {
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);

  const getLanguageIcon = (language?: string) => {
    switch (language?.toLowerCase()) {
      case "javascript":
      case "js":
        return "📜";
      case "typescript":
      case "ts":
        return "📘";
      case "python":
        return "🐍";
      case "html":
        return "🌐";
      case "css":
        return "🎨";
      case "json":
        return "📋";
      case "markdown":
      case "md":
        return "📝";
      default:
        return "📄";
    }
  };

  return (
    <div className="flex items-center overflow-x-auto border-b border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
      {files.map((file) => (
        <div
          key={file.id}
          className={`relative flex cursor-pointer items-center px-3 py-2 text-sm ${
            activeFileId === file.id
              ? "border-t-2 border-t-blue-500 bg-white dark:bg-gray-900"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          } `}
          onClick={() => onSelectFile(file.id)}
          onMouseEnter={() => setHoveredTabId(file.id)}
          onMouseLeave={() => setHoveredTabId(null)}
        >
          <span className="mr-1">{getLanguageIcon(file.language)}</span>
          <span className="max-w-[150px] truncate">{file.name}</span>

          {/* Close button */}
          <button
            className={`ml-2 text-gray-500 transition-opacity hover:text-red-500 ${hoveredTabId === file.id || activeFileId === file.id ? "opacity-100" : "opacity-0"} `}
            onClick={(e) => {
              e.stopPropagation();
              onCloseFile(file.id);
            }}
            aria-label="Close file"
          >
            ✕
          </button>
        </div>
      ))}

      {/* New File Button */}
      <button
        className="p-2 text-gray-600 hover:bg-gray-200 hover:text-blue-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
        onClick={onCreateFile}
        aria-label="Create new file"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
}
