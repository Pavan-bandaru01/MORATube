"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Loader2,
  ArrowLeft,
  X,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const CATEGORIES = [
  { value: "MONEY_AWARENESS", label: "Money Awareness" },
  { value: "AI_TOOLS", label: "AI Tools" },
  { value: "FINANCE", label: "Finance" },
  { value: "INVESTING", label: "Investing" },
  { value: "DEBT_ESCAPE", label: "Debt Escape" },
  { value: "STUDENT_GROWTH", label: "Student Growth" },
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "MOTIVATION", label: "Motivation" },
];

export default function NotesUploadPage() {
  const router = useRouter();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("FINANCE");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState("PUBLIC");
  const [isUploading, setIsUploading] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);
  const [uploadedNoteId, setUploadedNoteId] = useState<string | null>(null);
  const [showFormatting, setShowFormatting] = useState(false);

  useEffect(() => {
    fetch("/api/user/role")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile?.role === "VIEWER") {
          router.replace("/dashboard/upgrade");
        } else {
          setRoleChecked(true);
        }
      })
      .catch(() => router.replace("/sign-in"));
  }, [router]);

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const insertMarkdown = (before: string, after: string = "") => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || "text";
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      const newPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!content.trim()) {
      toast.error("Note content is required");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", content.substring(0, 200));
    formData.append("category", category);
    formData.append("tags", JSON.stringify(tags));
    formData.append("visibility", visibility);
    formData.append("fileType", "notes");
    formData.append("extractedText", content);
    formData.append("cloudinaryId", `notes-${Date.now()}`);

    try {
      const response = await fetch("/api/upload/document", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadedNoteId(data.documentId || "");
        toast.success("Note published successfully!");
      } else {
        toast.error(data.error || "Upload failed");
        setIsUploading(false);
      }
    } catch (error) {
      toast.error("Failed to publish note");
      setIsUploading(false);
    }
  };

  if (!roleChecked) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-8 h-8 animate-spin text-[#6A1B9A]" />
      </div>
    );
  }

  if (uploadedNoteId) {
    return (
      <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-2xl mx-auto pt-24 pb-16">
        <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Note Published!</h2>
          <p className="text-gray-400 mb-6">Your note has been shared with the community.</p>
          
          <div className="space-y-3 mb-8">
            <button
              onClick={() => {
                setTitle("");
                setContent("");
                setTags([]);
                setUploadedNoteId(null);
              }}
              className="w-full block bg-[#6A1B9A] hover:bg-purple-800 text-white py-3 rounded-xl font-semibold transition"
            >
              Write Another Note
            </button>
            <Link
              href="/documents"
              className="w-full block bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#2C2C2C] text-white py-3 rounded-xl font-semibold transition"
            >
              View All Notes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A] pt-24 pb-16">
      {/* Back Button */}
      <Link href="/upload" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition max-w-4xl mx-auto px-4 md:px-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Upload Hub
      </Link>

      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Write Notes</h1>
          <p className="text-gray-400">Share your financial insights with the community</p>
        </div>

        {/* Editor Section */}
        <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl overflow-hidden">
          {/* Title Input */}
          <div className="border-b border-[#2C2C2C] p-6">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full bg-transparent text-4xl font-black outline-none placeholder-gray-600"
            />
          </div>

          {/* Formatting Toolbar */}
          <div className="border-b border-[#2C2C2C] bg-[#0A0A0A] p-4 flex flex-wrap gap-2">
            <button
              onClick={() => insertMarkdown("**", "**")}
              className="p-2 hover:bg-[#1F1F1F] rounded-lg transition flex items-center gap-2 text-sm"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
              <span className="hidden sm:inline">Bold</span>
            </button>
            <button
              onClick={() => insertMarkdown("*", "*")}
              className="p-2 hover:bg-[#1F1F1F] rounded-lg transition flex items-center gap-2 text-sm"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
              <span className="hidden sm:inline">Italic</span>
            </button>
            <button
              onClick={() => insertMarkdown("## ", "")}
              className="p-2 hover:bg-[#1F1F1F] rounded-lg transition flex items-center gap-2 text-sm"
              title="Heading"
            >
              <Heading2 className="w-4 h-4" />
              <span className="hidden sm:inline">Heading</span>
            </button>
            <button
              onClick={() => insertMarkdown("- ", "")}
              className="p-2 hover:bg-[#1F1F1F] rounded-lg transition flex items-center gap-2 text-sm"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Bullet</span>
            </button>
            <button
              onClick={() => insertMarkdown("1. ", "")}
              className="p-2 hover:bg-[#1F1F1F] rounded-lg transition flex items-center gap-2 text-sm"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <div className="flex-1" />
            <span className="text-xs text-gray-500 p-2">
              {content.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          {/* Editor */}
          <div className="p-6">
            <textarea
              ref={editorRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your financial insights, tips, or lessons..."
              className="w-full h-96 bg-transparent text-base leading-relaxed outline-none resize-none placeholder-gray-600"
            />
          </div>
        </div>

        {/* Metadata Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Category */}
          <div>
            <label className="text-sm font-semibold text-gray-300 block mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#141414] border border-[#2C2C2C] focus:border-[#6A1B9A]/50 rounded-xl px-4 py-3 outline-none text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Visibility */}
          <div>
            <label className="text-sm font-semibold text-gray-300 block mb-2">Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full bg-[#141414] border border-[#2C2C2C] focus:border-[#6A1B9A]/50 rounded-xl px-4 py-3 outline-none text-sm"
            >
              <option value="PUBLIC">Public</option>
              <option value="UNLISTED">Unlisted</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>

          {/* Word Count */}
          <div>
            <label className="text-sm font-semibold text-gray-300 block mb-2">Stats</label>
            <div className="bg-[#141414] border border-[#2C2C2C] rounded-xl px-4 py-3 text-sm">
              <div className="text-gray-300 font-semibold">{content.split(/\s+/).filter(Boolean).length} words</div>
              <div className="text-xs text-gray-500 mt-1">{content.length} characters</div>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="mt-6">
          <label className="text-sm font-semibold text-gray-300 block mb-2">Tags</label>
          <div className="flex gap-2 mb-3">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
              className="flex-1 bg-[#141414] border border-[#2C2C2C] focus:border-[#6A1B9A]/50 rounded-xl px-4 py-3 outline-none text-sm"
              placeholder="Add tags (press Enter)..."
            />
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div key={tag} className="flex items-center gap-2 bg-[#6A1B9A]/20 border border-[#6A1B9A]/50 px-3 py-1 rounded-full text-sm">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="text-[#6A1B9A] hover:text-purple-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <Link
            href="/upload"
            className="flex-1 bg-white/5 hover:bg-white/10 border border-[#2C2C2C] text-white py-3 rounded-xl font-bold transition text-center"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isUploading || !title.trim() || !content.trim()}
            className="flex-1 bg-[#6A1B9A] hover:bg-purple-800 disabled:bg-zinc-800 disabled:text-gray-500 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
              </>
            ) : (
              "Publish Note"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
