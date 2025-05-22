#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  source .env
fi

# Check for required environment variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: Missing required environment variables NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  exit 1
fi

# Create the storage bucket
echo "Creating Supabase storage bucket for code editor..."
curl -X POST \
  "$NEXT_PUBLIC_SUPABASE_URL/storage/v1/bucket" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "code-editor", "public": false, "file_size_limit": 10485760}'

echo "Setting up storage policies..."
# Add RLS policy to allow authenticated users to access only their own files
curl -X POST \
  "$NEXT_PUBLIC_SUPABASE_URL/storage/v1/policies" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User files access",
    "bucket_id": "code-editor",
    "definition": "((storage.foldername(name))[1] = auth.uid()::text)",
    "allow_access": true,
    "operation": "SELECT"
  }'

# Policy for inserting files
curl -X POST \
  "$NEXT_PUBLIC_SUPABASE_URL/storage/v1/policies" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User files insert",
    "bucket_id": "code-editor",
    "definition": "((storage.foldername(name))[1] = auth.uid()::text)",
    "allow_access": true,
    "operation": "INSERT"
  }'

# Policy for updating files
curl -X POST \
  "$NEXT_PUBLIC_SUPABASE_URL/storage/v1/policies" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User files update",
    "bucket_id": "code-editor",
    "definition": "((storage.foldername(name))[1] = auth.uid()::text)",
    "allow_access": true,
    "operation": "UPDATE"
  }'

# Policy for deleting files
curl -X POST \
  "$NEXT_PUBLIC_SUPABASE_URL/storage/v1/policies" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User files delete",
    "bucket_id": "code-editor",
    "definition": "((storage.foldername(name))[1] = auth.uid()::text)",
    "allow_access": true,
    "operation": "DELETE"
  }'

echo "Setup complete!"
