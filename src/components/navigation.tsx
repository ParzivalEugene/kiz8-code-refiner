"use client";

import Link from "next/link";
import { AuthButton } from "./auth-button";

export function Navigation() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-10 bg-gray-900/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              Code Refiner
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Home
                </Link>
                <Link
                  href="/editor"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  AI Editor
                </Link>
              </div>
            </div>
          </div>
          <div>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
