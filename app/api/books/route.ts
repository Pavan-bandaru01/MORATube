import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/books — upload a new book/document metadata to the library
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, author, description, category, pages, purchaseUrl, coverGradient } = body;

    if (!title || !author || !category) {
      return NextResponse.json(
        { error: "Title, author, and category are required" },
        { status: 400 }
      );
    }

    // Create the book in the database
    const book = await prisma.book.create({
      data: {
        title: title.trim(),
        author: author.trim(),
        description: description.trim() || "",
        category: category || "finance",
        pages: parseInt(pages) || 0,
        purchaseUrl: purchaseUrl?.trim() || null,
        coverGradient: coverGradient || "from-zinc-800 to-black",
        rating: 4.5, // Default initial rating
      },
    });

    // Create a notification for the upload (mock admin user for now)
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@moratube.com" }
    });

    if (adminUser) {
      await prisma.notification.create({
        data: {
          userId: adminUser.id,
          type: "upload",
          title: "New Book Uploaded",
          message: `"${title}" has been added to the MORA Library.`,
          linkUrl: `/books`,
          read: false,
        },
      });
    }

    return NextResponse.json({ success: true, book });
  } catch (error) {
    console.error("[BOOKS_POST]", error);
    return NextResponse.json(
      { error: "Failed to upload book/document" },
      { status: 500 }
    );
  }
}
