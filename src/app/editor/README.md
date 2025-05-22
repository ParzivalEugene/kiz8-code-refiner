# TipTap AI Multi-File Code Editor

## Features

### Core Features

- **Multi-file Editing**: Seamlessly work on multiple code files simultaneously with tab navigation
- **AI-Powered Code Assistance**: Get code suggestions, formatting, and improvements
- **Syntax Highlighting**: Supports multiple languages including JavaScript, TypeScript, Python, HTML, CSS, and more
- **Real-time Saving**: Code changes are automatically saved to Supabase storage
- **Authentication Protection**: Secure access to your files, only available to authenticated users
- **Keyboard Shortcuts**: Boost productivity with keyboard shortcuts for common operations

### Languages Support

- JavaScript
- TypeScript
- Python
- HTML
- CSS
- JSON
- Markdown

## Architecture

### Technology Stack

- **Next.js 15+**: App Router and React Server Components for modern web application architecture
- **TypeScript**: Type-safe code with TypeScript 5.8+
- **TipTap**: Rich text editor with code editing and syntax highlighting
- **Supabase**: Storage for code files with role-based security policies
- **tRPC**: Type-safe API for data operations
- **Tailwind CSS**: Responsive and modern UI design

### Storage Implementation

The multi-file editor uses Supabase Storage with the following architecture:

1. **Storage Structure**: Files are stored in individual buckets under user-specific paths
2. **File Organization**: `users/{userId}/files/{fileId}`
3. **Metadata**: Language, name, and other file metadata stored with each file
4. **Security**: Role-based access control ensures users can only access their files

## Usage

### Getting Started

1. **Authentication**: Sign in to access the editor
2. **Create Files**: Click the "+" button to create a new file
3. **Edit Files**: Use the rich text editor with syntax highlighting
4. **Switch Files**: Use tabs to navigate between multiple files
5. **AI Assistance**: Use the AI features panel for code generation and improvements

### Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save all files
- **Ctrl/Cmd + N**: Create a new file
- **Ctrl/Cmd + [1-9]**: Switch to tab by number

### AI Features

The AI code generation panel offers:

- **Code Generation**: Generate boilerplate code based on a prompt
- **Function Creation**: Create utility functions for common tasks
- **Error Handling**: Add proper error handling to your code
- **Test Generation**: Create unit tests for your functions
- **Custom Prompts**: Use custom prompts for specific code generation needs

## Setup

To set up the storage bucket for the editor:

1. Click the "Create Storage Bucket" button in the editor
2. This creates a Supabase storage bucket with proper permissions
3. Start creating and editing files immediately

## Security Considerations

- **Authentication**: All editor routes are protected, requiring user authentication
- **Authorization**: Row-level security ensures users can only access their own files
- **Data Isolation**: Each user's files are stored in separate paths
- **API Protection**: tRPC endpoints use protected procedures for data operations
