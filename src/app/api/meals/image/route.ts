import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseMealFromImage } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("image") as File | null;
  const caption = (formData.get("caption") as string) || undefined;
  const logged_at = (formData.get("logged_at") as string) || new Date().toISOString().split("T")[0];

  if (!file) return NextResponse.json({ error: "image is required" }, { status: 400 });

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${auth.user.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("food-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from("food-images").getPublicUrl(path);
  const imageUrl = publicUrlData.publicUrl;

  let parsed;
  try {
    parsed = await parseMealFromImage(imageUrl, caption);
  } catch (err) {
    console.error("OpenAI vision error", err);
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 502 });
  }

  const { data, error } = await supabase
    .from("meal_logs")
    .insert({
      user_id: auth.user.id,
      raw_input: caption ?? null,
      input_type: "image",
      image_url: imageUrl,
      meal_name: parsed.meal_name,
      calories: parsed.total_calories,
      protein_g: parsed.total_protein,
      carbs_g: parsed.total_carbs,
      fat_g: parsed.total_fat,
      items: parsed.items,
      logged_at,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ meal: data });
}
