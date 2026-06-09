import ShortCard from "@/components/ShortCard";
import { getShorts } from "@/lib/actions";
import { Upload } from "lucide-react";
import Link from "next/link";

export default async function ShortsPage() {
  const shorts = await getShorts();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0A0A0A]">
      {/* Header */}
      <div className="px-4 md:px-8 py-4 md:py-6 flex items-center justify-between border-b border-[#2C2C2C] bg-gradient-to-b from-[#141414] to-[#0A0A0A]">
        <h1 className="text-2xl md:text-3xl font-black text-white">MORA Shorts</h1>
        <Link
          href="/upload/short"
          className="flex items-center gap-2 bg-[#E53935] hover:bg-[#C62828] text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-base transition"
        >
          <Upload className="w-4 h-4" /> Upload Short
        </Link>
      </div>

      {/* Shorts Container */}
      <div className="flex-1 overflow-y-auto snap-y snap-mandatory hide-scrollbar bg-[#0A0A0A]">
        {shorts.length > 0 ? (
          <div className="flex flex-col items-center">
            {shorts.map((short) => (
              <ShortCard key={short.id} short={short} />
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center px-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-2xl font-bold text-white mb-2">No shorts yet</h2>
              <p className="text-[#999999] mb-6">Upload the first motivational short!</p>
              <Link
                href="/upload/short"
                className="inline-flex items-center gap-2 bg-[#E53935] hover:bg-[#C62828] text-white px-6 py-3 rounded-full font-bold transition"
              >
                <Upload className="w-4 h-4" /> Upload Short
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
