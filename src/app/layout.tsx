import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { AuthProvider } from "@/components/auth-provider";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Code Refiner",
  description: "Your code refining application with authentication",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="min-h-screen pt-16">
        <AuthProvider>
          <TRPCReactProvider>
            <Navigation />
            {children}
          </TRPCReactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
