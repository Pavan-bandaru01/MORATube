import { notFound } from "next/navigation";
import { videos } from "@/data/videos";
import { shorts } from "@/data/shorts";
import { posts } from "@/data/posts";
import VideoCard from "@/components/VideoCard";
import ShortCard from "@/components/ShortCard";
import PostCard from "@/components/PostCard";
import { BellRing, PlaySquare, MonitorPlay, MessageSquare, Info } from "lucide-react";

// Note: params is a promise in Next.js 15+
export default async function ChannelPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  // Find a video created by this username to mock the channel info
  const creatorVideo = videos.find((v) => v.creator.username === username);
  
  if (!creatorVideo) {
    // Return a mock channel if we don't have matching videos
    // In a real app this would query the db
    notFound();
  }

  const creator = creatorVideo.creator;
  
  // Mock content arrays
  const channelVideos = videos.slice(0, 4);
  const channelShorts = shorts.slice(0, 4);
  const channelPosts = posts.slice(0, 2);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Channel Banner */}
      <div className={`h-48 md:h-64 lg:h-80 w-full bg-gradient-to-br ${creator.bannerGradient}`} />
      
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        {/* Channel Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12 md:-mt-16 mb-8 relative z-10">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#050505] bg-zinc-800 flex items-center justify-center text-4xl md:text-5xl font-black text-white shrink-0 shadow-xl">
            {creator.avatar}
          </div>
          
          <div className="flex-1 text-center md:text-left mb-2 md:mb-4">
            <h1 className="text-3xl font-black">{creator.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 mt-1 text-gray-400">
              <span className="font-semibold text-white">@{creator.username}</span>
              <span>{creator.subscribers} subscribers</span>
              <span>{channelVideos.length} videos</span>
            </div>
            <p className="mt-3 text-sm text-gray-300 max-w-2xl">{creator.bio}</p>
          </div>
          
          <div className="mb-2 md:mb-4">
            <button className="bg-white hover:bg-gray-200 text-black px-6 py-2.5 rounded-full font-bold transition flex items-center gap-2">
              Subscribe <BellRing className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Channel Navigation */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto hide-scrollbar">
          <button className="px-6 py-4 text-sm font-bold border-b-2 border-white text-white whitespace-nowrap">Home</button>
          <button className="px-6 py-4 text-sm font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition whitespace-nowrap flex items-center gap-2"><PlaySquare className="w-4 h-4"/> Videos</button>
          <button className="px-6 py-4 text-sm font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition whitespace-nowrap flex items-center gap-2"><MonitorPlay className="w-4 h-4"/> Shorts</button>
          <button className="px-6 py-4 text-sm font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition whitespace-nowrap flex items-center gap-2"><MessageSquare className="w-4 h-4"/> Community</button>
          <button className="px-6 py-4 text-sm font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition whitespace-nowrap flex items-center gap-2"><Info className="w-4 h-4"/> About</button>
        </div>

        {/* Channel Content Sections */}
        <div className="space-y-12 pb-16">
          {/* Latest Videos */}
          <section>
            <h2 className="text-xl font-bold mb-4">Latest Videos</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {channelVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>

          {/* Popular Shorts */}
          <section>
            <h2 className="text-xl font-bold mb-4">Popular Shorts</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
              {channelShorts.map((short) => (
                <div key={short.id} className="w-64 shrink-0">
                  <div className={`relative aspect-[9/16] rounded-2xl overflow-hidden group cursor-pointer`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${short.gradient} opacity-80 group-hover:scale-105 transition duration-500`} />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="font-bold leading-tight line-clamp-2">{short.title}</h3>
                      <p className="text-xs text-gray-300 mt-2">{short.views} views</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Community Posts */}
          <section className="max-w-3xl">
            <h2 className="text-xl font-bold mb-4">Community</h2>
            <div className="space-y-4">
              {channelPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
