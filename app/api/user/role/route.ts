import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let profile = await prisma.userProfile.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      const user = await currentUser();
      const username =
        user?.username ||
        user?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
        userId;
      const displayName =
        [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
        username;

      profile = await prisma.userProfile.create({
        data: {
          id: userId,
          username,
          displayName,
          avatarUrl: user?.imageUrl,
          role: "VIEWER",
          followers: [],
          following: [],
        },
      });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch user role";
    console.error("[USER_ROLE_GET]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
