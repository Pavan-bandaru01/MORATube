import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Return current UserProfile
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const profile = await prisma.userProfile.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PATCH: Update UserProfile
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { displayName, bio, username } = body;

    // Check if username is already taken (if being changed)
    if (username) {
      const existingProfile = await prisma.userProfile.findUnique({
        where: { username },
      });

      if (existingProfile && existingProfile.id !== userId) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
    }

    const updatedProfile = await prisma.userProfile.update({
      where: { id: userId },
      data: {
        ...(displayName && { displayName }),
        ...(bio !== undefined && { bio }),
        ...(username && { username }),
      },
    });

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
