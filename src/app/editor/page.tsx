"use client";

import React, { useCallback, useEffect, useState } from "react";

import AIFeaturesPanel from "@/components/ai-features-panel";
import CreateBucketButton from "@/components/create-bucket-button";
import EditorTabs from "@/components/editor-tabs";
import { FileDropzone } from "@/components/file-dropzone";
import TipTapEditor from "@/components/tiptap-ai-editor";
import { api } from "@/trpc/react";
import { v4 as uuidv4 } from "uuid";

interface FileContent {
  id: string;
  name: string;
  content: string;
  language?: string;
  lastModified?: Date;
}

export default function EditorPage() {
  const [files, setFiles] = useState<FileContent[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<FileContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch user files
  const {
    data: userFiles,
    isLoading: isLoadingFiles,
    refetch: refetchFiles,
  } = api.editor.listFiles.useQuery();

  // Get individual file content
  api.editor.getFile.useQuery(
    { fileId: activeFileId! },
    {
      enabled: !!activeFileId,
      onSuccess: (data) => {
        setActiveFile(data as FileContent);
      },
      onError: (error) => {
        console.error("Error fetching file:", error);
      },
    },
  );

  // Save file mutation
  const saveFileMutation = api.editor.saveFile.useMutation({
    onSuccess: () => {
      void refetchFiles();
    },
  });

  // Upload file mutation
  const uploadFileMutation = api.editor.uploadFile.useMutation({
    onSuccess: (data) => {
      setIsUploading(false);
      // Add the new file to the list
      setFiles((prevFiles) => [...prevFiles, data.file as FileContent]);
      // Set it as active file
      setActiveFileId(data.file.id);
      setActiveFile(data.file as FileContent);
      void refetchFiles();
    },
    onError: (error) => {
      setIsUploading(false);
      console.error("Error uploading file:", error);
      alert("Failed to upload file: " + error.message);
    },
  });

  // Initialize with files from server
  useEffect(() => {
    if (userFiles && userFiles.length > 0) {
      setFiles(userFiles as FileContent[]);

      // If no active file is selected, select the first one
      if (!activeFileId && userFiles.length > 0) {
        setActiveFileId(userFiles[0].id);
      }
    }
  }, [userFiles, activeFileId]);

  // Create a new file
  const handleCreateFile = () => {
    const newFileId = uuidv4();
    const newFileName = `new-file-${newFileId.substring(0, 8)}.js`;

    const newFile: FileContent = {
      id: newFileId,
      name: newFileName,
      content: "// Write your code here\n\n",
      language: "javascript",
      lastModified: new Date(),
    };

    // Add to local state first
    setFiles((prevFiles) => [...prevFiles, newFile]);
    setActiveFileId(newFileId);
    setActiveFile(newFile);

    // Save to server
    saveFileMutation.mutate(newFile);
  };

  // Close a file
  const handleCloseFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));

    // If the active file is being closed, select another file
    if (activeFileId === fileId) {
      const filesAfterRemoval = files.filter((f) => f.id !== fileId);
      if (filesAfterRemoval.length > 0) {
        setActiveFileId(filesAfterRemoval[0].id);
      } else {
        setActiveFileId(null);
        setActiveFile(null);
      }
    }
  };

  // Handle file content changes
  const handleContentChange = (content: string) => {
    if (activeFile) {
      const updatedFile = { ...activeFile, content };
      setActiveFile(updatedFile);

      // Debounced save
      const timeoutId = setTimeout(() => {
        setIsSaving(true);
        saveFileMutation.mutate(updatedFile, {
          onSuccess: () => {
            setIsSaving(false);
          },
          onError: () => {
            setIsSaving(false);
          },
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  };

  // Handle filename change
  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeFile) {
      const updatedFile = { ...activeFile, name: e.target.value };
      setActiveFile(updatedFile);

      // Update the file list
      setFiles((prevFiles) =>
        prevFiles.map((f) => (f.id === activeFile.id ? updatedFile : f)),
      );
    }
  };

  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (activeFile) {
      const updatedFile = { ...activeFile, language: e.target.value };
      setActiveFile(updatedFile);

      // Update the file list
      setFiles((prevFiles) =>
        prevFiles.map((f) => (f.id === activeFile.id ? updatedFile : f)),
      );

      // Save file with new language
      saveFileMutation.mutate(updatedFile);
    }
  };

  // Save all files
  const handleSaveAll = () => {
    if (activeFile) {
      setIsSaving(true);
      saveFileMutation.mutate(activeFile, {
        onSuccess: () => {
          setIsSaving(false);
        },
        onError: () => {
          setIsSaving(false);
        },
      });
    }
  };

  // Handle file upload
  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);

      try {
        // Read file content
        const content = await file.text();

        // Determine language from file extension
        const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
        let language = "javascript";

        switch (fileExtension) {
          case "ts":
            language = "typescript";
            break;
          case "tsx":
            language = "typescript";
            break;
          case "jsx":
            language = "javascript";
            break;
          case "js":
          default:
            language = "javascript";
            break;
        }

        // Create new file object
        const newFileId = uuidv4();
        const newFile: FileContent = {
          id: newFileId,
          name: file.name,
          content,
          language,
          lastModified: new Date(),
        };

        // Upload to server
        uploadFileMutation.mutate(newFile);
      } catch (error) {
        setIsUploading(false);
        console.error("Error reading file:", error);
        alert("Failed to read file");
      }
    },
    [uploadFileMutation],
  );

  // Keyboard shortcuts for common operations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save: Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSaveAll();
      }

      // New file: Ctrl/Cmd + N
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        handleCreateFile();
      }

      // Handle tab navigation: Ctrl/Cmd + number keys
      if ((e.ctrlKey || e.metaKey) && /^[1-9]$/.test(e.key)) {
        e.preventDefault();
        const index = parseInt(e.key, 10) - 1;
        if (files[index]) {
          setActiveFileId(files[index].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [files, activeFile, handleSaveAll, handleCreateFile, setActiveFileId]);

  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
    { value: "markdown", label: "Markdown" },
  ];

  // If user is not authenticated, redirect to login
  useEffect(() => {
    // This is handled by middleware protection
  }, []);

  // Render empty state with dropzone
  const renderEmptyState = () => (
    <div className="flex flex-grow flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
      {files.length === 0 ? (
        <div className="w-full max-w-md text-center">
          <p className="mb-4">No files yet</p>

          {/* Create bucket button */}
          <div className="mb-8">
            <CreateBucketButton />
          </div>

          <div className="mb-6">
            <FileDropzone
              onFileAccepted={handleFileUpload}
              className="bg-white dark:bg-gray-800"
            />
          </div>

          <p className="mb-4 text-sm">or</p>

          <button
            className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={handleCreateFile}
          >
            Create a new file
          </button>
        </div>
      ) : (
        <p>Select a file from the tabs above</p>
      )}
    </div>
  );

  if (isLoadingFiles || isUploading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">
            {isUploading ? "Uploading file..." : "Loading editor..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Header section */}
      <div className="border-b border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">TipTap AI Code Editor</h1>
            <div className="ml-3 flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Protected
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isSaving ? (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Saving...
              </span>
            ) : (
              <span className="text-sm text-green-500 dark:text-green-400">
                All changes saved
              </span>
            )}
            <button
              className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
              onClick={handleSaveAll}
            >
              Save All
            </button>
          </div>
        </div>
      </div>

      <EditorTabs
        files={files}
        activeFileId={activeFileId ?? ""}
        onSelectFile={setActiveFileId}
        onCreateFile={handleCreateFile}
        onCloseFile={handleCloseFile}
      />

      {activeFile ? (
        <div className="flex flex-grow flex-col overflow-hidden">
          <div className="flex items-center space-x-4 border-b border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex-grow">
              <input
                type="text"
                value={activeFile.name}
                onChange={handleFilenameChange}
                onBlur={() => {
                  if (activeFile) {
                    saveFileMutation.mutate(activeFile);
                  }
                }}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <select
                value={activeFile.language ?? "javascript"}
                onChange={handleLanguageChange}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-grow overflow-auto p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="relative col-span-2">
                {/* File dropzone overlay for active editor */}
                <FileDropzone
                  onFileAccepted={handleFileUpload}
                  className="absolute inset-0 z-10 opacity-0 transition-opacity hover:bg-gray-100/90 hover:opacity-90 dark:hover:bg-gray-800/90"
                >
                  <div className="flex h-full items-center justify-center">
                    <div className="rounded-lg bg-white p-6 text-center shadow-lg dark:bg-gray-800">
                      <p className="text-lg font-medium">
                        Drop to replace content
                      </p>
                    </div>
                  </div>
                </FileDropzone>

                <TipTapEditor
                  content={activeFile.content}
                  language={activeFile.language ?? "javascript"}
                  onChange={handleContentChange}
                />
              </div>
              <div className="col-span-1">
                <AIFeaturesPanel
                  language={activeFile.language ?? "javascript"}
                  onCodeGenerate={(code) => handleContentChange(code)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        renderEmptyState()
      )}
    </div>
  );
}
