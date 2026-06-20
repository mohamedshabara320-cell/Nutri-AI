import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseMealFromText } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { description, logged_at } = (await req.json()) as {
    description: string;
    logged_at?: string;
  };

  if (!description?.trim()) {
    return NextResponse.json({ error: "Meal description is required" }, { status: 400 });
  }

  let parsed;
  try {
    parsed = await parseMealFromText(description);
  } catch (err) {
    console.error("OpenAI parse error", err);
    return NextResponse.json({ error: "Failed to analyze meal text" }, { status: 502 });
  }

  const { data, error } = await supabase
    .from("meal_logs")
    .insert({
      user_id: auth.user.id,
      raw_input: description,
      input_type: "text",
      meal_name: parsed.meal_name,
      calories: parsed.total_calories,
      protein_g: parsed.total_protein,
      carbs_g: parsed.total_carbs,
      fat_g: parsed.total_fat,
      items: parsed.items,
      logged_at: logged_at ?? new Date().toISOString().split("T")[0],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ meal: data });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const date = req.nextUrl.searchParams.get("date") ?? new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("meal_logs")
    .select("*")
    .eq("user_id", auth.user.id)
    .eq("logged_at", date)
    .order("meal_time", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ meals: data });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase.from("meal_logs").delete().eq("id", id).eq("user_id", auth.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
