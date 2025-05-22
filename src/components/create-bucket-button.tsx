"use client";

import { useState } from "react";

export default function CreateBucketButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const createBucket = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/create-storage-bucket", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: "Storage bucket created successfully!",
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to create storage bucket",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Error creating storage bucket. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium">Supabase Storage Setup</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Set up the storage bucket required for the editor
          </p>
        </div>
      </div>

      <button
        onClick={createBucket}
        disabled={isLoading}
        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:bg-gray-400"
      >
        {isLoading ? (
          <>
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-t-2 border-white"></span>
            Creating...
          </>
        ) : (
          "Create Storage Bucket"
        )}
      </button>

      {result && (
        <div
          className={`mt-3 rounded-md p-3 ${
            result.success
              ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400"
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  );
}
