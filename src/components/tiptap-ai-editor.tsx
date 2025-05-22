"use client";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import "highlight.js/styles/github-dark.css";
import { common, createLowlight } from "lowlight";
import { useCallback, useEffect, useRef, useState } from "react";

// Initialize lowlight with common languages
const customLowlight = createLowlight(common);
// Register additional languages
customLowlight.register("javascript", js);
customLowlight.register("typescript", typescript);
customLowlight.register("html", html);
customLowlight.register("css", css);
customLowlight.register("python", python);
customLowlight.register("json", json);
customLowlight.register("markdown", markdown);

type AICommandType = "explain" | "improve" | "refactor" | "comment" | "fix";

interface AICommand {
  type: AICommandType;
  label: string;
  prompt: (code: string, language: string) => string;
}

interface TipTapEditorProps {
  content: string;
  language?: string;
  onChange: (content: string) => void;
}

// AI commands for code enhancement
const AI_COMMANDS: AICommand[] = [
  {
    type: "explain",
    label: "🤔 Explain code",
    prompt: (code, language) =>
      `Explain this ${language} code in simple terms:\n\n${code}`,
  },
  {
    type: "improve",
    label: "✨ Suggest improvements",
    prompt: (code, language) =>
      `Suggest improvements for this ${language} code:\n\n${code}`,
  },
  {
    type: "refactor",
    label: "♻️ Refactor code",
    prompt: (code, language) =>
      `Refactor this ${language} code to make it more efficient and cleaner:\n\n${code}`,
  },
  {
    type: "comment",
    label: "📝 Add comments",
    prompt: (code, language) =>
      `Add helpful comments to this ${language} code:\n\n${code}`,
  },
  {
    type: "fix",
    label: "🔧 Fix bugs",
    prompt: (code, language) =>
      `Find and fix potential bugs in this ${language} code:\n\n${code}`,
  },
];

export default function TipTapEditor({
  content,
  language = "javascript",
  onChange,
}: TipTapEditorProps) {
  const [editorContent, setEditorContent] = useState(content);
  const [selectedText, setSelectedText] = useState<string>("");
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const aiMenuRef = useRef<HTMLDivElement>(null);

  // Handle AI command execution
  const handleAICommand = async (command: AICommand) => {
    if (!editor) return;

    // Get selected text or entire content
    const selection = editor.state.selection;
    const text = selection.empty
      ? editorContent
      : editor.state.doc.textBetween(selection.from, selection.to, " ");

    if (!text) return;

    setIsLoadingAI(true);
    setAiResponse(null);

    try {
      // In a real implementation, this would call an API endpoint
      // For demo purposes, we'll simulate an AI response
      const prompt = command.prompt(text, language);
      console.log("AI prompt:", prompt);

      // Simulate API call
      setTimeout(() => {
        let response = "";
        switch (command.type) {
          case "explain":
            response = `This code ${language === "javascript" ? "defines a function that" : "implements a routine which"} processes data and returns a formatted result. It uses modern syntax and follows best practices.`;
            break;
          case "improve":
            response = `Consider the following improvements:\n- Use more descriptive variable names\n- Add error handling\n- Consider performance optimizations\n- Add proper documentation`;
            break;
          case "refactor":
            response = `Refactored version:\n\`\`\`${language}\n${text.replace("function", "const") + " ="}\n\`\`\`\nThis version uses modern syntax and is more maintainable.`;
            break;
          case "comment":
            response = `With comments:\n\`\`\`${language}\n// This function processes the input data\n${text}\n// Returns the formatted result\n\`\`\``;
            break;
          case "fix":
            response = `Fixed version:\n\`\`\`${language}\n${text.replace("let", "const")}\n\`\`\`\nFixed potential issues with variable declarations.`;
            break;
        }
        setAiResponse(response);
        setIsLoadingAI(false);
      }, 1500);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setAiResponse("Error getting AI response. Please try again.");
      setIsLoadingAI(false);
    }
  };

  // Function to handle text selection
  const handleSelectionUpdate = useCallback(() => {
    if (editor) {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, " ");
      setSelectedText(text);
      setShowAIMenu(!!text && text.length > 0);
    }
  }, [editor]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight: customLowlight,
        defaultLanguage: language,
      }),
    ],
    content: `<pre><code language="${language}">${content}</code></pre>`,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Use RegExp.exec() instead of match
      const codeRegex = /<code[^>]*>([\s\S]*?)<\/code>/;
      const codeMatch = codeRegex.exec(html);
      const extractedCode = codeMatch ? codeMatch[1] : html;

      // Clean up HTML entities
      const cleanCode = extractedCode
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      setEditorContent(cleanCode);
      onChange(cleanCode);
    },
    onSelectionUpdate: handleSelectionUpdate,
  });

  useEffect(() => {
    if (editor && content !== editorContent) {
      // Only update if the content has changed from an external source
      editor.commands.setContent(
        `<pre><code language="${language}">${content}</code></pre>`,
      );
      setEditorContent(content);
    }
  }, [content, editor, editorContent, language]);

  // Update language when it changes
  useEffect(() => {
    if (editor) {
      // Update code block language
      editor.chain().focus().setCodeBlock({ language }).run();
    }
  }, [editor, language]);

  const closeAIMenu = () => {
    setShowAIMenu(false);
  };

  // Handle click outside the AI menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        aiMenuRef.current &&
        !aiMenuRef.current.contains(event.target as Node)
      ) {
        closeAIMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-300">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between border-b border-gray-300 bg-gray-100 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="font-mono">{language.toUpperCase()}</div>
        <div className="flex space-x-2">
          {AI_COMMANDS.map((command) => (
            <button
              key={command.type}
              className="rounded bg-blue-600 px-2 py-1 text-xs text-white transition-colors hover:bg-blue-700"
              onClick={() => handleAICommand(command)}
              disabled={isLoadingAI}
              title={command.label}
            >
              {command.label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Editor content */}
      <div className="min-h-[300px] bg-gray-50 p-4 dark:bg-gray-900">
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none focus:outline-none"
        />
      </div>

      {/* AI response panel */}
      {aiResponse && (
        <div className="max-h-[200px] overflow-y-auto border-t border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">AI Assistant</h3>
            <button
              onClick={() => setAiResponse(null)}
              className="text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
          </div>
          <div className="prose dark:prose-invert max-w-none text-sm whitespace-pre-wrap">
            {aiResponse}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isLoadingAI && (
        <div className="bg-opacity-20 absolute inset-0 flex items-center justify-center bg-black">
          <div className="rounded-md bg-white p-4 shadow-lg dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
              <p>AI assistant is thinking...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
