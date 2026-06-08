import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ContentType, Visibility } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Play, FileText } from "lucide-react";

export default async function HistoryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const history = await prisma.watchHistory.findMany({
    where: { userId },
    orderBy: { watchedAt: "desc" },
    take: 50,
  });

  const videoIds = history
    .filter((h) => h.contentType === ContentType.VIDEO || h.contentType === ContentType.SHORT)
    .map((h) => h.contentId);
  const docIds = history
    .filter((h) => h.contentType === ContentType.DOCUMENT || h.contentType === ContentType.BOOK)
    .map((h) => h.contentId);

  const [videos, documents] = await Promise.all([
    videoIds.length
      ? prisma.video.findMany({ where: { id: { in: videoIds } } })
      : [],
    docIds.length
      ? prisma.document.findMany({ where: { id: { in: docIds } } })
      : [],
  ]);

  const videoMap = new Map(videos.map((v) => [v.id, v]));
  const docMap = new Map(documents.map((d) => [d.id, d]));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A] p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black text-white mb-8">Watch History</h1>

      {history.length === 0 ? (
        <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-12 text-center">
          <p className="text-[#999999]">No watch history yet.</p>
          <Link
            href="/videos"
            className="inline-block mt-4 bg-[#E53935] hover:bg-[#C62828] text-white rounded-full px-6 py-2.5 font-bold transition"
          >
            Browse Videos
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => {
            const video = videoMap.get(entry.contentId);
            const doc = docMap.get(entry.contentId);

            if (video) {
              return (
                <Link
                  key={entry.id}
                  href={`/videos/${video.id}`}
                  className="flex gap-4 p-3 rounded-2xl bg-[#141414] border border-[#2C2C2C] hover:bg-[#1F1F1F] transition"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-40 aspect-video rounded-xl object-cover"
                  />
                  <div className="flex-1 py-1">
                    <h3 className="font-bold text-white line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-[#999999] mt-1">{video.channelName}</p>
                    <p className="text-xs text-[#999999] mt-2">
                      Watched {formatDistanceToNow(new Date(entry.watchedAt), { addSuffix: true })}
                    </p>
                  </div>
                  <Play className="w-5 h-5 text-[#E53935] shrink-0 self-center" />
                </Link>
              );
            }

            if (doc) {
              return (
                <Link
                  key={entry.id}
                  href={`/documents/${doc.id}`}
                  className="flex gap-4 p-3 rounded-2xl bg-[#141414] border border-[#2C2C2C] hover:bg-[#1F1F1F] transition"
                >
                  <div className="w-24 aspect-[2/3] rounded-xl bg-[#1A1A1A] border border-[#2C2C2C] flex items-center justify-center overflow-hidden">
                    {doc.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={doc.coverUrl} alt={doc.title} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-8 h-8 text-[#999999]" />
                    )}
                  </div>
                  <div className="flex-1 py-1">
                    <h3 className="font-bold text-white line-clamp-2">{doc.title}</h3>
                    <p className="text-sm text-[#999999] mt-1">{doc.author || doc.channelName}</p>
                    <p className="text-xs text-[#999999] mt-2">
                      Watched {formatDistanceToNow(new Date(entry.watchedAt), { addSuffix: true })}
                    </p>
                  </div>
                </Link>
              );
            }

            return null;
          })}
        </div>
      )}
    </div>
  );
}
