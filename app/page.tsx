import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ContentType, Visibility } from "@prisma/client";
import { resolveCategoryParam } from "@/lib/category-map";
import { categories } from "@/data/categories";
import { TrendingUp, PlayCircle, Sparkles } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import Footer from "@/components/Footer";
import { getShorts } from "@/lib/actions";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const categoryParam = resolvedParams.category;
  const prismaCategory = resolveCategoryParam(categoryParam);

  const allVideos = await prisma.video.findMany({
    where: {
      visibility: Visibility.PUBLIC,
      contentType: ContentType.VIDEO,
      ...(prismaCategory ? { category: prismaCategory } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const mustWatchVideos = [...allVideos]
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  const allShorts = await getShorts();
  const featuredShorts = allShorts.slice(0, 5);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const mapToCard = (v: (typeof allVideos)[0]) => ({
    id: v.id,
    title: v.title,
    description: v.description || "",
    category: v.category,
    thumbnailUrl: v.thumbnailUrl,
    videoUrl: v.videoUrl,
    views: v.views,
    likes: v.likes,
    duration: formatDuration(v.duration),
    uploadDate: new Date(v.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    tags: v.tags,
    isShort: false,
    visibility: v.visibility,
    creator: {
      name: v.channelName,
      username: v.uploadedBy,
      avatar: v.channelName[0] || "U",
      title: "Creator",
      subscribers: "0",
      bio: "",
      bannerGradient: "from-red-900 to-black",
    },
    comments: [],
  });

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
              const enumValue =
                category.id === "all"
                  ? "ALL"
                  : category.id.toUpperCase().replace(/-/g, "_");
              const href =
                category.id === "all" ? "/" : `/?category=${enumValue}`;
              const isActive =
                category.id === "all"
                  ? !categoryParam || categoryParam === "ALL"
                  : categoryParam === enumValue ||
                    categoryParam === category.slug ||
                    categoryParam === category.id;

              return (
                <Link
                  key={category.id}
                  href={href}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition flex items-center gap-2 border ${
                    isActive
                      ? "bg-[#E53935] text-white border-[#E53935]"
                      : "bg-[#141414] hover:bg-[#1F1F1F] border-[#2C2C2C] text-[#999999]"
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </Link>
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
          {mustWatchVideos.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {mustWatchVideos.map((video) => (
                <VideoCard key={video.id} video={mapToCard(video)} />
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
                <VideoCard key={video.id} video={mapToCard(video)} />
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
