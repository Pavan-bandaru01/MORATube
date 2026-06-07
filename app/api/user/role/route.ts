import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let profile = await db.userProfile.findUnique({ where: { id: userId } });

    if (!profile) {
      profile = await db.userProfile.create({
        data: {
          id: userId,
          username: userId,
          displayName: "User",
          role: "VIEWER",
        },
      });
    }

    return NextResponse.json({ role: profile.role, profile });
  } catch (error) {
    console.error("[USER_ROLE]", error);
    return NextResponse.json({ error: "Failed to fetch role" }, { status: 500 });
  }
}