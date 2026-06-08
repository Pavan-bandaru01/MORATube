import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST: Like a post (increment likes count)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Find the post
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Increment likes
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json(
      { error: "Failed to like post" },
      { status: 500 }
    );
  }
}
