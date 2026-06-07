import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type === "user.created") {
      const { id, username, first_name, last_name, image_url } = data;
      await db.userProfile.upsert({
        where: { id },
        update: {},
        create: {
          id,
          username: username || id,
          displayName: `${first_name || ""} ${last_name || ""}`.trim() || "User",
          avatarUrl: image_url || null,
          role: "VIEWER",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CLERK_WEBHOOK]", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}