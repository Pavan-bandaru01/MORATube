import { prisma } from "@/lib/prisma";
import { Visibility } from "@prisma/client";
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

    const documents = await prisma.document.findMany({
      where: {
        uploadedBy: profile.id,
        visibility: Visibility.PUBLIC,
      },
      orderBy: { createdAt: "desc" },
    });

    const mappedDocuments = documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      coverUrl: doc.coverUrl,
      fileUrl: doc.fileUrl,
      views: doc.views,
      createdAt: doc.createdAt,
    }));

    return NextResponse.json({
      documents: mappedDocuments,
    });
  } catch (error) {
    console.error("Error fetching channel documents:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
