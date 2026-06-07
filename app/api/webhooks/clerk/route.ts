import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.warn("CLERK_WEBHOOK_SECRET is missing. Webhook verification skipped or will fail.");
    return new Response("Error: Webhook secret not configured", { status: 500 });
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: Verification failed", {
      status: 400,
    });
  }

  // Handle user.created event
  if (evt.type === "user.created") {
    const { id, username, first_name, last_name, image_url } = evt.data;

    const displayName = [first_name, last_name].filter(Boolean).join(" ") || username || id;

    try {
      // Upsert UserProfile to handle duplicate calls safely
      await prisma.userProfile.upsert({
        where: { id },
        update: {
          username: username || id,
          displayName,
          avatarUrl: image_url,
        },
        create: {
          id,
          username: username || id,
          displayName,
          avatarUrl: image_url,
          role: "VIEWER",
          followers: [],
          following: [],
        },
      });
      console.log(`Synced Clerk user ${id} to UserProfile.`);
    } catch (dbError) {
      console.error("Failed to sync UserProfile in database:", dbError);
      return new Response("Database write failed", { status: 500 });
    }
  }

  return new Response("Success", { status: 200 });
}
