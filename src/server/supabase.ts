import { env } from "@/env";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client created with service role key
 * This client has admin privileges and should only be used in
 * server-side code (Server Components, API routes, Server Actions)
 */
export const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

/**
 * Server-only Supabase client with anonymous key
 * This client has limited permissions defined by your Supabase RLS policies
 */
export const supabaseServer = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

/**
 * Helper functions for working with Supabase Storage
 */
export const supabaseStorage = {
  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile({
    bucketName,
    filePath,
    file,
    metadata = {},
  }: {
    bucketName: string;
    filePath: string;
    file: File | Blob | ArrayBuffer | string;
    metadata?: Record<string, string>;
  }) {
    return supabaseAdmin.storage.from(bucketName).upload(filePath, file, {
      upsert: true,
      contentType: typeof file === "string" ? "text/plain" : undefined,
      cacheControl: "3600",
      metadata,
    });
  },

  /**
   * Download a file from Supabase Storage
   */
  async downloadFile({
    bucketName,
    filePath,
    transformOptions = {},
  }: {
    bucketName: string;
    filePath: string;
    transformOptions?: Record<string, any>;
  }) {
    return supabaseAdmin.storage
      .from(bucketName)
      .download(filePath, transformOptions);
  },

  /**
   * List files in Supabase Storage
   */
  async listFiles({
    bucketName,
    folderPath,
  }: {
    bucketName: string;
    folderPath: string;
  }) {
    return supabaseAdmin.storage.from(bucketName).list(folderPath);
  },

  /**
   * Create a bucket in Supabase Storage
   */
  async createBucket({
    bucketName,
    isPublic = false,
    fileSizeLimit = 10485760, // 10MB
  }: {
    bucketName: string;
    isPublic?: boolean;
    fileSizeLimit?: number;
  }) {
    return supabaseAdmin.storage.createBucket(bucketName, {
      public: isPublic,
      fileSizeLimit,
    });
  },

  /**
   * Create a storage policy
   */
  async createPolicy({
    bucketName,
    policyName,
    definition,
    allowedOperations,
  }: {
    bucketName: string;
    policyName: string;
    definition: string;
    allowedOperations: string[];
  }) {
    return supabaseAdmin.storage.from(bucketName).createPolicy(policyName, {
      definition,
      allowedOperations,
    });
  },
};
