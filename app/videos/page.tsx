import { getVideos } from "@/lib/actions";
import { Filter, LayoutGrid, List } from "lucide-react";
import VideoCard from "@/components/VideoCard";

export default async function VideosPage({ searchParams }: { searchParams: Promise<{ category?: string; search?: string }> }) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category || "all";
  const search = resolvedParams.search || "";
  
  const videos = await getVideos(category, search);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2">
            {search ? `Search Results` : `Explore Videos`}
          </h1>
          <p className="text-gray-400">
            {search 
              ? `Showing results for "${search}"` 
              : `Watch powerful awareness videos about money, AI, and growth.`}
          </p>
        </div>
      </div>

      {videos.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {videos.map((video: any) => (
            <VideoCard key={video.id} video={video} layout="grid" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">No videos found</h2>
          <p className="text-gray-400">Try selecting a different category.</p>
        </div>
      )}
    </div>
  );
}