import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Category, Visibility, ContentType, NotifType } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // 1. Auth check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check user profile and role
    const profile = await prisma.userProfile.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    if (profile.role === "VIEWER") {
      return NextResponse.json({ error: "Upgrade to Creator to upload" }, { status: 403 });
    }

    // 3. Parse form data
    const formData = await req.formData();
    const videoFile = formData.get("videoFile") as File | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string || "";
    const categoryStr = formData.get("category") as string || "FINANCE";
    const tagsStr = formData.get("tags") as string || "";
    const visibilityStr = formData.get("visibility") as string || "PUBLIC";

    if (!videoFile || !title) {
      return NextResponse.json({ error: "Video file and title are required" }, { status: 400 });
    }

    // 4. Parse enums safely
    const category = Object.values(Category).includes(categoryStr as Category)
      ? (categoryStr as Category)
      : Category.FINANCE;

    const visibility = Object.values(Visibility).includes(visibilityStr as Visibility)
      ? (visibilityStr as Visibility)
      : Visibility.PUBLIC;

    const tags = tagsStr
      ? tagsStr.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Starting Cloudinary upload...");

    const uploadResult = await new Promise<{
      public_id: string;
      secure_url: string;
      duration?: number;
      eager?: { secure_url: string }[];
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "moratube/videos",
          eager: [
            {
              start_offset: "5",
              format: "jpg",
              width: 640,
              height: 360,
              crop: "fill",
            },
          ],
          eager_async: false,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary error:", error);
            reject(error);
          } else if (result) {
            console.log("Cloudinary success:", result.public_id);
            resolve(result);
          } else {
            reject(new Error("Cloudinary upload returned no result"));
          }
        }
      );
      uploadStream.end(buffer);
    });

    if (!uploadResult || !uploadResult.public_id) {
      return NextResponse.json({ error: "Cloudinary upload failed" }, { status: 500 });
    }

    const cloudinaryId = uploadResult.public_id;
    const videoUrl = uploadResult.secure_url;
    const thumbnailUrl =
      uploadResult.eager?.[0]?.secure_url ??
      `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/so_5,w_640,h_360,c_fill,f_jpg/${cloudinaryId}.jpg`;

    console.log("cloudinaryId:", cloudinaryId);
    console.log("videoUrl:", videoUrl);
    console.log("thumbnailUrl:", thumbnailUrl);

    // 6. Save to database
    const video = await prisma.video.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        cloudinaryId,
        videoUrl,
        thumbnailUrl,
        duration: Math.round(uploadResult.duration ?? 0),
        category,
        tags,
        visibility,
        contentType: ContentType.VIDEO,
        views: 0,
        likes: 0,
        uploadedBy: userId,
        channelName: profile.displayName || profile.username,
      },
    });

    // 7. Notify followers
    if (profile.followers?.length > 0) {
      await Promise.all(
        profile.followers.map((followerId: string) =>
          prisma.notification.create({
            data: {
              userId: followerId,
              type: NotifType.NEW_VIDEO,
              title: "New Video",
              message: `${profile.displayName} uploaded: "${title}"`,
              link: `/videos/${video.id}`,
              read: false,
            },
          })
        )
      );
    }

    return NextResponse.json({ success: true, videoId: video.id });
  } catch (error) {
    console.error("[VIDEO_UPLOAD_ERROR]", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}