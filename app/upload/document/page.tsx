"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Loader2,
  X,
  ArrowLeft,
} from "lucide-react";
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

export default function DocumentUploadPage() {
  const router = useRouter();
  const docInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("FINANCE");
  const [tags, setTags] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);

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

  const handleDocFile = (file: File) => {
    if (!file.name.match(/\.(pdf|epub|docx)$/i)) {
      toast.error("Please select a PDF, EPUB, or DOCX file");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Document must be under 50MB");
      return;
    }
    setDocumentFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^.]+$/, ""));
    }
  };

  const handleCoverFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Cover image must be under 5MB");
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleDocFile(file);
  }, [title]);

  const uploadWithProgress = (formData: FormData) => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload/document");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({ success: true });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentFile || !title.trim()) {
      toast.error("Document file and title are required");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("documentFile", documentFile);
    if (coverFile) formData.append("coverFile", coverFile);
    formData.append("title", title.trim());
    formData.append("author", author.trim());
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("tags", tags);

    const result = await uploadWithProgress(formData);

    if (result.success) {
      toast.success("Document uploaded successfully!");
      router.push("/dashboard");
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

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-black mb-2">Upload Document</h1>
      <p className="text-gray-400 mb-8">Share PDFs, EPUBs, or DOCX files with the community.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document File */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => docInputRef.current?.click()}
          className={`relative h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition ${
            isDragging
              ? "border-red-500 bg-red-500/5"
              : documentFile
              ? "border-red-500/50 bg-black"
              : "border-white/20 hover:border-white/40 bg-white/5"
          }`}
        >
          <input
            ref={docInputRef}
            type="file"
            accept=".pdf,.epub,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleDocFile(file);
            }}
          />
          {documentFile ? (
            <div className="text-center px-6">
              <FileText className="w-10 h-10 text-red-500 mx-auto mb-2" />
              <p className="font-semibold text-sm">{documentFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(documentFile.size)}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDocumentFile(null);
                }}
                className="mt-2 text-xs text-red-400 flex items-center gap-1 mx-auto"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            </div>
          ) : (
            <>
              <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm font-medium">Drag & drop or click to select</p>
              <p className="text-xs text-gray-500">PDF, EPUB, DOCX up to 50MB</p>
            </>
          )}
        </div>

        {/* Cover Image */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">Cover Image (optional)</label>
          <div
            onClick={() => coverInputRef.current?.click()}
            className="relative h-32 rounded-2xl border-2 border-dashed border-white/20 hover:border-white/40 bg-white/5 flex items-center justify-center cursor-pointer overflow-hidden"
          >
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCoverFile(file);
              }}
            />
            {coverPreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverPreview} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCoverFile(null);
                    setCoverPreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-black/80 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm">Upload cover image</span>
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-3xl p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-3 outline-none text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Author</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-3 outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 bg-zinc-900 border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-3 outline-none text-sm resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-3 outline-none text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Tags</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-3 outline-none text-sm"
                placeholder="comma separated"
              />
            </div>
          </div>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Uploading...</span>
              <span className="text-red-400 font-semibold">{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading || !documentFile || !title.trim()}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white py-3 rounded-full font-bold transition flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
            </>
          ) : (
            "Publish Document"
          )}
        </button>
      </form>
    </div>
  );
}
