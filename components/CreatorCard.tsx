import Link from "next/link";
import type { Creator } from "@/types";

export default function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <div className="glass rounded-2xl overflow-hidden group">
      <div className={`h-24 bg-gradient-to-br ${creator.bannerGradient} opacity-80`} />
      
      <div className="px-5 pb-5 relative flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full border-4 border-[#050505] bg-zinc-800 flex items-center justify-center text-2xl font-black -mt-8 mb-3 shadow-lg">
          {creator.avatar}
        </div>
        
        <h3 className="font-bold text-lg mb-1 group-hover:text-red-400 transition">{creator.name}</h3>
        <p className="text-xs text-gray-400 mb-2">@{creator.username} • {creator.subscribers} subscribers</p>
        
        <p className="text-sm text-gray-300 line-clamp-2 mb-4">
          {creator.bio}
        </p>
        
        <Link 
          href={`/channel/${creator.username}`}
          className="w-full bg-white/10 hover:bg-red-600 text-white py-2 rounded-full text-sm font-semibold transition duration-300"
        >
          View Channel
        </Link>
      </div>
    </div>
  );
}
