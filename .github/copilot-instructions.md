# NEXTJS FULLSTACK COPILOT EDITS OPERATIONAL GUIDELINES

## PRIME DIRECTIVE

Avoid working on more than one file at a time.
Multiple simultaneous edits to a file will cause corruption.
Be chatting and teach about what you are doing while coding.

## LARGE FILE & COMPLEX CHANGE PROTOCOL

### MANDATORY PLANNING PHASE

When working with large files (>300 lines) or complex changes:

1. ALWAYS start by creating a detailed plan BEFORE making any edits
2. Your plan MUST include:

   - All functions/sections that need modification
   - The order in which changes should be applied
   - Dependencies between changes
   - Estimated number of separate edits required

3. Format your plan as:

## PROPOSED EDIT PLAN

Working with: [filename]
Total planned edits: [number]

### MAKING EDITS

- Focus on one conceptual change at a time
- Show clear "before" and "after" snippets when proposing changes
- Include concise explanations of what changed and why
- Always check if the edit maintains the project's coding style

### Edit sequence:

1. [First specific change] - Purpose: [why]
2. [Second specific change] - Purpose: [why]
3. Do you approve this plan? I'll proceed with Edit [number] after your confirmation.
4. WAIT for explicit user confirmation before making ANY edits when user ok edit [number]

### EXECUTION PHASE

- After each individual edit, clearly indicate progress:
  "✅ Completed edit [#] of [total]. Ready for next edit?"
- If you discover additional needed changes during editing:
- STOP and update the plan
- Get approval before continuing

### REFACTORING GUIDANCE

When refactoring large files:

- Break work into logical, independently functional chunks
- Ensure each intermediate state maintains functionality
- Consider temporary duplication as a valid interim step
- Always indicate the refactoring pattern being applied

### RATE LIMIT AVOIDANCE

- For very large files, suggest splitting changes across multiple sessions
- Prioritize changes that are logically complete units
- Always provide clear stopping points

## General Requirements

Use modern technologies as described below for all code suggestions. Prioritize clean, maintainable code with appropriate comments.

### Accessibility

- Ensure compliance with **WCAG 2.1** AA level minimum, AAA whenever feasible.
- Always suggest:
- Labels for form fields.
- Proper **ARIA** roles and attributes.
- Adequate color contrast.
- Alternative texts (`alt`, `aria-label`) for media elements.
- Semantic HTML for clear structure.
- Tools like **Lighthouse** for audits.

## Browser Compatibility

- Prioritize feature detection (`if ('fetch' in window)` etc.).
- Support latest two stable releases of major browsers:
- Firefox, Chrome, Edge, Safari (macOS/iOS)
- Emphasize progressive enhancement with polyfills or bundlers (e.g., **Vite**) as needed.

## Next.js Requirements

- **Target Version**: Next.js 15+ with App Router
- **Features to Use**:
  - App Router with `app/` directory structure
  - Server Components by default, Client Components when needed
  - Server Actions for form handling and mutations
  - Route handlers for API endpoints
  - Middleware for authentication and routing logic
  - Dynamic imports for code splitting
  - Image optimization with `next/image`
  - Font optimization with `next/font`
  - Metadata API for SEO
  - Streaming and Suspense boundaries
  - Parallel and intercepting routes when appropriate
- **File Conventions**:
  - `page.tsx` for route pages
  - `layout.tsx` for shared layouts
  - `loading.tsx` for loading UI
  - `error.tsx` for error boundaries
  - `not-found.tsx` for 404 pages
  - `route.ts` for API routes
- **Performance**:
  - Use Server Components for data fetching when possible
  - Implement proper caching strategies
  - Optimize bundle size with dynamic imports
  - Use `revalidatePath` and `revalidateTag` for cache invalidation

## TypeScript Requirements

- **Target Version**: TypeScript 5.8+
- **Features to Use**:
  - Strict mode enabled
  - Proper type definitions for all functions and variables
  - Generic types and utility types
  - Template literal types
  - Conditional types when appropriate
  - `satisfies` operator for type checking
  - `const` assertions
  - Branded types for domain modeling
- **Coding Standards**:
  - Use `interface` for object shapes, `type` for unions/intersections
  - Prefer type-only imports when possible
  - Use proper JSDoc comments for complex types
  - Implement proper error types and handling

## Better Auth Requirements

- **Authentication Features**:
  - Use Better Auth's built-in providers (OAuth, email/password)
  - Implement proper session management
  - Use middleware for route protection
  - Implement role-based access control (RBAC)
  - Handle authentication state properly in components
- **Security**:
  - Use secure session configuration
  - Implement CSRF protection
  - Use proper cookie settings
  - Handle authentication errors gracefully
- **Integration**:
  - Integrate with Prisma for user management
  - Use tRPC for authenticated API calls
  - Implement proper client-side auth state management

## Prisma Requirements

- **Target Version**: Prisma 6.8+
- **Features to Use**:
  - Proper schema modeling with relationships
  - Use appropriate field types and constraints
  - Implement database migrations
  - Use Prisma Client with proper type safety
  - Implement connection pooling for production
  - Use transactions for complex operations
  - Implement soft deletes when appropriate
- **Best Practices**:
  - Use descriptive model and field names
  - Implement proper indexing for performance
  - Use enums for fixed value sets
  - Handle database errors gracefully
  - Use proper validation at the database level

## Supabase Requirements

- **Database**:
  - Use PostgreSQL features effectively
  - Implement Row Level Security (RLS) policies
  - Use Supabase's real-time features when needed
  - Implement proper database functions and triggers
- **Storage**:
  - Use Supabase Storage for file uploads
  - Implement proper file validation and security
  - Use signed URLs for secure file access
- **Integration**:
  - Connect Prisma to Supabase PostgreSQL
  - Use Supabase's connection pooling
  - Implement proper environment configuration

## TipTap AI Editor Requirements

- **Editor Features**:
  - Implement rich text editing with proper toolbar
  - Use TipTap's AI features for content generation
  - Implement collaborative editing when needed
  - Use proper content serialization (JSON/HTML)
  - Implement custom extensions when needed
- **Integration**:
  - Save content to database via tRPC
  - Implement real-time collaboration with Supabase
  - Handle editor state management properly
  - Implement proper content validation

## Trigger.dev Requirements

- **Background Jobs**:
  - Use Trigger.dev for long-running tasks
  - Implement proper job queuing and processing
  - Use webhooks for external service integration
  - Implement job monitoring and error handling
- **Integration**:
  - Connect with Next.js API routes
  - Use proper environment configuration
  - Implement job scheduling when needed
  - Handle job failures gracefully

## Monaco Editor Requirements (Optional)

- **Code Editing**:
  - Use Monaco for code editing features
  - Implement proper syntax highlighting
  - Use TypeScript language service integration
  - Implement code completion and IntelliSense
- **Integration**:
  - Load Monaco dynamically to reduce bundle size
  - Implement proper theming (light/dark mode)
  - Handle editor state and content saving
  - Use proper accessibility features

## React/JavaScript Requirements

- **React Version**: React 19+
- **Features to Use**:
  - Function components with hooks
  - Server Components when possible
  - Proper state management with useState/useReducer
  - Effect management with useEffect
  - Context API for global state when needed
  - Suspense boundaries for loading states
  - Error boundaries for error handling
  - React 19 features (use, useOptimistic, etc.)
- **JavaScript/TypeScript**:
  - ECMAScript 2023+ features
  - Async/await for asynchronous operations
  - Proper error handling with try-catch
  - Use modern array methods (map, filter, reduce)
  - Implement proper type guards
  - Use optional chaining and nullish coalescing

## Styling Requirements

- **Tailwind CSS**:
  - Use Tailwind CSS 4+ with PostCSS
  - Implement responsive design with mobile-first approach
  - Use Tailwind's design system consistently
  - Implement dark mode support
  - Use custom CSS properties when needed
  - Follow Tailwind's utility-first principles

## Folder Structure

Follow this Next.js App Router structure:

```
project-root/
├── prisma/                   # Database schema and migrations
│   ├── migrations/
│   └── schema.prisma
├── public/                   # Static assets
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── app/                  # App Router pages and layouts
│   │   ├── (auth)/          # Route groups
│   │   ├── api/             # API routes
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components
│   │   └── forms/          # Form components
│   ├── lib/                # Utility functions and configurations
│   │   ├── auth.ts         # Better Auth configuration
│   │   ├── db.ts           # Prisma client
│   │   ├── trpc.ts         # tRPC configuration
│   │   └── utils.ts        # General utilities
│   ├── server/             # Server-side code
│   │   ├── api/            # tRPC routers
│   │   └── actions/        # Server actions
│   ├── types/              # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   └── middleware.ts       # Next.js middleware
├── trigger/                # Trigger.dev jobs
├── docs/                   # Documentation
└── scripts/               # Build and deployment scripts
```

## Documentation Requirements

- Include JSDoc comments for TypeScript functions
- Document complex components with clear examples
- Maintain concise Markdown documentation
- Minimum docblock info: `@param`, `@returns`, `@throws`, `@example`

## Security Considerations

- Sanitize all user inputs thoroughly
- Use parameterized queries with Prisma
- Implement proper CORS policies
- Use CSRF protection with Better Auth
- Ensure secure cookies (`HttpOnly`, `Secure`, `SameSite`)
- Implement rate limiting for API routes
- Use environment variables for sensitive data
- Implement proper input validation with Zod
- Use Content Security Policy (CSP) headers
- Implement proper error handling without exposing sensitive information

## Performance Considerations

- Use Server Components for data fetching
- Implement proper caching strategies
- Use dynamic imports for code splitting
- Optimize images with next/image
- Use proper database indexing
- Implement connection pooling
- Use React.memo for expensive components
- Implement proper loading states
- Use Suspense boundaries effectively
- Monitor Core Web Vitals

## Error Handling

- Use try-catch blocks consistently for async operations
- Implement proper error boundaries in React
- Handle database errors gracefully
- Provide user-friendly error messages
- Log errors properly for debugging
- Use proper HTTP status codes in API routes
- Implement retry logic for transient failures
- Handle authentication errors appropriately
