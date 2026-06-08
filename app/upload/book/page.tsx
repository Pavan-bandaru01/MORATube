"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Book,
  Image as ImageIcon,
  Loader2,
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
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function BookUploadPage() {
  const router = useRouter();
  const bookInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("FINANCE");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);
  const [uploadedBookId, setUploadedBookId] = useState<string | null>(null);

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

  const handleBookFile = (file: File) => {
    if (!file.name.match(/\.(pdf|epub)$/i)) {
      toast.error("Please select a PDF or EPUB file");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Book must be under 100MB");
      return;
    }
    setBookFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^.]+$/, ""));
    }
  };

  const handleCoverFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file for the cover");
      return;
    }
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
    if (file) handleBookFile(file);
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

  const uploadWithProgress = (formData: FormData) => {
    return new Promise<{ success: boolean; bookId?: string; error?: string }>((resolve) => {
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
            resolve({ success: true, bookId: data.bookId || data.documentId });
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
    if (!bookFile || !title.trim() || !coverFile) {
      toast.error("Book file, cover image, and title are required");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("documentFile", bookFile);
    formData.append("coverFile", coverFile);
    formData.append("title", title.trim());
    formData.append("author", author.trim() || "Unknown Author");
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("tags", JSON.stringify(tags));
    formData.append("publisher", publisher.trim());
    formData.append("year", year);
    formData.append("isbn", isbn.trim());
    formData.append("fileType", "book");

    const result = await uploadWithProgress(formData);

    if (result.success) {
      setUploadedBookId(result.bookId || "");
      toast.success("Book uploaded successfully!");
    } else {
      toast.error(result.error || "Upload failed");
      setIsUploading(false);
    }
  };

  if (!roleChecked) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
      </div>
    );
  }

  if (uploadedBookId) {
    return (
      <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-2xl mx-auto pt-24 pb-16">
        <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Book Published!</h2>
          <p className="text-gray-400 mb-6">Your book is now available in the Book Library.</p>
          
          <div className="space-y-3 mb-8">
            <Link
              href="/book-library"
              className="w-full block bg-[#2E7D32] hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
              View in Book Library
            </Link>
            <button
              onClick={() => {
                setBookFile(null);
                setCoverFile(null);
                setCoverPreview(null);
                setTitle("");
                setAuthor("");
                setPublisher("");
                setIsbn("");
                setDescription("");
                setTags([]);
                setUploadedBookId(null);
              }}
              className="w-full bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#2C2C2C] text-white py-3 rounded-xl font-semibold transition"
            >
              Upload Another Book
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

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-2">Upload Book</h1>
        <p className="text-gray-400 mb-8">Share finance books and investment guides with our community</p>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Book Preview */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="w-full max-w-xs">
              {/* Book Cover Preview */}
              <div className="aspect-[3/4] bg-[#141414] border border-[#2C2C2C] rounded-xl overflow-hidden flex items-center justify-center shadow-2xl">
                {coverPreview ? (
                  <img src={coverPreview} alt="Book Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6">
                    <Book className="w-12 h-12 text-gray-600 mb-3" />
                    <p className="text-sm text-gray-500">Upload a cover image</p>
                  </div>
                )}
              </div>

              {/* Book Info */}
              <div className="mt-6 space-y-2">
                {title && <h3 className="font-bold text-sm truncate">{title}</h3>}
                {author && <p className="text-xs text-gray-500">by {author}</p>}
                {publisher && <p className="text-xs text-gray-500">{publisher}</p>}
              </div>

              {/* Cover Upload Button */}
              <button
                onClick={() => coverInputRef.current?.click()}
                className="w-full mt-6 bg-[#2E7D32] hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                {coverFile ? "Change Cover" : "Upload Cover"}
              </button>
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

              {coverFile && (
                <button
                  onClick={() => {
                    setCoverFile(null);
                    setCoverPreview(null);
                  }}
                  className="w-full mt-2 text-xs text-red-400 hover:text-red-300"
                >
                  Remove Cover
                </button>
              )}
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2 space-y-5">
            {/* File Upload */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => bookInputRef.current?.click()}
              className={`relative h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition ${
                isDragging
                  ? "border-[#2E7D32] bg-green-500/5"
                  : bookFile
                  ? "border-[#2E7D32]/50 bg-black"
                  : "border-white/20 hover:border-white/40 bg-white/5"
              }`}
            >
              <input
                ref={bookInputRef}
                type="file"
                accept=".pdf,.epub"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleBookFile(file);
                }}
              />
              {bookFile ? (
                <div className="text-center px-6">
                  <p className="font-semibold text-sm">{bookFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatFileSize(bookFile.size)}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBookFile(null);
                    }}
                    className="mt-3 text-xs text-[#2E7D32] hover:text-green-500 flex items-center gap-1 mx-auto"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium">Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, EPUB • Max 100MB</p>
                </>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-semibold text-gray-300 block mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 200))}
                className="w-full bg-[#141414] border border-[#2C2C2C] focus:border-[#2E7D32]/50 rounded-xl px-4 py-3 outline-none text-sm"
                placeholder="Book title..."
              />
            </div>

            {/* Author & Publisher */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">Author</label>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2C2C2C] focus:border-[#2E7D32]/50 rounded-xl px-4 py-3 outline-none text-sm"
                  placeholder="Author name..."
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">Publisher</label>
                <input
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2C2C2C] focus:border-[#2E7D32]/50 rounded-xl px-4 py-3 outline-none text-sm"
                  placeholder="Publisher..."
                />
              </div>
            </div>

            {/* Year & ISBN */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2C2C2C] focus:border-[#2E7D32]/50 rounded-xl px-4 py-3 outline-none text-sm"
                  placeholder="2024"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">ISBN (optional)</label>
                <input
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2C2C2C] focus:border-[#2E7D32]/50 rounded-xl px-4 py-3 outline-none text-sm"
                  placeholder="ISBN..."
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-gray-300 block mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
                className="w-full h-24 bg-[#141414] border border-[#2C2C2C] focus:border-[#2E7D32]/50 rounded-xl px-4 py-3 outline-none text-sm resize-none"
                placeholder="Describe your book..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-semibold text-gray-300 block mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#141414] border border-[#2C2C2C] focus:border-[#2E7D32]/50 rounded-xl px-4 py-3 outline-none text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
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
                  className="flex-1 bg-[#141414] border border-[#2C2C2C] focus:border-[#2E7D32]/50 rounded-xl px-4 py-3 outline-none text-sm"
                  placeholder="Add a tag..."
                />
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div key={tag} className="flex items-center gap-2 bg-[#2E7D32]/20 border border-[#2E7D32]/50 px-3 py-1 rounded-full text-sm">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="text-[#2E7D32] hover:text-green-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2 bg-[#141414] p-4 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Uploading...</span>
                  <span className="text-[#2E7D32] font-semibold">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2E7D32] transition-all duration-300"
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
                disabled={isUploading || !bookFile || !title.trim() || !coverFile}
                className="flex-1 bg-[#2E7D32] hover:bg-green-700 disabled:bg-zinc-800 disabled:text-gray-500 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  "Publish Book"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
