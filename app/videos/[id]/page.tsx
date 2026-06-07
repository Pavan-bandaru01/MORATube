import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = await db.video.findUnique({ where: { id } });

  if (!video) return notFound();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
      <video
        src={video.videoUrl}
        controls
        className="w-full max-w-4xl rounded-lg"
      />
      <p className="mt-4 text-gray-400">{video.description}</p>
      <p className="text-sm text-gray-500 mt-2">By {video.channelName} · {video.views} views</p>
    </div>
  );
}