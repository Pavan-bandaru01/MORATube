"use client";

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-8">
        <AlertOctagon className="w-12 h-12 text-red-500" />
      </div>
      <h1 className="text-4xl font-black mb-4">Something went wrong!</h1>
      <p className="text-gray-400 text-lg max-w-md mb-8">
        An unexpected error occurred while loading this page. Our team has been notified.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition shadow-lg shadow-red-600/20"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-bold transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
