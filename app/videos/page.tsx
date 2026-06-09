import { getVideos, getTopVideosByViews } from "@/lib/actions";
import { Filter, Play } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import Link from "next/link";
import { Category, ContentType, Visibility } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const SORT_OPTIONS = [
  { id: "latest", label: "Latest" },
  { id: "views", label: "Most Viewed" },
  { id: "likes", label: "Most Liked" },
];

const CATEGORIES = [
  "ALL",
  "MONEY_AWARENESS",
  "AI_TOOLS",
  "FINANCE",
  "INVESTING",
  "DEBT_ESCAPE",
  "STUDENT_GROWTH",
  "TECHNOLOGY",
  "MOTIVATION",
];

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category || "ALL";
  const sort = resolvedParams.sort || "latest";

  let videos = [];

  if (sort === "views") {
    videos = await getTopVideosByViews(category === "ALL" ? undefined : category, 100);
  } else if (sort === "likes") {
    const allVideos = await prisma.video.findMany({
      where: {
        contentType: ContentType.VIDEO,
        visibility: Visibility.PUBLIC,
        ...(category !== "ALL" ? { category: category as Category } : {}),
      },
      orderBy: { likes: "desc" },
    });
    videos = allVideos.map(v => ({
      id: v.id,
      title: v.title,
      description: v.description || "",
      category: v.category,
      thumbnailUrl: v.thumbnailUrl,
      videoUrl: v.videoUrl,
      views: v.views,
      likes: v.likes,
      duration: v.duration ? `${Math.floor(v.duration / 60)}:${(v.duration % 60).toString().padStart(2, "0")}` : "0:00",
      uploadDate: new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      tags: v.tags,
      isShort: false,
      visibility: v.visibility,
      creator: {
        name: v.channelName,
        username: v.uploadedBy,
        avatar: v.channelName[0] || "U",
        title: "",
        subscribers: "0",
        bio: "",
        bannerGradient: "from-red-900 to-black",
      },
      comments: [],
    }));
  } else {
    videos = await getVideos(category === "ALL" ? undefined : category, "");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A] p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black mb-3 text-white">All Videos</h1>
        <p className="text-[#999999] text-lg">Watch powerful awareness videos about money, AI, and growth.</p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Sort By */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[#999999] font-semibold text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" /> Sort by:
          </span>
          {SORT_OPTIONS.map((option) => (
            <Link
              key={option.id}
              href={`/videos?sort=${option.id}${category !== "ALL" ? `&category=${category}` : ""}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                sort === option.id
                  ? "bg-[#E53935] text-white"
                  : "bg-[#141414] border border-[#2C2C2C] text-[#999999] hover:border-[#E53935]/50"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[#999999] font-semibold text-sm">Category:</span>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/videos?category=${cat}${sort !== "latest" ? `&sort=${sort}` : ""}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                category === cat
                  ? "bg-[#E53935] text-white"
                  : "bg-[#141414] border border-[#2C2C2C] text-[#999999] hover:border-[#E53935]/50"
              }`}
            >
              {cat.replace(/_/g, " ")}
            </Link>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      {videos.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} layout="grid" />
            ))}
          </div>
          <div className="flex justify-center">
            <button className="bg-[#1A1A1A] hover:bg-[#252525] border border-[#2C2C2C] text-white px-8 py-3 rounded-full font-bold transition">
              Load More
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Play className="w-16 h-16 text-[#333333] mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No videos found</h2>
          <p className="text-[#999999]">Try selecting a different category or sort option.</p>
        </div>
      )}
    </div>
  );
}