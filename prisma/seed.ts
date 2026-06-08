import { PrismaClient, Category, ContentType, Visibility, NotifType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  await prisma.userProfile.upsert({
    where: { id: "seed-admin" },
    update: {},
    create: {
      id: "seed-admin",
      username: "mora_admin",
      displayName: "MORA Admin",
      avatarUrl: null,
      bio: "Platform Administrator",
      role: "ADMIN",
    },
  });

  await prisma.video.upsert({
    where: { id: "seed-video-1" },
    update: {},
    create: {
      id: "seed-video-1",
      title: "Welcome to MORA Tube",
      description: "Learn about money, AI tools, and personal growth.",
      cloudinaryId: "moratube/videos/welcome",
      videoUrl: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
      thumbnailUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      duration: 120,
      category: Category.FINANCE,
      tags: ["finance", "welcome"],
      visibility: Visibility.PUBLIC,
      contentType: ContentType.VIDEO,
      uploadedBy: "seed-admin",
      channelName: "MORA Admin",
    },
  });

  await prisma.aITool.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "ChatGPT",
        category: "AI Tools",
        description: "General purpose AI assistant",
        useCases: JSON.stringify(["Writing", "Research", "Learning"]),
        pricing: "Freemium",
        iconColor: "#10a37f",
        iconBg: "#10a37f20",
        url: "https://chat.openai.com",
      },
    ],
  });

  await prisma.notification.create({
    data: {
      userId: "seed-admin",
      type: NotifType.SYSTEM,
      title: "Welcome to MORA Tube",
      message: "Your platform is ready.",
      link: "/",
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
