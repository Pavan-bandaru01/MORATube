import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ContentType } from "@prisma/client";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const history = await prisma.watchHistory.findMany({
      where: { userId },
      orderBy: { watchedAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error("[HISTORY_GET]", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { contentId, contentType } = body;

    if (!contentId || !contentType) {
      return NextResponse.json({ error: "contentId and contentType required" }, { status: 400 });
    }

    const validTypes = Object.values(ContentType);
    if (!validTypes.includes(contentType as ContentType)) {
      return NextResponse.json({ error: "Invalid contentType" }, { status: 400 });
    }

    const entry = await prisma.watchHistory.create({
      data: {
        userId,
        contentId,
        contentType: contentType as ContentType,
      },
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error("[HISTORY_POST]", error);
    return NextResponse.json({ error: "Failed to create history entry" }, { status: 500 });
  }
}
