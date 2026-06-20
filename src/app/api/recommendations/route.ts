import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateMealRecommendations } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { mealTime } = (await req.json().catch(() => ({}))) as { mealTime?: string };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const today = new Date().toISOString().split("T")[0];
  const { data: meals } = await supabase
    .from("meal_logs")
    .select("calories, protein_g, carbs_g, fat_g")
    .eq("user_id", auth.user.id)
    .eq("logged_at", today);

  const consumed = (meals ?? []).reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein_g,
      carbs: acc.carbs + m.carbs_g,
      fat: acc.fat + m.fat_g,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const remaining = {
    remainingCalories: Math.max(0, Math.round(profile.calorie_target - consumed.calories)),
    remainingProtein: Math.max(0, Math.round(profile.protein_target_g - consumed.protein)),
    remainingCarbs: Math.max(0, Math.round(profile.carb_target_g - consumed.carbs)),
    remainingFat: Math.max(0, Math.round(profile.fat_target_g - consumed.fat)),
    goal: profile.goal,
    mealTime,
  };

  let suggestions;
  try {
    suggestions = await generateMealRecommendations(remaining);
  } catch (err: any) {
    return NextResponse.json({ 
      error: "Failed to generate recommendations", 
      details: err.message || String(err) 
    }, { status: 502 });
  }

  await supabase.from("meal_recommendations").insert({
    user_id: auth.user.id,
    context: remaining,
    suggestions,
  });

  return NextResponse.json({ remaining, suggestions });
}