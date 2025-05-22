# Code Refiner

A robust application with authentication using Better Auth including GitHub OAuth integration.

## Features

- User authentication with email and password
- Social sign-in with GitHub
- Protected routes
- Responsive UI with Tailwind CSS
- Prisma ORM for database operations
- tRPC for type-safe API communication

## Tech Stack

This project is built with the [T3 Stack](https://create.t3.gg/):

- [Next.js](https://nextjs.org) - React framework for server-rendered applications
- [Better Auth](https://www.better-auth.com/) - Modern authentication library
- [Prisma](https://prisma.io) - Type-safe ORM for database access
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [tRPC](https://trpc.io) - End-to-end typesafe APIs

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd code-refiner
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Setup environment variables

Copy the example environment file and update the values:

```bash
cp .env.example .env
```

For GitHub authentication, you'll need to [create a new OAuth application](https://github.com/settings/applications/new) on GitHub:

- Application name: Code Refiner (or your preferred name)
- Homepage URL: http://localhost:3000
- Authorization callback URL: http://localhost:3000/api/auth/callback/github

After creating, copy the Client ID and Client Secret to your .env file:

```
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

### 4. Database setup

Start your PostgreSQL database (using the provided script or your preferred method):

```bash
./start-database.sh
```

Apply the database migrations:

```bash
pnpm db:migrate
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Authentication Routes

- Sign in/Sign up: `/auth`
- Home (protected): `/`

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
