import Link from "next/link";
import { Heart, MessageCircle, Share2, MoreVertical } from "lucide-react";
import type { Short } from "@/types";

export default function ShortCard({ short }: { short: Short }) {
  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="relative h-screen w-full max-w-md mx-auto overflow-hidden bg-black border border-[#2C2C2C] flex-shrink-0 snap-start snap-always">
      {short.videoUrl ? (
        <video
          src={short.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted
          playsInline
          autoPlay
        />
      ) : short.thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={short.thumbnailUrl}
          alt={short.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${short.gradient} opacity-90`} />
      )}

      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-[#2C2C2C] text-white">
          {short.category}
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
        <button className="group flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-[#E53935]/20 transition text-white">
            <Heart className="w-6 h-6 group-hover:fill-[#E53935] group-hover:text-[#E53935] transition" />
          </div>
          <span className="text-xs font-medium drop-shadow-md text-white">
            {formatNumber(short.likes)}
          </span>
        </button>

        <button className="group flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/20 transition text-white">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium drop-shadow-md text-white">
            {formatNumber(short.comments)}
          </span>
        </button>

        <button className="group flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/20 transition text-white">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium drop-shadow-md text-white">Share</span>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#2C2C2C] flex items-center justify-center font-bold text-white">
            {short.creator.avatar || short.creator.name[0] || "U"}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[15px] leading-tight flex items-center gap-2 text-white">
              {short.creator.name}
              <button className="bg-[#E53935] hover:bg-[#C62828] text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm transition">
                Subscribe
              </button>
            </span>
          </div>
        </div>

        <Link href={`/videos/${short.id}`}>
          <p className="text-sm font-medium leading-snug text-white drop-shadow-md line-clamp-2 hover:text-[#E53935] transition">
            {short.title}
          </p>
        </Link>
      </div>
    </div>
  );
}
