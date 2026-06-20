import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a professional AI nutrition coach. You give short, practical, human-friendly advice about diet, calories, macros, and fitness.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return NextResponse.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Chat failed", details: err.message },
      { status: 500 }
    );
  }
}