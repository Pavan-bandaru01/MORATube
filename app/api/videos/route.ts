import { prisma } from "@/lib/prisma";
import { ContentType, Visibility } from "@prisma/client";
import { resolveCategoryParam } from "@/lib/category-map";
import { NextResponse } from "next/server";

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");
    const prismaCategory = resolveCategoryParam(categoryParam);

    const videos = await prisma.video.findMany({
      where: {
        visibility: Visibility.PUBLIC,
        contentType: ContentType.VIDEO,
        ...(prismaCategory ? { category: prismaCategory } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedVideos = videos.map((v) => ({
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
    }));

    return NextResponse.json({ videos: formattedVideos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
