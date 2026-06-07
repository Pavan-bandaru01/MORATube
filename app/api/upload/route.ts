import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Use /api/upload/video or /api/upload/document instead" },
    { status: 400 }
  );
}