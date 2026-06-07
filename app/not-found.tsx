import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-8">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h1 className="text-5xl font-black mb-4 text-balance">404 - Page Not Found</h1>
      <p className="text-gray-400 text-lg max-w-md mb-8">
        It seems you have wandered off the path. The content you are looking for does not exist or has been removed.
      </p>
      <Link 
        href="/"
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition shadow-lg shadow-red-600/20"
      >
        Return Home
      </Link>
    </div>
  );
}
