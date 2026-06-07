import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Visibility } from "@prisma/client";

// GET /api/search?q=query
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query) {
      return NextResponse.json({ videos: [], documents: [], total: 0 });
    }

    // Get current user id from Clerk auth (optional for search logs)
    const { userId } = await auth();

    // Query Videos
    const videos = await prisma.video.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { tags: { has: query } },
        ],
        visibility: Visibility.PUBLIC,
      },
    });

    // Query Documents
    const documents = await prisma.document.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { tags: { has: query } },
        ],
        visibility: Visibility.PUBLIC,
      },
    });

    // Merge and sort by views desc
    const sortedVideos = [...videos].sort((a, b) => b.views - a.views);
    const sortedDocuments = [...documents].sort((a, b) => b.views - a.views);
    const totalCount = videos.length + documents.length;

    // Log the search query
    try {
      await prisma.searchLog.create({
        data: {
          userId: userId || null,
          query,
          results: totalCount,
        },
      });
    } catch (logError) {
      console.error("Failed to write search log:", logError);
      // Don't fail the whole search request if search log fails
    }

    return NextResponse.json({
      videos: sortedVideos,
      documents: sortedDocuments,
      total: totalCount,
    });
  } catch (error) {
    console.error("[SEARCH_GET]", error);
    return NextResponse.json(
      { error: "Search query failed" },
      { status: 500 }
    );
  }
}
