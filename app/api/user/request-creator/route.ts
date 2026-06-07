import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NotifType } from "@prisma/client";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    if (profile.role !== "VIEWER") {
      return NextResponse.json({ success: true, role: profile.role });
    }

    await prisma.userProfile.update({
      where: { id: userId },
      data: { role: "CREATOR" },
    });

    await prisma.notification.create({
      data: {
        userId,
        type: NotifType.SYSTEM,
        title: "You're now a Creator!",
        message: "You can now upload videos and documents.",
        link: "/upload",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upgrade role";
    console.error("[REQUEST_CREATOR_POST]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
