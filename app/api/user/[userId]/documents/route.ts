import { prisma } from "@/lib/prisma";
import { Visibility } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const documents = await prisma.document.findMany({
      where: {
        uploadedBy: userId,
        visibility: Visibility.PUBLIC,
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedDocs = documents.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description || "",
      coverUrl: d.coverUrl || undefined,
      fileUrl: d.fileUrl,
      category: d.category,
      views: d.views,
      uploadedBy: d.uploadedBy,
      channelName: d.channelName,
      createdAt: d.createdAt,
    }));

    return NextResponse.json({ documents: formattedDocs });
  } catch (error) {
    console.error("Error fetching user documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
