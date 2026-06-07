import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 relative">
        <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h2 className="text-xl font-bold mt-6">Loading Experience...</h2>
      <p className="text-gray-400 mt-2">Preparing your content.</p>
    </div>
  );
}
