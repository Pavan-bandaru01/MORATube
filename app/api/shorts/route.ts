import { prisma } from "@/lib/prisma";
import { ContentType, Visibility } from "@prisma/client";
import { categoryToGradient } from "@/lib/category-map";
import { NextResponse } from "next/server";

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export async function GET() {
  try {
    const shorts = await prisma.video.findMany({
      where: {
        contentType: ContentType.SHORT,
        visibility: Visibility.PUBLIC,
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedShorts = shorts.map((s) => ({
      id: s.id,
      title: s.title,
      category: s.category,
      views: s.views,
      likes: s.likes,
      comments: 0,
      duration: formatDuration(s.duration),
      gradient: categoryToGradient(s.category),
      videoUrl: s.videoUrl,
      thumbnailUrl: s.thumbnailUrl,
      creator: {
        name: s.channelName,
        username: s.uploadedBy,
        avatar: s.channelName[0] || "U",
        title: "Creator",
        subscribers: "0",
        bio: "",
        bannerGradient: "from-red-900 to-black",
      },
    }));

    return NextResponse.json({ shorts: formattedShorts });
  } catch (error) {
    console.error("Error fetching shorts:", error);
    return NextResponse.json(
      { error: "Failed to fetch shorts" },
      { status: 500 }
    );
  }
}
