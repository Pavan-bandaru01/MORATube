"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TrendingUp, PlayCircle, Sparkles } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { categories } from "@/data/categories";

interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  videoUrl: string;
  views: number;
  likes: number;
  duration: string;
  uploadDate: string;
  tags: string[];
  visibility: string;
  isShort: boolean;
  creator: {
    name: string;
    username: string;
    avatar: string;
    title: string;
    subscribers: string;
    bio: string;
    bannerGradient: string;
  };
  comments: any[];
}

interface Short {
  id: string;
  title: string;
  category: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  gradient: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  creator: {
    name: string;
    username: string;
    avatar: string;
    title: string;
    subscribers: string;
    bio: string;
    bannerGradient: string;
  };
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [allShorts, setAllShorts] = useState<Short[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch videos based on category
        let videoUrl = "/api/videos";
        if (categoryParam && categoryParam !== "ALL") {
          videoUrl += `?category=${categoryParam}`;
        }

        const [videosRes, shortsRes] = await Promise.all([
          fetch(videoUrl),
          fetch("/api/shorts"),
        ]);

        if (videosRes.ok) {
          const videosData = await videosRes.json();
          setAllVideos(videosData.videos || []);
        }

        if (shortsRes.ok) {
          const shortsData = await shortsRes.json();
          setAllShorts(shortsData.shorts || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryParam]);

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === "all") {
      router.push("/");
    } else {
      const enumValue = categoryId.toUpperCase().replace(/-/g, "_");
      router.push(`/?category=${enumValue}`);
    }
  };

  const mustWatchVideos = [...allVideos]
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  const featuredShorts = allShorts.slice(0, 5);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#0A0A0A]">
      <div className="flex-1 p-4 md:p-8 space-y-16">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <TrendingUp className="w-6 h-6 text-[#E53935]" /> Trending Topics
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {categories.map((category) => {
              const isActive =
                category.id === "all"
                  ? !categoryParam || categoryParam === "ALL"
                  : categoryParam === category.id.toUpperCase().replace(/-/g, "_");

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition flex items-center gap-2 border ${
                    isActive
                      ? "bg-[#E53935] text-white border-[#E53935]"
                      : "bg-[#141414] hover:bg-[#1F1F1F] border-[#2C2C2C] text-[#999999]"
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <PlayCircle className="w-6 h-6 text-[#E53935]" /> Must Watch
            </h2>
            <Link
              href="/videos"
              className="text-sm font-bold text-[#E53935] hover:text-[#C62828] transition"
            >
              View All
            </Link>
          </div>
          {isLoading ? (
            <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-12 text-center">
              <p className="text-[#999999]">Loading...</p>
            </div>
          ) : mustWatchVideos.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {mustWatchVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-12 text-center">
              <p className="text-[#999999]">No videos yet. Check back soon!</p>
            </div>
          )}
        </section>

        {allVideos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Latest Videos</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allVideos.slice(0, 8).map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Sparkles className="w-6 h-6 text-[#E53935]" /> MORA Shorts
            </h2>
            <Link
              href="/shorts"
              className="text-sm font-bold text-[#E53935] hover:text-[#C62828] transition"
            >
              View All
            </Link>
          </div>
          {featuredShorts.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {featuredShorts.map((short) => (
                <Link
                  key={short.id}
                  href={`/videos/${short.id}`}
                  className="w-64 shrink-0"
                >
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden group border border-[#2C2C2C]">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${short.gradient} opacity-80 group-hover:scale-105 transition duration-500`}
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="font-bold leading-tight line-clamp-2 text-white">
                        {short.title}
                      </h3>
                      <p className="text-xs text-[#999999] mt-2">{short.views} views</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-8 text-center">
              <p className="text-[#999999]">No shorts yet.</p>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
