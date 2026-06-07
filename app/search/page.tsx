import { Suspense } from "react";
import SearchContent from "./SearchContent";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] p-8 flex items-center justify-center">
          <p className="text-gray-400">Loading search...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
