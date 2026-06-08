import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history,
      systemInstruction: `You are MORA Assistant, an AI built for MORATube — a financial literacy platform. 
      Help users understand money behavior, investing, SIP, mutual funds, debt traps, AI tools, and wealth habits. 
      Always keep answers concise, practical, and easy to understand for average Indians.
      Use Indian context — INR, Indian markets, Zerodha, Groww, NSE, BSE.
      Core message: money works like an employee — deploy it correctly and it builds more money.
      Never give direct financial advice. Add disclaimer when discussing investments.`,
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const content = result.response.text();

    return NextResponse.json({ content });
  } catch (error) {
    console.error("[AI_CHAT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}