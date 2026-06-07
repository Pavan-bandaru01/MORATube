"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Image as ImageIcon, X, Loader2, Play, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function UploadForm() {
  const router = useRouter();
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("public");

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024 * 1024) {
        toast.error("Video file must be under 2GB");
        return;
      }
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Thumbnail must be under 5MB");
        return;
      }
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please add a title");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    setIsUploading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          visibility,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadSuccess(true);
      toast.success("Video uploaded successfully!");

      // Redirect to the video page after 1.5 seconds
      setTimeout(() => {
        router.push(`/videos/${data.video.id}`);
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold">Video Uploaded!</h2>
        <p className="text-gray-400 text-sm">Redirecting to your video...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Media Upload Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Video Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-300">Video File</label>
          <div className={`relative aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition overflow-hidden group ${videoPreview ? 'border-red-500/50 bg-black' : 'border-white/20 hover:border-white/40 bg-white/5'}`}>
            {videoPreview ? (
              <>
                <video src={videoPreview} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white">
                    <Play className="w-6 h-6 ml-1" />
                  </div>
                  <button type="button" onClick={() => setVideoPreview(null)} className="text-xs bg-black/80 px-3 py-1 rounded-full text-white hover:bg-red-600 transition">
                    Remove Video
                  </button>
                </div>
              </>
            ) : (
              <>
                <UploadCloud className="w-10 h-10 text-gray-400 mb-3 group-hover:text-white transition" />
                <p className="text-sm font-medium">Click or drag video</p>
                <p className="text-xs text-gray-500 mt-1">MP4, WEBM up to 2GB</p>
                <input type="file" accept="video/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleVideoChange} />
              </>
            )}
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-300">Thumbnail</label>
          <div className={`relative aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition overflow-hidden group ${thumbnailPreview ? 'border-red-500/50' : 'border-white/20 hover:border-white/40 bg-white/5'}`}>
            {thumbnailPreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumbnailPreview} alt="Thumbnail preview" className="absolute inset-0 w-full h-full object-cover" />
                <button type="button" onClick={() => setThumbnailPreview(null)} className="absolute top-2 right-2 p-1.5 bg-black/80 rounded-full text-white hover:bg-red-600 transition">
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <ImageIcon className="w-10 h-10 text-gray-400 mb-3 group-hover:text-white transition" />
                <p className="text-sm font-medium">Upload thumbnail</p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleThumbnailChange} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="glass p-6 rounded-3xl space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">Title <span className="text-red-400">*</span></label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a title that sparks curiosity..."
            className="w-full bg-zinc-900 border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-3 outline-none transition text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell viewers about your video..."
            className="w-full h-32 bg-zinc-900 border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-3 outline-none transition text-sm resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">Category <span className="text-red-400">*</span></label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-3 outline-none transition text-sm appearance-none cursor-pointer"
              required
            >
              <option value="">Select a category</option>
              <option value="money">Money Awareness</option>
              <option value="ai">AI Tools</option>
              <option value="finance">Finance</option>
              <option value="debt">Debt Escape</option>
              <option value="growth">Student Growth</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-3 outline-none transition text-sm appearance-none cursor-pointer"
            >
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <AlertCircle className="w-4 h-4" />
            <span>Video file upload to cloud coming soon. Metadata is saved to database.</span>
          </div>
          <button
            type="submit"
            disabled={isUploading || !title.trim() || !category}
            className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-gray-500 text-white px-8 py-3 rounded-full font-bold transition flex items-center gap-2 whitespace-nowrap"
          >
            {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</> : 'Publish Video'}
          </button>
        </div>
      </div>
    </form>
  );
}