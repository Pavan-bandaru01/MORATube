"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const GRADIENTS = [
  { name: "Charcoal Classic", value: "from-zinc-800 to-black" },
  { name: "Midnight Red", value: "from-red-900 via-red-950 to-black" },
  { name: "Sunset Gold", value: "from-orange-600 to-amber-900" },
  { name: "Forest Emerald", value: "from-emerald-800 to-zinc-900" },
  { name: "Ocean Sapphire", value: "from-blue-700 to-cyan-950" },
  { name: "Royal Violet", value: "from-violet-800 to-fuchsia-950" },
  { name: "Cyber Neon", value: "from-pink-600 via-purple-700 to-blue-850" },
];

export default function UploadBookForm() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [pages, setPages] = useState("");
  const [purchaseUrl, setPurchaseUrl] = useState("");
  const [coverGradient, setCoverGradient] = useState("from-zinc-800 to-black");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Document file must be under 50MB");
        return;
      }
      setSelectedFile(file);
      // Auto-populate title if empty
      if (!title) {
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setTitle(nameWithoutExt);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please add a title");
      return;
    }
    if (!author.trim()) {
      toast.error("Please specify the author name");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    setIsUploading(true);

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          description: description.trim(),
          category,
          pages: parseInt(pages) || 0,
          purchaseUrl: purchaseUrl.trim() || null,
          coverGradient,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadSuccess(true);
      toast.success("Document uploaded successfully!");

      // Redirect to books page after 1.5 seconds
      setTimeout(() => {
        router.push("/books");
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
        <h2 className="text-2xl font-bold">Document Uploaded!</h2>
        <p className="text-gray-400 text-sm">Redirecting to Library...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* File Upload Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">Document File (PDF / EPUB)</label>
        <div className={`relative h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition overflow-hidden group ${selectedFile ? 'border-red-500/50 bg-black' : 'border-white/20 hover:border-white/40 bg-white/5'}`}>
          {selectedFile ? (
            <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-sm line-clamp-1">{selectedFile.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <button type="button" onClick={() => setSelectedFile(null)} className="text-xs bg-zinc-800 px-3 py-1 rounded-full text-white hover:bg-red-600 transition">
                Remove File
              </button>
            </div>
          ) : (
            <>
              <UploadCloud className="w-10 h-10 text-gray-400 mb-3 group-hover:text-white transition" />
              <p className="text-sm font-medium">Click or drag document</p>
              <p className="text-xs text-gray-500 mt-1">PDF, EPUB up to 50MB</p>
              <input type="file" accept=".pdf,.epub" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
            </>
          )}
        </div>
      </div>

      {/* Preview cover and Cover Gradient Choice */}
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Book Preview */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-300">Book Cover Preview</label>
          <div className={`aspect-[2/3] w-full bg-gradient-to-br ${coverGradient} rounded-2xl border border-white/10 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden shadow-2xl`}>
            <div className="absolute inset-0 bg-black/10" />
            <h3 className="text-lg font-black leading-tight z-10 text-white line-clamp-3">
              {title || "Untitled Book"}
            </h3>
            <p className="text-xs opacity-80 mt-2 z-10 font-medium line-clamp-1">
              {author || "Author Name"}
            </p>
          </div>
        </div>

        {/* Gradient Selector */}
        <div className="md:col-span-2 space-y-4">
          <label className="block text-sm font-semibold text-gray-300">Select Library Cover Style</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GRADIENTS.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setCoverGradient(g.value)}
                className={`h-16 rounded-xl bg-gradient-to-br ${g.value} p-3 flex flex-col justify-end text-left border relative transition hover:scale-[1.02] group ${coverGradient === g.value ? 'border-red-500 ring-2 ring-red-500/20' : 'border-white/10'}`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition" />
                <span className="text-[10px] font-bold text-white z-10 truncate">{g.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="glass p-6 rounded-3xl space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">Book Title <span className="text-red-400">*</span></label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Psychology of Money"
              className="w-full bg-zinc-900 border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-3 outline-none transition text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">Author Name <span className="text-red-400">*</span></label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Morgan Housel"
              className="w-full bg-zinc-900 border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-3 outline-none transition text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a summary or core takeaways from the book..."
            className="w-full h-32 bg-zinc-900 border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-3 outline-none transition text-sm resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
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
              <option value="habits">Money Habits</option>
              <option value="growth">Student Growth</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">Number of Pages</label>
            <input
              type="number"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="e.g. 250"
              className="w-full bg-zinc-900 border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-3 outline-none transition text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">Purchase or External Link</label>
            <input
              type="url"
              value={purchaseUrl}
              onChange={(e) => setPurchaseUrl(e.target.value)}
              placeholder="e.g. https://amazon.com/..."
              className="w-full bg-zinc-900 border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-3 outline-none transition text-sm"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <AlertCircle className="w-4 h-4" />
            <span>Document file upload is mocked. Metadata and Cover design are saved to DB.</span>
          </div>
          <button
            type="submit"
            disabled={isUploading || !title.trim() || !author.trim() || !category}
            className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-gray-500 text-white px-8 py-3 rounded-full font-bold transition flex items-center gap-2 whitespace-nowrap"
          >
            {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</> : 'Publish Document'}
          </button>
        </div>
      </div>
    </form>
  );
}
