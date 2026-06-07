import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.userProfile.findUnique({ where: { id: userId } });
    if (user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [totalUsers, totalVideos, totalDocuments, totalViews, recentUsers, recentUploads] =
      await Promise.all([
        db.userProfile.count(),
        db.video.count(),
        db.document.count(),
        db.video.aggregate({ _sum: { views: true } }),
        db.userProfile.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
        db.video.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
      ]);

    return NextResponse.json({
      totalUsers,
      totalVideos,
      totalDocuments,
      totalViews: totalViews._sum.views ?? 0,
      recentUsers,
      recentUploads,
    });
  } catch (error) {
    console.error("[ADMIN_STATS]", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}