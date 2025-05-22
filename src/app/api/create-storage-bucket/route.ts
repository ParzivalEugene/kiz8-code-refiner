import { supabaseStorage } from "@/server/supabase";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create the storage bucket using server-side utility
    const { data: bucketData, error: bucketError } =
      await supabaseStorage.createBucket({
        bucketName: "code-editor",
        isPublic: false,
        fileSizeLimit: 10485760, // 10MB
      });

    if (bucketError) {
      // If the bucket already exists, consider it a success
      if (bucketError.message.includes("already exists")) {
        return NextResponse.json(
          { message: "Bucket already exists", existed: true },
          { status: 200 },
        );
      }

      return NextResponse.json(
        { error: `Failed to create bucket: ${bucketError.message}` },
        { status: 500 },
      );
    }

    // Set up the RLS policies
    const policies = [
      {
        name: "User files access",
        definition: "((storage.foldername(name))[1] = auth.uid()::text)",
        operation: "SELECT",
      },
      {
        name: "User files insert",
        definition: "((storage.foldername(name))[1] = auth.uid()::text)",
        operation: "INSERT",
      },
      {
        name: "User files update",
        definition: "((storage.foldername(name))[1] = auth.uid()::text)",
        operation: "UPDATE",
      },
      {
        name: "User files delete",
        definition: "((storage.foldername(name))[1] = auth.uid()::text)",
        operation: "DELETE",
      },
    ];

    // Create each policy
    for (const policy of policies) {
      const { error: policyError } = await supabaseStorage.createPolicy({
        bucketName: "code-editor",
        policyName: policy.name,
        definition: policy.definition,
        allowedOperations: [policy.operation],
      });

      if (policyError) {
        console.error(`Error creating policy ${policy.name}:`, policyError);
        // Continue with other policies even if one fails
      }
    }

    return NextResponse.json(
      { message: "Storage bucket created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating storage bucket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
