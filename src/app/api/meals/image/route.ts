export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { parseMealFromImage } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const { imageUrl, caption } = (await req.json().catch(() => ({}))) as { imageUrl?: string; caption?: string };

  if (!imageUrl) {
    return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
  }

  let parsed;
  try {
    parsed = await parseMealFromImage(imageUrl, caption);
  } catch (err: any) {
    console.error("OpenAI vision error details:", err);
    return NextResponse.json({ 
      error: "Failed to analyze image", 
      details: err.message || String(err) 
    }, { status: 502 });
  }

  return NextResponse.json({ parsed });
}