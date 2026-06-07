import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return null;
    }

    const user = await prisma.userProfile.findUnique({
      where: {
        id: clerkId,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}
