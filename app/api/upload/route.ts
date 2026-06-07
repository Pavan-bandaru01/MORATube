import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/upload — create a new video in the database
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, category, visibility, tags } = body;

    if (!title || !category) {
      return NextResponse.json(
        { error: "Title and category are required" },
        { status: 400 }
      );
    }

    // Get the admin user's channel (mock auth — replace with Clerk later)
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@moratube.com" },
      include: { channel: true },
    });

    if (!adminUser?.channel) {
      return NextResponse.json(
        { error: "User or channel not found" },
        { status: 404 }
      );
    }

    // Generate a slug from the title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + "-" + Date.now().toString(36);

    // Create the video record
    const video = await prisma.video.create({
      data: {
        title,
        slug,
        description: description || "",
        category: category || "finance",
        thumbnailGradient: "from-red-900 to-black",
        videoUrl: "https://example.com/mock-video.mp4", // Mock — replace with Cloudinary URL
        duration: 600, // Mock duration
        views: 0,
        visibility: visibility || "public",
        channelId: adminUser.channel.id,
      },
    });

    // Create a notification for the upload
    await prisma.notification.create({
      data: {
        userId: adminUser.id,
        type: "upload",
        title: "Video Published!",
        message: `Your video "${title}" is now live.`,
        linkUrl: `/videos/${video.id}`,
        read: false,
      },
    });

    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}
