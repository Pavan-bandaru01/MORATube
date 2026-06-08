import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPosts, getShorts, getUserVideos } from "@/lib/actions";
import VideoCard from "@/components/VideoCard";
import PostCard from "@/components/PostCard";
import { BellRing, PlaySquare, MonitorPlay, MessageSquare, Info } from "lucide-react";
import Link from "next/link";

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const profile = await prisma.userProfile.findUnique({
    where: { username },
  });

  if (!profile) notFound();

  const [channelVideos, channelShorts, channelPosts] = await Promise.all([
    getUserVideos(profile.id),
    getShorts(),
    getPosts(),
  ]);

  const userShorts = channelShorts.filter(
    (s) => s.creator.username === profile.username
  );
  const userPosts = channelPosts.filter(
    (p) => p.author.name === profile.displayName
  );

  const creator = {
    name: profile.displayName,
    username: profile.username,
    avatar: profile.avatarUrl || profile.displayName[0] || "U",
    title: profile.bio || "Creator",
    subscribers: `${profile.followers.length}`,
    bio: profile.bio || "",
    bannerGradient: "from-red-900 to-black",
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A]">
      <div
        className={`h-48 md:h-64 lg:h-80 w-full bg-gradient-to-br ${creator.bannerGradient}`}
      />

      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12 md:-mt-16 mb-8 relative z-10">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#0A0A0A] bg-[#141414] flex items-center justify-center text-4xl md:text-5xl font-black text-white shrink-0 shadow-xl overflow-hidden">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              creator.avatar
            )}
          </div>

          <div className="flex-1 text-center md:text-left mb-2 md:mb-4">
            <h1 className="text-3xl font-black text-white">{creator.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 mt-1 text-[#999999]">
              <span className="font-semibold text-white">@{creator.username}</span>
              <span>{creator.subscribers} subscribers</span>
              <span>{channelVideos.length} videos</span>
            </div>
            <p className="mt-3 text-sm text-[#999999] max-w-2xl">{creator.bio}</p>
          </div>

          <div className="mb-2 md:mb-4">
            <button className="bg-[#E53935] hover:bg-[#C62828] text-white px-6 py-2.5 rounded-full font-bold transition flex items-center gap-2">
              Subscribe <BellRing className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-[#2C2C2C] mb-8 overflow-x-auto hide-scrollbar">
          <button className="px-6 py-4 text-sm font-bold border-b-2 border-[#E53935] text-white whitespace-nowrap">
            Home
          </button>
          <button className="px-6 py-4 text-sm font-semibold border-b-2 border-transparent text-[#999999] hover:text-white transition whitespace-nowrap flex items-center gap-2">
            <PlaySquare className="w-4 h-4" /> Videos
          </button>
          <button className="px-6 py-4 text-sm font-semibold border-b-2 border-transparent text-[#999999] hover:text-white transition whitespace-nowrap flex items-center gap-2">
            <MonitorPlay className="w-4 h-4" /> Shorts
          </button>
          <button className="px-6 py-4 text-sm font-semibold border-b-2 border-transparent text-[#999999] hover:text-white transition whitespace-nowrap flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Community
          </button>
          <button className="px-6 py-4 text-sm font-semibold border-b-2 border-transparent text-[#999999] hover:text-white transition whitespace-nowrap flex items-center gap-2">
            <Info className="w-4 h-4" /> About
          </button>
        </div>

        <div className="space-y-12 pb-16">
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">Latest Videos</h2>
            {channelVideos.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {channelVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <p className="text-[#999999]">No videos uploaded yet.</p>
            )}
          </section>

          {userShorts.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 text-white">Popular Shorts</h2>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
                {userShorts.map((short) => (
                  <Link key={short.id} href={`/videos/${short.id}`} className="w-64 shrink-0">
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
            </section>
          )}

          {userPosts.length > 0 && (
            <section className="max-w-3xl">
              <h2 className="text-xl font-bold mb-4 text-white">Community</h2>
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
