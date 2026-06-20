import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { weight_kg, logged_at, note } = (await req.json()) as {
    weight_kg: number;
    logged_at?: string;
    note?: string;
  };

  if (!weight_kg) return NextResponse.json({ error: "weight_kg is required" }, { status: 400 });

  const date = logged_at ?? new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("weight_logs")
    .upsert(
      { user_id: auth.user.id, weight_kg, logged_at: date, note: note ?? null },
      { onConflict: "user_id,logged_at" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Keep profile.weight_kg in sync with most recent entry
  await supabase.from("profiles").update({ weight_kg }).eq("id", auth.user.id);

  return NextResponse.json({ log: data });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 90);

  const { data, error } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", auth.user.id)
    .order("logged_at", { ascending: true })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ logs: data });
}
