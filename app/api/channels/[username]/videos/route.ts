import { prisma } from "@/lib/prisma";
import { ContentType, Visibility } from "@prisma/client";
import { NextResponse } from "next/server";

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const profile = await prisma.userProfile.findUnique({
      where: { username },
    });

    if (!profile) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    const videos = await prisma.video.findMany({
      where: {
        uploadedBy: profile.id,
        contentType: ContentType.VIDEO,
        visibility: Visibility.PUBLIC,
      },
      orderBy: { createdAt: "desc" },
    });

    const mappedVideos = videos.map((v) => ({
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

    return NextResponse.json({
      videos: mappedVideos,
    });
  } catch (error) {
    console.error("Error fetching channel videos:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
