import OpenAI from "openai";
import { MealItem } from "@/types";

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const MEAL_PARSE_SYSTEM_PROMPT = `You are a precise nutrition analyst. Given a natural-language
description of a meal, extract each distinct food item with an estimated quantity and unit,
and estimate calories and macros (grams of protein, carbs, fat) for that quantity using
standard nutrition databases (USDA-style estimates). Be realistic and concise.

Respond with ONLY valid JSON, no markdown, no commentary, matching this exact shape:
{
  "meal_name": string,            // short label e.g. "Chicken rice bowl"
  "items": [
    {
      "name": string,
      "quantity": number,
      "unit": string,             // e.g. "g", "cup", "piece", "tbsp"
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number
    }
  ],
  "total_calories": number,
  "total_protein": number,
  "total_carbs": number,
  "total_fat": number
}`;

export interface ParsedMeal {
  meal_name: string;
  items: MealItem[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
}

function safeParseJSON<T>(text: string): T {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as T;
}

export async function parseMealFromText(description: string): Promise<ParsedMeal> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: MEAL_PARSE_SYSTEM_PROMPT },
      { role: "user", content: description },
    ],
  });

  const text = completion.choices[0]?.message?.content ?? "{}";
  return safeParseJSON<ParsedMeal>(text);
}

export async function parseMealFromImage(imageUrl: string, caption?: string): Promise<ParsedMeal> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: MEAL_PARSE_SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: caption
              ? `Analyze this food photo. Additional context: ${caption}`
              : "Analyze this food photo and identify all foods present with estimated portions.",
          },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
  });

  const text = completion.choices[0]?.message?.content ?? "{}";
  return safeParseJSON<ParsedMeal>(text);
}

export interface RecommendationInput {
  remainingCalories: number;
  remainingProtein: number;
  remainingCarbs: number;
  remainingFat: number;
  goal: string;
  mealTime?: string; // breakfast/lunch/dinner/snack
}

export interface MealSuggestion {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export async function generateMealRecommendations(
  input: RecommendationInput
): Promise<MealSuggestion[]> {
  const prompt = `User goal: ${input.goal}. Remaining today: ${input.remainingCalories} kcal,
${input.remainingProtein}g protein, ${input.remainingCarbs}g carbs, ${input.remainingFat}g fat.
${input.mealTime ? `This is for ${input.mealTime}.` : ""}
Suggest 3 realistic, practical meal options that fit within these remaining macros
(can be slightly under, never far over calories). Favor whole foods and simple prep.

Respond with ONLY valid JSON array, no markdown:
[{ "name": string, "description": string, "calories": number, "protein": number, "carbs": number, "fat": number }]`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      { role: "system", content: "You are a registered-dietitian-level meal planning assistant." },
      { role: "user", content: prompt },
    ],
  });

  const text = completion.choices[0]?.message?.content ?? "[]";
  return safeParseJSON<MealSuggestion[]>(text);
}
