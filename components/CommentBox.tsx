"use client";

import { ThumbsUp, MoreVertical, Send } from "lucide-react";
import type { Comment } from "@/types";
import { useState } from "react";

export default function CommentBox({ comments }: { comments: Comment[] }) {
  const [newComment, setNewComment] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-white shrink-0">
          U
        </div>
        <div className="flex-1 flex flex-col items-end gap-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-2 transition text-sm"
          />
          {newComment && (
            <div className="flex gap-2">
              <button 
                onClick={() => setNewComment("")}
                className="px-4 py-2 rounded-full hover:bg-white/10 text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition flex items-center gap-2">
                <Send className="w-4 h-4" /> Comment
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 mt-8">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 group">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white shrink-0">
              {comment.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm text-white">@{comment.name.toLowerCase().replace(" ", "")}</span>
                <span className="text-xs text-gray-500">{comment.time}</span>
              </div>
              <p className="text-sm text-gray-300 mb-2">{comment.text}</p>
              
              <div className="flex items-center gap-4 text-gray-400">
                <button className="flex items-center gap-1.5 hover:text-white transition group/btn">
                  <ThumbsUp className="w-4 h-4 group-hover/btn:text-red-500 transition" />
                  <span className="text-xs">{comment.likes}</span>
                </button>
                <button className="text-xs font-semibold hover:text-white transition">
                  Reply
                </button>
              </div>
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-full transition self-start">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
