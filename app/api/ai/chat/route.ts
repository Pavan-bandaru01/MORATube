import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { messages } = await req.json();

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are MORA Assistant, an AI built for MORA Tube. You help users understand money behavior, investing, debt traps, AI tools, and wealth habits. Always keep your answers concise, practical, and easy to understand. Never give direct financial advice, always add a disclaimer if discussing investments.",
        },
        ...messages,
      ],
    });

    return NextResponse.json({
      content: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("[AI_CHAT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
