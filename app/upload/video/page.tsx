"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  ChevronRight,
  ChevronLeft,
  Loader2,
  FileVideo,
  X,
  ArrowLeft,
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
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function VideoUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [videoFile, setVideoFile] = useState<File | null>(null);
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
  const [uploadedVideoId, setUploadedVideoId] = useState<string | null>(null);

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
    const validTypes = ["video/mp4", "video/quicktime", "video/webm"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|mov|webm)$/i)) {
      toast.error("Please select an MP4, MOV, or WEBM file");
      return;
    }
    if (file.size > 2 * 1024 * 1024 * 1024) {
      toast.error("Video must be under 2GB");
      return;
    }
    setVideoFile(file);
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

  const uploadWithProgress = (formData: FormData): Promise<{ success: boolean; videoId?: string; error?: string }> => {
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
            resolve({ success: true, videoId: data.videoId });
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
    if (!videoFile || !title.trim()) {
      toast.error("Video file and title are required");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("videoFile", videoFile);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("tags", JSON.stringify(tags));
    formData.append("visibility", visibility);

    const result = await uploadWithProgress(formData);

    if (result.success) {
      setUploadedVideoId(result.videoId || "");
      toast.success("Video uploaded successfully!");
    } else {
      toast.error(result.error || "Upload failed");
      setIsUploading(false);
    }
  };

  if (!roleChecked) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E53935]" />
      </div>
    );
  }

  if (uploadedVideoId) {
    return (
      <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-2xl mx-auto pt-24 pb-16">
        <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Upload Complete!</h2>
          <p className="text-gray-400 mb-6">Your video has been published successfully.</p>
          
          <div className="space-y-3 mb-8">
            <Link
              href={`/videos/${uploadedVideoId}`}
              className="w-full block bg-[#E53935] hover:bg-[#D23428] text-white py-3 rounded-xl font-semibold transition"
            >
              View Your Video
            </Link>
            <button
              onClick={() => {
                setVideoFile(null);
                setTitle("");
                setDescription("");
                setTags([]);
                setStep(1);
                setUploadedVideoId(null);
              }}
              className="w-full bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#2C2C2C] text-white py-3 rounded-xl font-semibold transition"
            >
              Upload Another Video
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-3xl mx-auto pt-24 pb-16">
      {/* Back Button */}
      <Link href="/upload" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition">
        <ArrowLeft className="w-4 h-4" />
        Back to Upload Hub
      </Link>

      <h1 className="text-3xl font-black mb-2">Upload Video</h1>
      <p className="text-gray-400 mb-8">Step {step} of 3</p>

      {/* Progress Steps */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full transition ${
              s <= step ? "bg-[#E53935]" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Step 1: File Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition ${
              isDragging
                ? "border-[#E53935] bg-red-500/5"
                : videoFile
                ? "border-[#E53935]/50 bg-black"
                : "border-white/20 hover:border-white/40 bg-white/5"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            {videoFile ? (
              <div className="text-center px-6">
                <FileVideo className="w-12 h-12 text-[#E53935] mx-auto mb-3" />
                <p className="font-semibold">{videoFile.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatFileSize(videoFile.size)}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setVideoFile(null);
                  }}
                  className="mt-3 text-xs text-[#E53935] hover:text-red-400 flex items-center gap-1 mx-auto"
                >
                  <X className="w-3 h-3" /> Remove
                </button>
              </div>
            ) : (
              <>
                <UploadCloud className="w-12 h-12 text-gray-400 mb-3" />
                <p className="font-medium">Drag & drop your video here or click to browse</p>
                <p className="text-xs text-gray-500 mt-2">MP4, MOV, WEBM • Max 2GB</p>
              </>
            )}
          </div>

          <button
            onClick={() => videoFile && setStep(2)}
            disabled={!videoFile}
            className="w-full bg-[#E53935] hover:bg-red-700 disabled:bg-zinc-800 disabled:text-gray-500 text-white py-3 rounded-full font-bold transition flex items-center justify-center gap-2"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Video Details */}
      {step === 2 && (
        <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-6 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-300">
                Title <span className="text-[#E53935]">*</span>
              </label>
              <span className="text-xs text-gray-500">{title.length}/100</span>
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 100))}
              className="w-full bg-[#0A0A0A] border border-[#2C2C2C] focus:border-[#E53935]/50 rounded-xl px-4 py-3 outline-none text-sm"
              placeholder="Video title"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-300">Description</label>
              <span className="text-xs text-gray-500">{description.length}/5000</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 5000))}
              className="w-full h-28 bg-[#0A0A0A] border border-[#2C2C2C] focus:border-[#E53935]/50 rounded-xl px-4 py-3 outline-none text-sm resize-none"
              placeholder="Tell viewers about your video..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-300 block mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#2C2C2C] focus:border-[#E53935]/50 rounded-xl px-4 py-3 outline-none text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-300 block mb-2">
              Tags (Press Enter to add)
            </label>
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
                className="flex-1 bg-[#0A0A0A] border border-[#2C2C2C] focus:border-[#E53935]/50 rounded-xl px-4 py-3 outline-none text-sm"
                placeholder="Add a tag..."
              />
              <button
                onClick={() => addTag(tagInput)}
                className="px-4 py-3 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#2C2C2C] rounded-xl transition"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2 bg-[#E53935]/20 border border-[#E53935]/50 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-[#E53935] hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-[#2C2C2C] py-3 rounded-full font-bold transition flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => title.trim() && setStep(3)}
              disabled={!title.trim()}
              className="flex-1 bg-[#E53935] hover:bg-red-700 disabled:bg-zinc-800 text-white py-3 rounded-full font-bold transition flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Publish Settings */}
      {step === 3 && (
        <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-300 block mb-3">Visibility</label>
            <div className="space-y-2">
              {[
                { value: "PUBLIC", label: "Public", desc: "Everyone can see this video" },
                { value: "UNLISTED", label: "Unlisted", desc: "Only people with the link" },
                { value: "PRIVATE", label: "Private", desc: "Only you" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                    visibility === opt.value
                      ? "border-[#E53935] bg-red-500/5"
                      : "border-[#2C2C2C] hover:border-[#E53935]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={opt.value}
                    checked={visibility === opt.value}
                    onChange={() => setVisibility(opt.value)}
                    className="accent-[#E53935]"
                  />
                  <div>
                    <p className="font-semibold text-sm">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {isUploading && (
            <div className="space-y-3 bg-[#0A0A0A] p-4 rounded-xl">
              <p className="text-sm text-gray-300 font-semibold">Uploading to cloud...</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Upload progress</span>
                  <span className="text-[#E53935] font-semibold">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E53935] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setStep(2)}
              disabled={isUploading}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-[#2C2C2C] py-3 rounded-full font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className="flex-1 bg-[#E53935] hover:bg-red-700 disabled:bg-zinc-800 text-white py-3 rounded-full font-bold transition flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                </>
              ) : (
                "Publish Video"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
