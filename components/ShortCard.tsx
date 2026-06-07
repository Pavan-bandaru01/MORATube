import { Heart, MessageCircle, Share2, MoreVertical } from "lucide-react";
import type { Short } from "@/types";

export default function ShortCard({ short }: { short: Short }) {
  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="relative h-[80vh] min-h-[600px] max-h-[800px] w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-black border border-white/10 flex-shrink-0 snap-center shadow-2xl">
      {/* Video Background Placeholder */}
      <div className={`absolute inset-0 bg-gradient-to-br ${short.gradient} opacity-90`} />
      
      {/* Play indicator */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <div className="w-16 h-16 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
          <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1" />
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/10">
          {short.category}
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Right Sidebar Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
        <button className="group flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-red-500/20 transition text-white">
            <Heart className="w-6 h-6 group-hover:fill-red-500 group-hover:text-red-500 transition" />
          </div>
          <span className="text-xs font-medium drop-shadow-md">{formatNumber(short.likes)}</span>
        </button>

        <button className="group flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/20 transition text-white">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium drop-shadow-md">{formatNumber(short.comments)}</span>
        </button>

        <button className="group flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/20 transition text-white">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium drop-shadow-md">Share</span>
        </button>
      </div>

      {/* Bottom Info Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center font-bold">
            {short.creator.avatar || short.creator.name[0] || 'U'}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[15px] leading-tight flex items-center gap-2">
              {short.creator.name}
              <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm transition">
                Subscribe
              </button>
            </span>
          </div>
        </div>
        
        <p className="text-sm font-medium leading-snug text-white drop-shadow-md line-clamp-2">
          {short.title}
        </p>
      </div>
    </div>
  );
}
