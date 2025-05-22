"use client";

import { useState } from "react";

interface AIFeaturesPanelProps {
  language: string;
  onCodeGenerate: (code: string) => void;
}

interface AIPrompt {
  title: string;
  description: string;
  promptTemplate: (language: string) => string;
}

const CODE_PROMPTS: AIPrompt[] = [
  {
    title: "Generate boilerplate",
    description: "Generate basic starter code for a component or function",
    promptTemplate: (language) => {
      switch (language) {
        case "javascript":
        case "typescript":
          return "Create a React component that displays a list of items with pagination";
        case "python":
          return "Create a FastAPI endpoint that returns a list of items with pagination";
        case "html":
          return "Create an HTML form with validation";
        default:
          return `Create a basic starter template for ${language}`;
      }
    },
  },
  {
    title: "Create function",
    description: "Generate a utility function",
    promptTemplate: (language) => {
      switch (language) {
        case "javascript":
        case "typescript":
          return "Create a function that formats a date in different formats";
        case "python":
          return "Create a function that processes a CSV file";
        default:
          return `Create a utility function for ${language}`;
      }
    },
  },
  {
    title: "Add error handling",
    description: "Generate error handling code",
    promptTemplate: (language) => {
      switch (language) {
        case "javascript":
        case "typescript":
          return "Add try-catch error handling to the current code";
        case "python":
          return "Add try-except error handling to the current code";
        default:
          return `Add error handling for ${language}`;
      }
    },
  },
  {
    title: "Add tests",
    description: "Generate unit tests",
    promptTemplate: (language) => {
      switch (language) {
        case "javascript":
        case "typescript":
          return "Create Jest tests for a function";
        case "python":
          return "Create pytest tests for a function";
        default:
          return `Create unit tests for ${language}`;
      }
    },
  },
];

export default function AIFeaturesPanel({
  language,
  onCodeGenerate,
}: AIFeaturesPanelProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<AIPrompt | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const handlePromptSelect = (prompt: AIPrompt) => {
    setSelectedPrompt(prompt);
    setCustomPrompt(prompt.promptTemplate(language));
  };

  const handleGenerateCode = async () => {
    if (!customPrompt) return;

    setIsLoading(true);
    setGeneratedCode(null);

    try {
      // In a real implementation, this would call an API endpoint
      // For demo purposes, we'll simulate an AI response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let code = "";
      const lang = language.toLowerCase();

      if (lang === "javascript" || lang === "typescript") {
        code = `// Generated code for ${lang}
function processData(items) {
  try {
    return items
      .filter(item => item.active)
      .map(item => ({
        id: item.id,
        name: item.name,
        processed: true,
        timestamp: new Date().toISOString()
      }));
  } catch (error) {
    console.error("Error processing data:", error);
    return [];
  }
}`;
      } else if (lang === "python") {
        code = `# Generated code for Python
def process_data(items):
    try:
        return [
            {
                "id": item["id"],
                "name": item["name"],
                "processed": True,
                "timestamp": datetime.now().isoformat()
            }
            for item in items
            if item.get("active")
        ]
    except Exception as e:
        print(f"Error processing data: {e}")
        return []`;
      } else if (lang === "html") {
        code = `<!-- Generated HTML code -->
<form id="myForm" class="form-container">
  <div class="form-group">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required />
  </div>
  <div class="form-group">
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required />
  </div>
  <button type="submit" class="submit-btn">Submit</button>
</form>`;
      } else {
        code = `// Generated code for ${lang}
// This is a placeholder for ${lang} code generation
// You would see actual ${lang} code here in a real implementation`;
      }

      setGeneratedCode(code);
    } catch (error) {
      console.error("Error generating code:", error);
      setGeneratedCode("Error generating code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCode = () => {
    if (generatedCode) {
      onCodeGenerate(generatedCode);
      setGeneratedCode(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-300 p-4 dark:border-gray-700">
        <h3 className="text-lg font-medium">AI Code Generation</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Generate code snippets with AI assistance
        </p>
      </div>

      <div className="p-4">
        {/* Prompt Templates */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Choose a template:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CODE_PROMPTS.map((prompt) => (
              <button
                key={prompt.title}
                className={`rounded border p-2 text-left text-sm ${
                  selectedPrompt?.title === prompt.title
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
                }`}
                onClick={() => handlePromptSelect(prompt)}
              >
                <div className="font-medium">{prompt.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {prompt.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Prompt Input */}
        <div className="mb-4">
          <label
            htmlFor="customPrompt"
            className="mb-2 block text-sm font-medium"
          >
            Customize your prompt:
          </label>
          <textarea
            id="customPrompt"
            className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
            rows={3}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Describe what code you want to generate..."
          />
        </div>

        {/* Generate Button */}
        <div className="mb-4">
          <button
            onClick={handleGenerateCode}
            disabled={isLoading || !customPrompt}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
                Generating...
              </div>
            ) : (
              "Generate Code"
            )}
          </button>
        </div>

        {/* Generated Code */}
        {generatedCode && (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Generated Code:
            </label>
            <div className="relative rounded-md border border-gray-300 bg-gray-100 p-3 dark:border-gray-700 dark:bg-gray-900">
              <pre className="overflow-x-auto text-sm whitespace-pre-wrap">
                {generatedCode}
              </pre>
              <button
                onClick={handleUseCode}
                className="absolute top-2 right-2 rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
              >
                Use This Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
