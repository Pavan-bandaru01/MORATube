import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentType, Visibility } from "@prisma/client";
import VideoCard from "@/components/VideoCard";
import { BellRing, PlaySquare, MonitorPlay, MessageSquare, Info, Edit2 } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

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
  isShort: boolean;
  visibility: string;
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

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { userId: currentUserId } = await auth();

  const profile = await prisma.userProfile.findUnique({
    where: { username },
  });

  if (!profile) notFound();

  const [channelVideos, channelDocuments] = await Promise.all([
    prisma.video.findMany({
      where: {
        uploadedBy: profile.id,
        contentType: ContentType.VIDEO,
        visibility: Visibility.PUBLIC,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.document.findMany({
      where: {
        uploadedBy: profile.id,
        visibility: Visibility.PUBLIC,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const mappedVideos: Video[] = channelVideos.map((v) => ({
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
      name: profile.displayName,
      username: profile.username,
      avatar: profile.avatarUrl || profile.displayName[0] || "U",
      title: profile.bio || "Creator",
      subscribers: `${profile.followers.length}`,
      bio: profile.bio || "",
      bannerGradient: "from-red-900 to-black",
    },
    comments: [],
  }));

  const creator = {
    name: profile.displayName,
    username: profile.username,
    avatar: profile.avatarUrl || profile.displayName[0] || "U",
    title: profile.bio || "Creator",
    subscribers: `${profile.followers.length}`,
    bio: profile.bio || "",
    bannerGradient: "from-red-900 to-black",
  };

  const isOwnChannel = currentUserId === profile.id;

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
              <span>{mappedVideos.length} videos</span>
            </div>
            <p className="mt-3 text-sm text-[#999999] max-w-2xl">{creator.bio}</p>
          </div>

          <div className="flex gap-3 mb-2 md:mb-4">
            <button className="bg-[#E53935] hover:bg-[#C62828] text-white px-6 py-2.5 rounded-full font-bold transition flex items-center gap-2">
              Subscribe <BellRing className="w-4 h-4" />
            </button>
            {isOwnChannel && (
              <Link
                href="/profile/edit"
                className="bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white px-6 py-2.5 rounded-full font-bold transition flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </Link>
            )}
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
            <MonitorPlay className="w-4 h-4" /> Documents
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
            {mappedVideos.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mappedVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-12 text-center">
                <p className="text-[#999999]">No videos uploaded yet.</p>
              </div>
            )}
          </section>

          {channelDocuments.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 text-white">Documents</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {channelDocuments.map((doc) => (
                  <Link
                    key={doc.id}
                    href={doc.fileUrl}
                    target="_blank"
                    className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-4 hover:border-[#E53935] transition group"
                  >
                    {doc.coverUrl && (
                      <div className="w-full h-32 bg-gradient-to-br from-red-900 to-black rounded-xl mb-4 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={doc.coverUrl}
                          alt={doc.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    )}
                    <h3 className="font-bold text-white line-clamp-2">{doc.title}</h3>
                    <p className="text-xs text-[#999999] mt-2">{doc.views} views</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
