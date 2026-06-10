import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const { userId: currentUserId } = await auth();

    const channelOwner = await prisma.userProfile.findUnique({
      where: { username },
    });

    if (!channelOwner) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    const subscribed = currentUserId ? channelOwner.followers.includes(currentUserId) : false;

    return NextResponse.json({
      subscribed,
      subscriberCount: channelOwner.followers.length,
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const channelOwner = await prisma.userProfile.findUnique({
      where: { username },
    });

    if (!channelOwner) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    if (channelOwner.id === currentUserId) {
      return NextResponse.json({ error: "Cannot subscribe to your own channel" }, { status: 400 });
    }

    const currentUser = await prisma.userProfile.findUnique({
      where: { id: currentUserId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isSubscribed = channelOwner.followers.includes(currentUserId);

    if (isSubscribed) {
      // Unsubscribe
      await prisma.userProfile.update({
        where: { id: channelOwner.id },
        data: {
          followers: channelOwner.followers.filter((id) => id !== currentUserId),
        },
      });

      await prisma.userProfile.update({
        where: { id: currentUserId },
        data: {
          following: currentUser.following.filter((id) => id !== channelOwner.id),
        },
      });
    } else {
      // Subscribe
      await prisma.userProfile.update({
        where: { id: channelOwner.id },
        data: {
          followers: [...channelOwner.followers, currentUserId],
        },
      });

      await prisma.userProfile.update({
        where: { id: currentUserId },
        data: {
          following: [...currentUser.following, channelOwner.id],
        },
      });

      // Create notification for channel owner
      await prisma.notification.create({
        data: {
          userId: channelOwner.id,
          type: "NEW_FOLLOWER",
          title: `${currentUser.displayName} followed you`,
          message: `${currentUser.displayName} has started following your channel`,
          link: `/channel/${currentUser.username}`,
        },
      });
    }

    const updatedChannelOwner = await prisma.userProfile.findUnique({
      where: { id: channelOwner.id },
    });

    return NextResponse.json({
      subscribed: !isSubscribed,
      subscriberCount: updatedChannelOwner?.followers.length || 0,
    });
  } catch (error) {
    console.error("Error toggling subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
