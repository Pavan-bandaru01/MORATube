import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    return NextResponse.json({
      id: profile.id,
      displayName: profile.displayName,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      followers: profile.followers,
      createdAt: profile.createdAt,
    });
  } catch (error) {
    console.error("Error fetching channel profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
