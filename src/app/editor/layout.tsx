import { Suspense } from "react";

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-4">Loading editor...</div>}>
      {children}
    </Suspense>
  );
}
