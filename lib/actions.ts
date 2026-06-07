"use server";

import { prisma } from "./prisma";
import { formatDistanceToNow } from "date-fns";
import { ContentType, Visibility } from "@prisma/client";
import type { Video, Short, Post, Book, AITool } from "@/types";
import { resolveCategoryParam, categoryToGradient } from "./category-map";

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

async function getCreatorForUser(userId: string, channelName: string) {
  const profile = await prisma.userProfile.findUnique({ where: { id: userId } });
  return {
    name: profile?.displayName || channelName,
    username: profile?.username || userId,
    avatar: profile?.avatarUrl || channelName[0] || "U",
    title: profile?.bio || "Creator",
    subscribers: profile?.followers?.length
      ? `${profile.followers.length}`
      : "0",
    bio: profile?.bio || "",
    bannerGradient: "from-red-900 to-black",
  };
}

async function mapDbVideoToVideo(dbVideo: {
  id: string;
  title: string;
  description: string | null;
  category: import("@prisma/client").Category;
  thumbnailUrl: string;
  videoUrl: string;
  views: number;
  likes: number;
  duration: number | null;
  createdAt: Date;
  tags: string[];
  visibility: Visibility;
  uploadedBy: string;
  channelName: string;
}): Promise<Video> {
  const creator = await getCreatorForUser(dbVideo.uploadedBy, dbVideo.channelName);
  return {
    id: dbVideo.id,
    slug: dbVideo.id,
    title: dbVideo.title,
    description: dbVideo.description || "",
    category: dbVideo.category,
    thumbnailGradient: categoryToGradient(dbVideo.category),
    thumbnailUrl: dbVideo.thumbnailUrl,
    videoUrl: dbVideo.videoUrl,
    views: dbVideo.views,
    likes: dbVideo.likes,
    duration: formatDuration(dbVideo.duration),
    uploadDate: new Date(dbVideo.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    tags: dbVideo.tags,
    isShort: false,
    visibility: dbVideo.visibility,
    creator,
    comments: [],
  };
}

export async function getVideos(
  category?: string,
  search?: string
): Promise<Video[]> {
  const prismaCategory = resolveCategoryParam(category);

  const dbVideos = await prisma.video.findMany({
    where: {
      contentType: ContentType.VIDEO,
      visibility: Visibility.PUBLIC,
      AND: [
        prismaCategory ? { category: prismaCategory } : {},
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { tags: { has: search } },
              ],
            }
          : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return Promise.all(dbVideos.map(mapDbVideoToVideo));
}

export async function getVideoById(id: string): Promise<Video | null> {
  const dbVideo = await prisma.video.findUnique({ where: { id } });
  if (!dbVideo) return null;
  return mapDbVideoToVideo(dbVideo);
}

export async function getShorts(): Promise<Short[]> {
  const dbShorts = await prisma.video.findMany({
    where: {
      contentType: ContentType.SHORT,
      visibility: Visibility.PUBLIC,
    },
    orderBy: { createdAt: "desc" },
  });

  return Promise.all(
    dbShorts.map(async (dbShort) => {
      const creator = await getCreatorForUser(
        dbShort.uploadedBy,
        dbShort.channelName
      );
      return {
        id: dbShort.id,
        title: dbShort.title,
        category: dbShort.category,
        views: dbShort.views,
        likes: dbShort.likes,
        comments: 0,
        duration: formatDuration(dbShort.duration),
        gradient: categoryToGradient(dbShort.category),
        creator,
      };
    })
  );
}

export async function getPosts(): Promise<Post[]> {
  const dbPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Promise.all(
    dbPosts.map(async (dbPost) => {
      const profile = await prisma.userProfile.findUnique({
        where: { id: dbPost.uploadedBy },
      });
      return {
        id: dbPost.id,
        title: dbPost.title,
        content: dbPost.content,
        imageUrl: dbPost.imageUrl || undefined,
        likes: dbPost.likes,
        comments: 0,
        shares: 0,
        createdAt: formatDistanceToNow(new Date(dbPost.createdAt), {
          addSuffix: true,
        }),
        author: {
          name: profile?.displayName || dbPost.channelName,
          avatar: profile?.avatarUrl || dbPost.channelName[0] || "U",
          role: profile?.bio || "Creator",
        },
      };
    })
  );
}

export async function getBooks(): Promise<Book[]> {
  const documents = await prisma.document.findMany({
    where: { visibility: Visibility.PUBLIC },
    orderBy: { createdAt: "desc" },
  });

  return documents.map((doc) => ({
    id: doc.id,
    title: doc.title,
    author: doc.author || "Unknown",
    description: doc.description || "",
    category: doc.category,
    coverGradient: doc.coverUrl
      ? "from-zinc-800 to-black"
      : categoryToGradient(doc.category),
    coverUrl: doc.coverUrl || undefined,
    purchaseUrl: doc.fileUrl,
    rating: 0,
    pages: doc.pageCount || 0,
  }));
}

export async function getAITools(): Promise<AITool[]> {
  const tools = await prisma.aITool.findMany({
    orderBy: { createdAt: "desc" },
  });
  return tools.map((tool) => ({
    ...tool,
    useCases: JSON.parse(tool.useCases) as string[],
    pricing: tool.pricing as "Free" | "Freemium" | "Paid",
  }));
}

export async function getUserVideos(userId: string): Promise<Video[]> {
  const dbVideos = await prisma.video.findMany({
    where: { uploadedBy: userId },
    orderBy: { createdAt: "desc" },
  });
  return Promise.all(dbVideos.map(mapDbVideoToVideo));
}
