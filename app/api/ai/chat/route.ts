import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { messages } = await req.json();
    if (!messages || messages.length === 0) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    // Create a streaming response using ReadableStream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: `You are MORA Assistant, an AI built for MORATube — a financial literacy platform.
                Help users understand money behavior, investing, SIP, mutual funds, debt traps, AI tools, and wealth habits.
                Always keep answers concise, practical, and easy to understand for average Indians.
                Use Indian context — INR, Indian markets, Zerodha, Groww, NSE, BSE.
                Core message: money works like an employee — deploy it correctly and it builds more money.
                Never give direct financial advice. Add disclaimer when discussing investments.`,
              },
              ...messages.map((msg: any) => ({
                role: msg.role,
                content: msg.content,
              })),
            ],
            max_tokens: 1024,
            stream: true,
          });

          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          console.error("[AI_CHAT_STREAM_ERROR]", error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("[AI_CHAT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}