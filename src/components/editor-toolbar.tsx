"use client";

import { type Editor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  const buttonClasses =
    "p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-lg border-b border-gray-300 bg-gray-100 px-3 py-1.5 dark:border-gray-700 dark:bg-gray-800">
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={buttonClasses}
        title="Undo (Ctrl+Z)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 7v6h6"></path>
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={buttonClasses}
        title="Redo (Ctrl+Y)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 7v6h-6"></path>
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"></path>
        </svg>
      </button>

      <div className="mx-1 h-4 border-r border-gray-300 dark:border-gray-600"></div>

      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .setCodeBlock({
              language: editor.getAttributes("codeBlock").language,
            })
            .run()
        }
        className={`${buttonClasses} ${editor.isActive("codeBlock") ? "bg-gray-200 dark:bg-gray-700" : ""}`}
        title="Format as code block"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      </button>

      <button
        type="button"
        onClick={() => {
          // Get all content and format it nicely
          try {
            const content = editor.getHTML();
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = content;

            // Find code blocks and format them
            const codeBlocks = tempDiv.querySelectorAll("pre code");
            codeBlocks.forEach((block) => {
              const formatted = block.textContent
                ?.split("\n")
                .map((line) => line.trim())
                .join("\n");

              if (formatted) {
                block.textContent = formatted;
              }
            });

            editor.commands.setContent(tempDiv.innerHTML);
          } catch (error) {
            console.error("Failed to format code:", error);
          }
        }}
        className={buttonClasses}
        title="Format code"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10H3M21 6H3M21 14H3M21 18H3"></path>
        </svg>
      </button>

      <div className="ml-auto flex items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {editor.isActive("codeBlock") ? "Code Block" : "Text"}
        </span>
      </div>
    </div>
  );
}
