"use client";

import PostCard from "@/components/PostCard";
import { Users, PenSquare, Image, Video } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface Post {
  id: string;
  title: string;
  content: string;
  uploadedBy: string;
  channelName: string;
  likes: number;
  createdAt: string;
}

interface PostCardData {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  title: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
}

export default function CommunityPage() {
  const { user, isSignedIn } = useUser();
  const [posts, setPosts] = useState<PostCardData[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/community/posts");
      if (res.ok) {
        const data = await res.json();
        const transformedPosts = data.posts.map((post: Post) => ({
          id: post.id,
          author: {
            name: post.channelName,
            avatar: post.channelName[0] || "U",
            role: "Creator",
          },
          title: post.title,
          content: post.content,
          likes: post.likes,
          comments: 0,
          shares: 0,
          createdAt: new Date(post.createdAt).toLocaleString(),
        }));
        setPosts(transformedPosts);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostIdea = async () => {
    if (!isSignedIn) {
      alert("Please sign in to post");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("Please enter both title and content");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        await fetchPosts();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      {isSignedIn && (
        <div className="glass rounded-3xl p-4 md:p-6 mb-10">
          <div className="flex gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-zinc-800 flex items-center justify-center font-bold text-white shrink-0 shadow-lg">
              {user?.firstName?.[0] || "U"}
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/10 focus:border-red-500/50 rounded-2xl p-4 text-white outline-none min-h-[40px] transition text-sm resize-none mb-2"
              />
              <textarea
                placeholder="Share an idea, ask a question, or post a learning..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-black/40 border border-white/10 focus:border-red-500/50 rounded-2xl p-4 text-white outline-none min-h-[100px] transition text-sm resize-none"
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
            <button
              onClick={handlePostIdea}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-white px-6 py-2 rounded-full font-bold transition flex items-center justify-center gap-2 text-sm"
            >
              <PenSquare className="w-4 h-4" /> {isSubmitting ? "Posting..." : "Post Idea"}
            </button>
          </div>
        </div>
      )}

      {/* Feed Filters */}
      <div className="flex border-b border-white/10 mb-6 overflow-x-auto hide-scrollbar">
        <button className="px-6 py-3 text-sm font-bold border-b-2 border-red-500 text-white whitespace-nowrap">Latest</button>
        <button className="px-6 py-3 text-sm font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition whitespace-nowrap">Top Discussions</button>
        <button className="px-6 py-3 text-sm font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition whitespace-nowrap">My Posts</button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}