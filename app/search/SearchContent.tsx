"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FileText, Play, Search } from "lucide-react";

interface SearchVideo {
  id: string;
  title: string;
  channelName: string;
  views: number;
  thumbnailUrl: string;
}

interface SearchDocument {
  id: string;
  title: string;
  channelName: string;
  views: number;
  coverUrl: string | null;
}

type Tab = "videos" | "documents";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState<Tab>("videos");
  const [videos, setVideos] = useState<SearchVideo[]>([]);
  const [documents, setDocuments] = useState<SearchDocument[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query.trim()) {
      setVideos([]);
      setDocuments([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.videos || []);
        setDocuments(data.documents || []);
        setTotal(data.total || 0);
      })
      .catch(() => {
        setVideos([]);
        setDocuments([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [query]);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-[1400px] mx-auto">
      <h1 className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-3">
        <Search className="w-7 h-7 text-red-500" />
        {query
          ? `${total} result${total !== 1 ? "s" : ""} for '${query}'`
          : "Search MORA Tube"}
      </h1>

      {query && (
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === "videos"
                ? "bg-red-600 text-white"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            Videos ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === "documents"
                ? "bg-red-600 text-white"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            Documents ({documents.length})
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Searching...</p>
      ) : !query ? (
        <p className="text-gray-400">Enter a search term to find videos and documents.</p>
      ) : total === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <p className="text-gray-400">No results found. Try different keywords.</p>
        </div>
      ) : activeTab === "videos" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/videos/${video.id}`}
              className="group flex flex-col gap-3"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
                {video.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-black" />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 ml-0.5 text-white" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold line-clamp-2 group-hover:text-red-400 transition">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-400">{video.channelName}</p>
                <p className="text-sm text-gray-500">{formatViews(video.views)} views</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documents.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}`}
              className="group flex flex-col gap-3"
            >
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
                {doc.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={doc.coverUrl}
                    alt={doc.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-500" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold line-clamp-2">{doc.title}</h3>
                <p className="text-sm text-gray-400">{doc.channelName}</p>
                <p className="text-sm text-gray-500">{formatViews(doc.views)} views</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
