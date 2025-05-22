"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/server/auth-client";

import { LatestPost } from "@/app/_components/post";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await authClient.getSession();
        if (data?.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-white"></div>
          <p className="mt-4 text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="text-center">
          <h1 className="mb-8 text-4xl font-bold">Welcome to Code Refiner</h1>
          <p className="mb-8 text-xl">Please sign in to continue</p>
          <Link
            href="/auth"
            className="rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white transition duration-150 ease-in-out hover:bg-indigo-700"
          >
            Sign In / Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Welcome{" "}
          <span className="text-[hsl(280,100%,70%)]">
            {user.name?.split(" ")[0]}
          </span>
        </h1>

        <p className="max-w-2xl text-center text-xl">
          You have successfully signed in to Code Refiner! This is your
          protected dashboard.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://create.t3.gg/en/usage/first-steps"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">First Steps →</h3>
            <div className="text-lg">
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://create.t3.gg/en/introduction"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Documentation →</h3>
            <div className="text-lg">
              Learn more about Create T3 App, the libraries it uses, and how to
              deploy it.
            </div>
          </Link>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">Authenticated with Better Auth</p>
          <LatestPost />
        </div>
      </div>
    </main>
  );
}
