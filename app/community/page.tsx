import PostCard from "@/components/PostCard";
import { getPosts } from "@/lib/actions";
import { Users, PenSquare, Image, Video } from "lucide-react";

export default async function CommunityPage() {
  const posts = await getPosts();
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-red-500" /> MORA Community
        </h1>
        <p className="text-gray-400">
          A social learning space to share ideas, awareness posts, finance lessons, and real-life growth stories.
        </p>
      </div>

      {/* Create Post Area */}
      <div className="glass rounded-3xl p-4 md:p-6 mb-10">
        <div className="flex gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-zinc-800 flex items-center justify-center font-bold text-white shrink-0 shadow-lg">
            U
          </div>
          <div className="flex-1">
            <textarea
              placeholder="Share an idea, ask a question, or post a learning..."
              className="w-full bg-black/40 border border-white/10 focus:border-red-500/50 rounded-2xl p-4 text-white outline-none min-h-[120px] transition text-sm resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ml-16">
          <div className="flex gap-2">
            <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs font-semibold transition flex items-center gap-2 text-gray-300">
              <Image className="w-4 h-4" /> Image
            </button>
            <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs font-semibold transition flex items-center gap-2 text-gray-300">
              <Video className="w-4 h-4" /> Video
            </button>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition flex items-center justify-center gap-2 text-sm">
            <PenSquare className="w-4 h-4" /> Post Idea
          </button>
        </div>
      </div>

      {/* Feed Filters */}
      <div className="flex border-b border-white/10 mb-6 overflow-x-auto hide-scrollbar">
        <button className="px-6 py-3 text-sm font-bold border-b-2 border-red-500 text-white whitespace-nowrap">Latest</button>
        <button className="px-6 py-3 text-sm font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition whitespace-nowrap">Top Discussions</button>
        <button className="px-6 py-3 text-sm font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition whitespace-nowrap">My Posts</button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}