import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateMacroTargets } from "@/lib/calculations";
import { ProfileFormInput } from "@/types";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as ProfileFormInput;
  const { height_cm, weight_kg, age, gender, activity_level, goal, goal_weight_kg, full_name } = body;

  if (!height_cm || !weight_kg || !age || !gender || !activity_level || !goal) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const targets = calculateMacroTargets({ weightKg: weight_kg, heightCm: height_cm, age, gender, activityLevel: activity_level, goal });

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: auth.user.id,
      full_name: full_name ?? null,
      height_cm,
      weight_kg,
      age,
      gender,
      activity_level,
      goal,
      goal_weight_kg: goal_weight_kg ?? null,
      bmr: targets.bmr,
      tdee: targets.tdee,
      calorie_target: targets.calorie_target,
      protein_target_g: targets.protein_target_g,
      carb_target_g: targets.carb_target_g,
      fat_target_g: targets.fat_target_g,
      water_target_ml: targets.water_target_ml,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log initial weight too
  await supabase.from("weight_logs").upsert(
    { user_id: auth.user.id, weight_kg, logged_at: new Date().toISOString().split("T")[0] },
    { onConflict: "user_id,logged_at" }
  );

  return NextResponse.json({ profile: data });
}

export async function GET() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}
