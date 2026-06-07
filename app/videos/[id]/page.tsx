import { notFound } from "next/navigation";
import Link from "next/link";
import { getVideoById, getVideos } from "@/lib/actions";
import VideoPlayer from "@/components/VideoPlayer";
import VideoCard from "@/components/VideoCard";
import CommentBox from "@/components/CommentBox";
import { ThumbsUp, ThumbsDown, Share2, BookmarkPlus, Bell, MessageSquare, Plus } from "lucide-react";

export default async function VideoWatchPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const video = await getVideoById(resolvedParams.id);

  if (!video) {
    notFound();
  }

  const allVideos = await getVideos();
  const suggestedVideos = allVideos.filter((v: any) => v.id !== video.id).slice(0, 10);

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto grid lg:grid-cols-[1fr_350px] xl:grid-cols-[1fr_400px] gap-6 lg:gap-8">
        
        {/* Main Content: Video & Details */}
        <div className="space-y-4">
          <VideoPlayer url={video.videoUrl} gradient={video.thumbnailGradient} />
          
          <h1 className="text-xl md:text-2xl font-bold text-white mt-4">{video.title}</h1>
          
          {/* Channel Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-white/10 mt-4">
            <Link href={`/channel/${video.creator.username}`} className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-xl font-bold border border-white/10 group-hover:border-red-500 transition">
                {video.creator.avatar || video.creator.name[0]}
              </div>
              <div>
                <h3 className="font-bold text-lg group-hover:text-red-400 transition">{video.creator.name}</h3>
                <p className="text-xs text-gray-400">100K subscribers</p>
              </div>
            </Link>
            <button className="ml-2 bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-bold transition flex items-center gap-2">
              Subscribe <Bell className="w-4 h-4" />
            </button>
          </div>

          {/* Description Box */}
          <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 mt-4 transition cursor-pointer">
            <div className="flex items-center gap-2 text-sm font-semibold mb-2">
              <span>{formatNumber(video.views)} views</span>
              <span>•</span>
              <span>{video.uploadDate}</span>
            </div>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{video.description}</p>
          </div>

          {/* Comments Section */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-xl font-bold mb-6">{video.comments.length} Comments</h3>
            <CommentBox comments={video.comments} />
          </div>
        </div>

        {/* Sidebar: Related Videos */}
        <div className="space-y-4">
          <div className="lg:col-span-1">
            <h3 className="font-bold text-xl mb-4">Up Next</h3>
            <div className="flex flex-col gap-4">
              {suggestedVideos.map((v: any) => (
                <VideoCard key={v.id} video={v} layout="list" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
