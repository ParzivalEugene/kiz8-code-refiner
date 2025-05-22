"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/server/auth-client";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <div className="h-10 w-24 animate-pulse rounded bg-gray-200"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {user.image && (
            <img
              src={user.image}
              alt={user.name}
              className="h-8 w-8 rounded-full"
            />
          )}
          <div className="text-right">
            <p className="text-sm font-medium">{user.name}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth"
      className="rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-indigo-700"
    >
      Sign In
    </Link>
  );
}
