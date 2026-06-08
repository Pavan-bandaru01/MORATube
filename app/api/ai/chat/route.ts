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
    if (!messages || messages.length === 0) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are MORA Assistant, an AI built for MORATube — a financial literacy platform. 
      Help users understand money behavior, investing, SIP, mutual funds, debt traps, AI tools, and wealth habits. 
      Always keep answers concise, practical, and easy to understand for average Indians.
      Use Indian context — INR, Indian markets, Zerodha, Groww, NSE, BSE.
      Core message: money works like an employee — deploy it correctly and it builds more money.
      Never give direct financial advice. Add disclaimer when discussing investments.`,
    });

    // Build valid history — must start with user, alternate user/model
    const previousMessages = messages.slice(0, -1);
    const validHistory: { role: string; parts: { text: string }[] }[] = [];

    for (const msg of previousMessages) {
      const role = msg.role === "assistant" ? "model" : "user";
      // Skip if same role as last added (Gemini requires alternating)
      if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === role) {
        continue;
      }
      validHistory.push({
        role,
        parts: [{ text: msg.content }],
      });
    }

    // Ensure history starts with user
    while (validHistory.length > 0 && validHistory[0].role !== "user") {