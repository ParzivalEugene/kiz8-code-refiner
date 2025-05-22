import { supabaseStorage } from "@/server/supabase";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

// Define types for session context
interface SessionUser {
  id: string;
  email?: string;
  name?: string;
}

interface SessionContext {
  session: {
    user: SessionUser;
  };
}

// Define types for Supabase storage metadata
interface StorageMetadata {
  metadata?: {
    name?: string;
    language?: string;
  };
  lastModified?: number;
}

// Bucket name constant
const BUCKET_NAME = "code-editor";

/**
 * Editor file content schema
 */
const FileContentSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
  language: z.string().default("javascript"),
  lastModified: z.date().optional(),
});

/**
 * Editor router for handling multi-file operations
 */
export const editorRouter = createTRPCRouter({
  // Get file contents by ID or create a new file
  getFile: protectedProcedure
    .input(
      z.object({
        fileId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const sessionCtx = ctx as unknown as SessionContext;
      const userId = sessionCtx.session.user.id;
      const filePath = `users/${userId}/files/${input.fileId}`;

      try {
        // Download file from Supabase Storage
        const { data, error } = await supabaseStorage.downloadFile({
          bucketName: BUCKET_NAME,
          filePath,
        });

        if (error) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "File not found or access denied",
          });
        }

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "File content is empty",
          });
        }

        // Read the file content
        const content = await data.text();

        // Get file metadata using custom headers
        const { data: fileData } = await supabaseStorage.downloadFile({
          bucketName: BUCKET_NAME,
          filePath,
          transformOptions: { mode: "head" },
        });

        // Default metadata
        let fileName = `File ${input.fileId}`;
        let fileLanguage = "javascript";
        let lastModified = Date.now();

        // Extract metadata from headers if available
        if (fileData && "metadata" in fileData) {
          const metaObj = fileData.metadata as StorageMetadata;
          if (metaObj?.metadata?.name) {
            fileName = metaObj.metadata.name;
          }
          if (metaObj?.metadata?.language) {
            fileLanguage = metaObj.metadata.language;
          }
          if (metaObj?.lastModified) {
            lastModified = metaObj.lastModified;
          }
        }

        return {
          id: input.fileId,
          name: fileName,
          content,
          language: fileLanguage,
          lastModified: new Date(lastModified),
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve file",
          cause: error,
        });
      }
    }),

  // Save file content
  saveFile: protectedProcedure
    .input(FileContentSchema)
    .mutation(async ({ input, ctx }) => {
      const sessionCtx = ctx as unknown as SessionContext;
      const userId = sessionCtx.session.user.id;
      const fileId = input.id ?? uuidv4();
      const filePath = `users/${userId}/files/${fileId}`;

      try {
        // Convert content to Blob
        const contentBlob = new Blob([input.content], { type: "text/plain" });

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabaseStorage.uploadFile({
          bucketName: BUCKET_NAME,
          filePath,
          file: contentBlob,
          metadata: {
            name: input.name,
            language: input.language,
          },
        });

        if (uploadError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to save file",
          });
        }

        return {
          success: true,
          file: {
            id: fileId,
            name: input.name,
            content: input.content,
            language: input.language,
            lastModified: new Date(),
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save file",
          cause: error,
        });
      }
    }),

  // Upload file from client
  uploadFile: protectedProcedure
    .input(FileContentSchema)
    .mutation(async ({ input, ctx }) => {
      const sessionCtx = ctx as unknown as SessionContext;
      const userId = sessionCtx.session.user.id;
      const fileId = input.id ?? uuidv4();
      const filePath = `users/${userId}/files/${fileId}`;

      try {
        // Convert content to Blob
        const contentBlob = new Blob([input.content], { type: "text/plain" });

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabaseStorage.uploadFile({
          bucketName: BUCKET_NAME,
          filePath,
          file: contentBlob,
          metadata: {
            name: input.name,
            language: input.language,
          },
        });

        if (uploadError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to upload file",
          });
        }

        return {
          success: true,
          file: {
            id: fileId,
            name: input.name,
            content: input.content,
            language: input.language,
            lastModified: new Date(),
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload file",
          cause: error,
        });
      }
    }),

  // List all files for the current user
  listFiles: protectedProcedure.query(async ({ ctx }) => {
    const sessionCtx = ctx as unknown as SessionContext;
    const userId = sessionCtx.session.user.id;
    const folderPath = `users/${userId}/files/`;

    try {
      // List files from Supabase Storage
      const { data, error } = await supabaseStorage.listFiles({
        bucketName: BUCKET_NAME,
        folderPath,
      });

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list files",
        });
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Transform to file list objects
      const files = await Promise.all(
        data.map(async (item) => {
          const fileId = item.name;

          // Get metadata from file headers
          const { data: fileData } = await supabaseStorage.downloadFile({
            bucketName: BUCKET_NAME,
            filePath: `${folderPath}${fileId}`,
            transformOptions: { mode: "head" },
          });

          // Default metadata
          let fileName = `File ${fileId}`;
          let fileLanguage = "javascript";
          let lastModified = Date.now();

          // Extract metadata from headers if available
          if (fileData && "metadata" in fileData) {
            const metaObj = fileData.metadata as StorageMetadata;
            if (metaObj?.metadata?.name) {
              fileName = metaObj.metadata.name;
            }
            if (metaObj?.metadata?.language) {
              fileLanguage = metaObj.metadata.language;
            }
            if (metaObj?.lastModified) {
              lastModified = metaObj.lastModified;
            }
          }

          return {
            id: fileId,
            name: fileName,
            language: fileLanguage,
            lastModified: new Date(lastModified),
          };
        }),
      );

      return files;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to list files",
        cause: error,
      });
    }
  }),
});
