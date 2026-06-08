import Link from "next/link";
import type { Video } from "@/types";
import { Play } from "lucide-react";

interface VideoCardProps {
  video: Video;
  layout?: "grid" | "list";
}

export default function VideoCard({ video, layout = "grid" }: VideoCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  if (layout === "list") {
    return (
      <Link href={`/videos/${video.id}`} className="group flex flex-col sm:flex-row gap-4 hover:bg-white/5 p-2 rounded-2xl transition">
        <div className="relative w-full sm:w-64 aspect-video rounded-xl overflow-hidden bg-[#141414] border border-[#2C2C2C] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={video.thumbnailUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
            <div className="w-12 h-12 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
              <Play className="w-5 h-5 ml-1" />
            </div>
          </div>
          
          <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-xs font-medium text-white">
            {video.duration}
          </div>
        </div>

        <div className="flex-1 py-1">
          <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition line-clamp-2 mb-1">
            {video.title}
          </h3>
          <div className="text-sm text-gray-400 mb-2 flex items-center gap-1.5">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{video.uploadDate}</span>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">
              {video.creator.avatar || video.creator.name[0] || 'U'}
            </div>
            <span className="text-sm text-gray-400 hover:text-white transition">{video.creator.name}</span>
          </div>
          
          <p className="text-sm text-gray-500 line-clamp-2 hidden sm:block">
            {video.description}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/videos/${video.id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#141414] border border-[#2C2C2C] group-hover:border-[#E53935]/30 transition duration-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={video.thumbnailUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
          <div className="w-14 h-14 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white transform scale-90 group-hover:scale-100 transition duration-300">
            <Play className="w-6 h-6 ml-1" />
          </div>
        </div>
        
        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium text-white shadow-lg">
          {video.duration}
        </div>
      </div>

      <div className="flex gap-3 px-1">
        <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-white shrink-0 mt-0.5 border border-white/10">
          {video.creator.avatar || video.creator.name[0] || 'U'}
        </div>
        
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-red-400 transition line-clamp-2 leading-tight mb-1">
            {video.title}
          </h3>
          <p className="text-sm text-gray-400 hover:text-white transition mb-0.5">
            {video.creator.name}
          </p>
          <div className="text-sm text-gray-500 flex items-center gap-1.5">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{video.uploadDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}