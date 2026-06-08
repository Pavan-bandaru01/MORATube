import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ContentType, Visibility } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import VideoCard from "@/components/VideoCard";
import { formatDistanceToNow } from "date-fns";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await prisma.video.findUnique({ where: { id } });

  if (!video) return notFound();

  await prisma.video.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  const { userId } = await auth();
  if (userId) {
    await prisma.watchHistory.create({
      data: {
        userId,
        contentId: id,
        contentType: video.contentType,
      },
    }).catch(() => {});
  }

  const relatedVideos = await prisma.video.findMany({
    where: {
      category: video.category,
      visibility: Visibility.PUBLIC,
      contentType: ContentType.VIDEO,
      id: { not: id },
    },
    orderBy: { views: "desc" },
    take: 6,
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A] text-white p-4 md:p-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl overflow-hidden border border-[#2C2C2C] bg-[#141414]">
            <video
              src={video.videoUrl}
              controls
              className="w-full aspect-video bg-black"
            />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-black mb-3">{video.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#999999] mb-4">
              <span>{video.views + 1} views</span>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
              </span>
              <span>•</span>
              <span>{video.channelName}</span>
            </div>
            <p className="text-[#999999] leading-relaxed">{video.description}</p>
            {video.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#2C2C2C] text-xs text-[#999999]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4">Related Videos</h2>
          <div className="space-y-4">
            {relatedVideos.map((related) => (
              <Link
                key={related.id}
                href={`/videos/${related.id}`}
                className="flex gap-3 p-2 rounded-2xl hover:bg-[#1F1F1F] transition border border-transparent hover:border-[#2C2C2C]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={related.thumbnailUrl}
                  alt={related.title}
                  className="w-40 aspect-video rounded-xl object-cover bg-[#141414]"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-2">{related.title}</h3>
                  <p className="text-xs text-[#999999] mt-1">{related.channelName}</p>
                  <p className="text-xs text-[#999999]">{related.views} views</p>
                </div>
              </Link>
            ))}
            {relatedVideos.length === 0 && (
              <p className="text-[#999999] text-sm">No related videos found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
