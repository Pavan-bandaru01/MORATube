import HeroSection from "@/components/HeroSection";
import VideoCard from "@/components/VideoCard";
import CreatorCard from "@/components/CreatorCard";
import Footer from "@/components/Footer";
import { getVideos, getShorts } from "@/lib/actions";
import { categories } from "@/data/categories";
import { resolveCategoryParam, categoryToSlug } from "@/lib/category-map";
import { TrendingUp, Sparkles, PlayCircle, Users } from "lucide-react";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const categoryParam = resolvedParams.category;
  const prismaCategory = resolveCategoryParam(categoryParam);
  const categorySlug = prismaCategory
    ? categoryToSlug(prismaCategory)
    : categoryParam || "all";

  const allVideos = await getVideos(categorySlug === "all" ? undefined : categorySlug);
  const allShorts = await getShorts();
  const featuredVideos = allVideos.slice(0, 6);
  const featuredShorts = allShorts.slice(0, 5);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex-1 p-4 md:p-8 space-y-16">
        <HeroSection />

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-red-500" /> Trending Topics
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {categories.map((category) => {
              const enumValue =
                category.id === "all"
                  ? "ALL"
                  : category.id.toUpperCase().replace(/-/g, "_");
              const href =
                category.id === "all"
                  ? "/"
                  : `/?category=${enumValue}`;
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
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white/5 hover:bg-white/10 border-white/10"
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
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <PlayCircle className="w-6 h-6 text-red-500" /> Must Watch
            </h2>
            <Link href="/videos" className="text-sm font-bold text-red-500 hover:text-red-400 transition">
              View All
            </Link>
          </div>
          {featuredVideos.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {featuredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-3xl p-12 text-center">
              <p className="text-gray-400">No videos in this category yet.</p>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-red-500" /> MORA Shorts
            </h2>
            <Link href="/shorts" className="text-sm font-bold text-red-500 hover:text-red-400 transition">
              View All
            </Link>
          </div>
          {featuredShorts.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
              {featuredShorts.map((short) => (
                <div key={short.id} className="w-64 shrink-0">
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden group cursor-pointer">
                    <div className={`absolute inset-0 bg-gradient-to-br ${short.gradient} opacity-80 group-hover:scale-105 transition duration-500`} />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="font-bold leading-tight line-clamp-2">{short.title}</h3>
                      <p className="text-xs text-gray-300 mt-2">{short.views} views</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass rounded-3xl p-8 text-center">
              <p className="text-gray-400">No shorts yet.</p>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-red-500" /> Top Creators
            </h2>
          </div>
          <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-6">
            <CreatorCard creator={{
              name: "MORA Finance",
              username: "mora-finance",
              avatar: "M",
              title: "Financial Awareness",
              subscribers: "24.5K",
              bio: "Making money education simple and accessible for everyone.",
              bannerGradient: "from-red-950 via-red-900 to-black"
            }} />
            <CreatorCard creator={{
              name: "AI Growth",
              username: "ai-growth",
              avatar: "A",
              title: "AI Explorer",
              subscribers: "31.8K",
              bio: "Exploring how AI can help everyday people learn and grow.",
              bannerGradient: "from-blue-950 via-indigo-900 to-black"
            }} />
            <CreatorCard creator={{
              name: "Wealth Builder",
              username: "wealth-builder",
              avatar: "W",
              title: "Money Coach",
              subscribers: "18.2K",
              bio: "Teaching practical wealth-building habits.",
              bannerGradient: "from-amber-950 via-orange-900 to-black"
            }} />
          </div>
        </section>

        <section className="glass rounded-3xl p-10 md:p-16 text-center max-w-5xl mx-auto my-16 relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Why MORA Tube Exists
            </h2>
            <p className="text-gray-300 md:text-lg max-w-3xl mx-auto leading-relaxed">
              Many people earn money but do not understand money behavior, debt
              traps, investing, AI tools, and modern opportunities. MORA Tube
              spreads awareness through videos, shorts, tools, resources, and
              community learning.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/finance-hub" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition">
                Explore Finance Hub
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
