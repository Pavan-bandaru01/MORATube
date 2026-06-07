import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { Category, Visibility, ContentType, NotifType } from "@prisma/client";
import { PDFParse } from "pdf-parse";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(req: Request) {
  let tempDocPath = "";
  let tempCoverPath = "";

  try {
    // 1. Verify Clerk Auth
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch UserProfile and check role
    const profile = await prisma.userProfile.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "User profile not found. Complete setup." }, { status: 404 });
    }

    if (profile.role === "VIEWER") {
      return NextResponse.json({ error: "Upgrade to Creator to upload" }, { status: 403 });
    }

    // 3. Parse Multipart Form Data
    const formData = await req.formData();
    const documentFile = formData.get("documentFile") as File | null;
    const title = formData.get("title") as string | null;
    const author = formData.get("author") as string | null;
    const description = formData.get("description") as string | null;
    const categoryStr = formData.get("category") as string | null;
    const tagsStr = formData.get("tags") as string | null;
    const visibilityStr = formData.get("visibility") as string | null;
    const coverFile = formData.get("coverFile") as File | null;

    if (!documentFile || !title) {
      return NextResponse.json({ error: "Document file and title are required" }, { status: 400 });
    }

    const fileType = documentFile.name.split(".").pop()?.toLowerCase() || "pdf";
    const fileBuffer = Buffer.from(await documentFile.arrayBuffer());

    // 4. Extract Text if PDF
    let extractedText = "";
    if (fileType === "pdf") {
      try {
        const parser = new PDFParse({ data: fileBuffer });
        const textResult = await parser.getText();
        extractedText = textResult.text || "";
        await parser.destroy();
      } catch (err) {
        console.error("PDF parsing error:", err);
      }
    }

    let category: Category = Category.FINANCE;
    if (categoryStr) {
      const enumVal = categoryStr.toUpperCase().replace("-", "_") as Category;
      if (Object.values(Category).includes(enumVal)) {
        category = enumVal;
      }
    }

    let visibility: Visibility = Visibility.PUBLIC;
    if (visibilityStr) {
      const enumVal = visibilityStr.toUpperCase() as Visibility;
      if (Object.values(Visibility).includes(enumVal)) {
        visibility = enumVal;
      }
    }

    const tags = tagsStr
      ? tagsStr.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
      : [];

    const hasCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (!hasCloudinary) {
      return NextResponse.json(
        { error: "Cloudinary is not configured" },
        { status: 500 }
      );
    }

    let fileUrl: string;
    let coverUrl: string | null = null;
    let cloudinaryId: string;

    {
      // Write document to temp file
      tempDocPath = path.join(os.tmpdir(), `doc-${Date.now()}-${documentFile.name}`);
      fs.writeFileSync(tempDocPath, fileBuffer);

      // Upload raw document to Cloudinary
      const docUpload = await cloudinary.uploader.upload(tempDocPath, {
        resource_type: "raw",
        folder: "moratube/documents",
      });

      fileUrl = docUpload.secure_url;
      cloudinaryId = docUpload.public_id;

      // Upload cover image if provided
      if (coverFile) {
        const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
        tempCoverPath = path.join(os.tmpdir(), `cover-${Date.now()}-${coverFile.name}`);
        fs.writeFileSync(tempCoverPath, coverBuffer);

        const coverUpload = await cloudinary.uploader.upload(tempCoverPath, {
          resource_type: "image",
          folder: "moratube/covers",
        });

        coverUrl = coverUpload.secure_url;
      }
    }

    // 6. Create Document record
    const document = await prisma.document.create({
      data: {
        title: title.trim(),
        author: author?.trim() || "Unknown Author",
        description: description?.trim() || "",
        cloudinaryId,
        fileUrl,
        coverUrl,
        fileType,
        pageCount: 10, // Placeholder
        category,
        tags,
        visibility,
        views: 0,
        uploadedBy: userId,
        channelName: profile.displayName || profile.username,
        extractedText,
      },
    });

    // 7. Create Notifications for followers
    if (profile.followers && profile.followers.length > 0) {
      await Promise.all(
        profile.followers.map((followerId) =>
          prisma.notification.create({
            data: {
              userId: followerId,
              type: NotifType.NEW_DOCUMENT,
              title: "New Document Shared",
              message: `${profile.displayName} shared a new document: "${title}"`,
              link: `/books`, // Books page lists documents
              read: false,
            },
          })
        )
      );
    }

    // 8. Trigger AI Indexing Async (fire-and-forget)
    const baseUrl = req.url.substring(0, req.url.indexOf("/api/upload"));
    fetch(`${baseUrl}/api/agents/index`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentId: document.id, contentType: "DOCUMENT" }),
    }).catch((err) => console.error("Failed to trigger AI indexing for document:", err));

    return NextResponse.json({ success: true, documentId: document.id });
  } catch (error) {
    console.error("[DOCUMENT_UPLOAD_POST]", error);
    const message = error instanceof Error ? error.message : "Failed to upload document";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    // Clean up temp files
    if (tempDocPath && fs.existsSync(tempDocPath)) {
      try { fs.unlinkSync(tempDocPath); } catch {}
    }
    if (tempCoverPath && fs.existsSync(tempCoverPath)) {
      try { fs.unlinkSync(tempCoverPath); } catch {}
    }
  }
}
