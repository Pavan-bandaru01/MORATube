import { PrismaClient } from "@prisma/client";
import { videos } from "../data/videos";
import { shorts } from "../data/shorts";
import { posts } from "../data/posts";
import { aiTools } from "../data/ai-tools";
import { books } from "../data/books";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // 1. Create a default User and Channel (for posts/videos that don't match specific users)
  const defaultUser = await prisma.user.upsert({
    where: { email: "admin@moratube.com" },
    update: {},
    create: {
      email: "admin@moratube.com",
      clerkId: "mock_clerk_admin",
      username: "mora_admin",
      name: "MORA Admin",
      avatar: "M",
      bio: "Platform Administrator",
      channel: {
        create: {
          bannerGradient: "from-red-900 to-black",
        }
      }
    },
    include: { channel: true }
  });

  console.log(`Created default user: ${defaultUser.username}`);

  // Create users/channels for all video creators
  const creators = new Map();
  
  for (const video of videos) {
    if (!creators.has(video.creator.username)) {
      const user = await prisma.user.upsert({
        where: { username: video.creator.username },
        update: {},
        create: {
          clerkId: `mock_clerk_${video.creator.username}`,
          email: `${video.creator.username}@creator.com`,
          username: video.creator.username,
          name: video.creator.name,
          avatar: video.creator.avatar,
          bio: video.creator.bio,
          channel: {
            create: {
              bannerGradient: video.creator.bannerGradient,
            }
          }
        },
        include: { channel: true }
      });
      creators.set(video.creator.username, user);
      console.log(`Created creator: ${user.username}`);
    }
  }

  // 2. Seed Videos
  console.log("Seeding Videos...");
  for (const video of videos) {
    const creatorUser = creators.get(video.creator.username);
    await prisma.video.upsert({
      where: { slug: video.slug },
      update: {},
      create: {
        id: video.id,
        title: video.title,
        slug: video.slug,
        description: video.description,
        category: video.category,
        thumbnailGradient: video.thumbnailGradient,
        videoUrl: video.videoUrl || "https://example.com/mock-video.mp4",
        duration: parseInt(video.duration.replace(":", "")) || 600,
        views: video.views,
        channelId: creatorUser.channel.id,
      }
    });
  }

  // 3. Seed Shorts
  console.log("Seeding Shorts...");
  for (const short of shorts) {
    const creatorUser = creators.get(short.creator.username) || defaultUser;
    await prisma.short.upsert({
      where: { id: short.id },
      update: {},
      create: {
        id: short.id,
        title: short.title,
        category: short.category,
        videoUrl: "https://example.com/mock-short.mp4",
        gradient: short.gradient,
        duration: parseInt(short.duration.replace(":", "")) || 30,
        views: short.views,
        channelId: creatorUser.channel!.id,
      }
    });
  }

  // 4. Seed Posts
  console.log("Seeding Posts...");
  for (const post of posts) {
    // Generate a slug-like username from author name to find/create them
    const authorUsername = post.author.name.toLowerCase().replace(" ", "-");
    let authorUser = creators.get(authorUsername);
    
    if (!authorUser) {
      authorUser = defaultUser; // Fallback
    }

    await prisma.post.upsert({
      where: { id: post.id },
      update: {},
      create: {
        id: post.id,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        channelId: authorUser.channel!.id,
      }
    });
  }

  // 5. Seed Books
  console.log("Seeding Books...");
  for (const book of books) {
    await prisma.book.upsert({
      where: { id: book.id },
      update: {},
      create: {
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        category: book.category,
        coverGradient: book.coverGradient,
        purchaseUrl: book.purchaseUrl,
        rating: book.rating,
        pages: book.pages,
      }
    });
  }

  // 6. Seed AI Tools
  console.log("Seeding AI Tools...");
  for (const tool of aiTools) {
    await prisma.aITool.upsert({
      where: { id: tool.id },
      update: {},
      create: {
        id: tool.id,
        name: tool.name,
        category: tool.category,
        description: tool.description,
        useCases: JSON.stringify(tool.useCases),
        pricing: tool.pricing,
        iconColor: tool.iconColor,
        iconBg: tool.iconBg,
        url: tool.url,
      }
    });
  }
  // 7. Seed Notifications
  console.log("Seeding Notifications...");
  const notificationData = [
    {
      type: "upload",
      title: "New Video Published!",
      message: "MORA Finance uploaded: 'Emergency Fund: Your First ₹50,000'",
      linkUrl: "/videos",
      read: false,
    },
    {
      type: "comment",
      title: "New Comment",
      message: "Wealth Builder commented on your video: 'Great explanation of compound interest!'",
      linkUrl: "/videos",
      read: false,
    },
    {
      type: "like",
      title: "Your Video Got Liked!",
      message: "AI Growth and 12 others liked your video 'Top 5 AI Tools for Students'",
      linkUrl: "/videos",
      read: false,
    },
    {
      type: "system",
      title: "Welcome to MORA Tube!",
      message: "Start your journey by watching trending videos and exploring AI tools.",
      linkUrl: "/",
      read: true,
    },
    {
      type: "subscribe",
      title: "New Subscriber!",
      message: "Smart Growth subscribed to your channel",
      linkUrl: "/dashboard",
      read: true,
    },
  ];

  for (const notif of notificationData) {
    await prisma.notification.create({
      data: {
        ...notif,
        userId: defaultUser.id,
      },
    });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
