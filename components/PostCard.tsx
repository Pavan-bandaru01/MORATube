"use client";

import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import type { Post } from "@/types";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function PostCard({ post }: { post: Post }) {
  const { isSignedIn } = useUser();
  const [likes, setLikes] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!isSignedIn) {
      alert("Please sign in to like posts");
      return;
    }

    try {
      setIsLiking(true);
      const res = await fetch(`/api/community/posts/${post.id}/like`, {
        method: "POST",
      });

      if (res.ok) {
        setLikes(likes + 1);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-5 transition-colors hover:bg-white/[0.07]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-zinc-800 flex items-center justify-center text-white font-bold border border-white/10">
            {post.author.avatar || post.author.name[0] || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[15px]">{post.author.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-medium border border-red-500/20">
                {post.author.role || 'Creator'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {post.createdAt}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white transition">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2 leading-snug">{post.title}</h2>
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {post.imageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden border border-white/10">
          <div className="aspect-video bg-zinc-900" />
        </div>
      )}

      <div className="flex items-center gap-6 pt-4 border-t border-white/5">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition group disabled:opacity-50"
        >
          <div className="p-1.5 rounded-full group-hover:bg-red-500/10 transition">
            <Heart className="w-5 h-5 group-hover:fill-red-400/20" />
          </div>
          <span className="font-medium">{likes}</span>
        </button>

        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition group">
          <div className="p-1.5 rounded-full group-hover:bg-blue-500/10 transition">
            <MessageSquare className="w-5 h-5 group-hover:fill-blue-400/20" />
          </div>
          <span className="font-medium">{post.comments}</span>
        </button>

        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition group">
          <div className="p-1.5 rounded-full group-hover:bg-green-500/10 transition">
            <Share2 className="w-5 h-5 group-hover:fill-green-400/20" />
          </div>
          <span className="font-medium">Share</span>
        </button>
      </div>
    </div>
  );
}
