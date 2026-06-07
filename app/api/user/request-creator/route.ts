import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await db.userProfile.update({
      where: { id: userId },
      data: { role: "CREATOR" },
    });

    await db.notification.create({
      data: {
        userId,
        type: "SYSTEM",
        title: "You're now a Creator!",
        message: "You can now upload videos and documents.",
        read: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[REQUEST_CREATOR]", error);
    return NextResponse.json({ error: "Failed to upgrade role" }, { status: 500 });
  }
}