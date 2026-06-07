import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Category, Visibility } from "@prisma/client";

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      where: { visibility: Visibility.PUBLIC },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ documents });
  } catch (error) {
    console.error("[BOOKS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, author, description, category } = body;

    if (!title || !category) {
      return NextResponse.json({ error: "Title and category are required" }, { status: 400 });
    }

    const profile = await prisma.userProfile.findUnique({ where: { id: userId } });
    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const document = await prisma.document.create({
      data: {
        title: title.trim(),
        author: author?.trim() || "",
        description: description?.trim() || "",
        cloudinaryId: "manual",
        fileUrl: "",
        fileType: "manual",
        category: category as Category,
        uploadedBy: userId,
        channelName: profile.displayName,
      },
    });

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error("[BOOKS_POST]", error);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}