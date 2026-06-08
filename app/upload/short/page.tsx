"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Loader2,
  X,
  ArrowLeft,
  AlertCircle,
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

function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ShortUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shortFile, setShortFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("FINANCE");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState("PUBLIC");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);
  const [uploadedShortId, setUploadedShortId] = useState<string | null>(null);

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

  const handleFile = (file: File) => {
    const validTypes = ["video/mp4", "video/quicktime"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|mov)$/i)) {
      toast.error("Please select an MP4 or MOV file");
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      toast.error("Short must be under 500MB");
      return;
    }
    setShortFile(file);
    if (!title) {
      const name = file.name.replace(/\.[^.]+$/, "");
      setTitle(name);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [title]);

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

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

  const uploadWithProgress = (formData: FormData): Promise<{ success: boolean; shortId?: string; error?: string }> => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload/video");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({ success: true, shortId: data.videoId });
          } else {
            resolve({ success: false, error: data.error || "Upload failed" });
          }
        } catch {
          resolve({ success: false, error: "Upload failed" });
        }
      };

      xhr.onerror = () => resolve({ success: false, error: "Network error" });
      xhr.send(formData);
    });
  };

  const handleSubmit = async () => {
    if (!shortFile || !title.trim()) {
      toast.error("Video file and title are required");
      return;
    }

    if (duration > 60) {
      toast.error("Short videos must be 60 seconds or less");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("videoFile", shortFile);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("tags", JSON.stringify(tags));
    formData.append("visibility", visibility);
    formData.append("contentType", "SHORT");

    const result = await uploadWithProgress(formData);

    if (result.success) {
      setUploadedShortId(result.shortId || "");
      toast.success("Short uploaded successfully!");
    } else {
      toast.error(result.error || "Upload failed");
      setIsUploading(false);
    }
  };

  if (!roleChecked) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
      </div>
    );
  }

  if (uploadedShortId) {
    return (
      <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-2xl mx-auto pt-24 pb-16">
        <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Upload Complete!</h2>
          <p className="text-gray-400 mb-6">Your short has been published successfully.</p>
          
          <div className="space-y-3 mb-8">
            <Link
              href={`/shorts/${uploadedShortId}`}
              className="w-full block bg-[#FF6B00] hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition"
            >
              View Your Short
            </Link>
            <button
              onClick={() => {
                setShortFile(null);
                setTitle("");
                setDescription("");
                setTags([]);
                setDuration(0);
                setUploadedShortId(null);
              }}
              className="w-full bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#2C2C2C] text-white py-3 rounded-xl font-semibold transition"
            >
              Upload Another Short
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 bg-[#0A0A0A] pt-24 pb-16">
      {/* Back Button */}
      <Link href="/upload" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition max-w-7xl mx-auto">
        <ArrowLeft className="w-4 h-4" />
        Back to Upload Hub
      </Link>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-2">Upload Short</h1>
        <p className="text-gray-400 mb-8">Create a 60-second vertical video</p>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Phone Mockup */}
          <div className="flex justify-center items-start">
            <div className="relative w-full max-w-sm">
              {/* Phone Frame */}
              <div className="bg-black rounded-3xl p-2 shadow-2xl border-8 border-gray-800">
                <div className="relative w-full aspect-[9/16] bg-[#141414] rounded-2xl overflow-hidden flex items-center justify-center">
                  {shortFile && videoRef.current ? (
                    <video
                      ref={videoRef}
                      src={URL.createObjectURL(shortFile)}
                      className="w-full h-full object-cover"
                      onLoadedMetadata={handleVideoLoadedMetadata}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-6">
                      <UploadCloud className="w-12 h-12 text-gray-600 mb-3" />
                      <p className="text-sm text-gray-500">
                        {shortFile ? "Processing..." : "Upload a vertical short (9:16)"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Duration Badge */}
              {shortFile && (
                <div className={`mt-4 p-3 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                  duration > 60
                    ? "bg-red-500/20 border border-red-500/50 text-red-400"
                    : "bg-orange-500/20 border border-orange-500/50 text-orange-400"
                }`}>
                  {duration > 60 ? (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      Duration: {duration.toFixed(1)}s (exceeds 60s limit)
                    </>
                  ) : (
                    <>Duration: {duration.toFixed(1)}s</>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Upload Form */}
          <div className="space-y-6">
            {/* File Upload */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition ${
                isDragging
                  ? "border-[#FF6B00] bg-orange-500/5"
                  : shortFile
                  ? "border-[#FF6B00]/50 bg-black"
                  : "border-white/20 hover:border-white/40 bg-white/5"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,.mp4,.mov"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
              {shortFile ? (
                <div className="text-center px-6">
                  <p className="font-semibold text-sm">{shortFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(shortFile.size)}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShortFile(null);
                      setDuration(0);
                    }}
                    className="mt-3 text-xs text-[#FF6B00] hover:text-orange-500 flex items-center gap-1 mx-auto"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium">Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">MP4, MOV • Max 60 seconds</p>
                </>
              )}
            </div>

            {/* Title */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-300">Title</label>
                <span className="text-xs text-gray-500">{title.length}/50</span>
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 50))}
                className="w-full bg-[#141414] border border-[#2C2C2C] focus:border-[#FF6B00]/50 rounded-xl px-4 py-3 outline-none text-sm"
                placeholder="Short title..."
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-300">Description</label>
                <span className="text-xs text-gray-500">{description.length}/500</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                className="w-full h-20 bg-[#141414] border border-[#2C2C2C] focus:border-[#FF6B00]/50 rounded-xl px-4 py-3 outline-none text-sm resize-none"
                placeholder="Share what your short is about..."
              />
            </div>

            {/* Category & Tags */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2C2C2C] focus:border-[#FF6B00]/50 rounded-xl px-4 py-3 outline-none text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
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
                  className="flex-1 bg-[#141414] border border-[#2C2C2C] focus:border-[#FF6B00]/50 rounded-xl px-4 py-3 outline-none text-sm"
                  placeholder="Add a tag..."
                />
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-2 bg-[#FF6B00]/20 border border-[#FF6B00]/50 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-[#FF6B00] hover:text-orange-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Visibility */}
            <div>
              <label className="text-sm font-semibold text-gray-300 block mb-2">Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full bg-[#141414] border border-[#2C2C2C] focus:border-[#FF6B00]/50 rounded-xl px-4 py-3 outline-none text-sm"
              >
                <option value="PUBLIC">Public - Anyone can see</option>
                <option value="UNLISTED">Unlisted - Only with link</option>
                <option value="PRIVATE">Private - Only me</option>
              </select>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2 bg-[#141414] p-4 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Uploading...</span>
                  <span className="text-[#FF6B00] font-semibold">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF6B00] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Link
                href="/upload"
                className="flex-1 bg-white/5 hover:bg-white/10 border border-[#2C2C2C] text-white py-3 rounded-xl font-bold transition text-center"
              >
                Cancel
              </Link>
              <button
                onClick={handleSubmit}
                disabled={isUploading || !shortFile || !title.trim() || duration > 60}
                className="flex-1 bg-[#FF6B00] hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-gray-500 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  "Publish Short"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
