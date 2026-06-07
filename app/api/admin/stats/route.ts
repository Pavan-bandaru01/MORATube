import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { id: userId },
    });

    if (!profile || profile.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [totalUsers, totalVideos, totalDocuments, viewsAgg, recentVideos, recentDocuments, recentUsers] =
      await Promise.all([
        prisma.userProfile.count(),
        prisma.video.count(),
        prisma.document.count(),
        prisma.video.aggregate({ _sum: { views: true } }),
        prisma.video.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            title: true,
            channelName: true,
            views: true,
            createdAt: true,
            contentType: true,
          },
        }),
        prisma.document.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            title: true,
            channelName: true,
            views: true,
            createdAt: true,
          },
        }),
        prisma.userProfile.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            username: true,
            displayName: true,
            role: true,
            createdAt: true,
          },
        }),
      ]);

    const recentUploads = [
      ...recentVideos.map((v) => ({
        id: v.id,
        title: v.title,
        channelName: v.channelName,
        views: v.views,
        createdAt: v.createdAt,
        type: v.contentType,
      })),
      ...recentDocuments.map((d) => ({
        id: d.id,
        title: d.title,
        channelName: d.channelName,
        views: d.views,
        createdAt: d.createdAt,
        type: "DOCUMENT" as const,
      })),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);

    return NextResponse.json({
      totalUsers,
      totalVideos,
      totalDocuments,
      totalViews: viewsAgg._sum.views ?? 0,
      recentUploads,
      recentUsers,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch admin stats";
    console.error("[ADMIN_STATS_GET]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
