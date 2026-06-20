import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Helper safe JSON parser
 */
function safeParse(content: string) {
  if (!content) return { error: "Empty response" };

  try {
    return JSON.parse(content);
  } catch (err) {
    return {
      error: "Invalid JSON",
      raw: content,
    };
  }
}

/**
 * Parse meal from image
 */
export async function parseMealFromImage(
  imageUrl: string,
  caption?: string
) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "Return ONLY valid JSON. No markdown. No explanation. JSON only.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this meal.

Caption: ${caption || "No caption"}

Return ONLY valid JSON in this format:
{
  "mealName": "",
  "ingredients": [],
  "estimatedCalories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0
}

IMPORTANT: JSON only.`,
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
  });

  const content = response.choices[0]?.message?.content || "";
  return safeParse(content);
}

/**
 * Parse meal from text
 */
export async function parseMealFromText(text: string) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "Return ONLY valid JSON. No markdown. No explanation. JSON only.",
      },
      {
        role: "user",
        content: `Extract meal info from text.

Text:
${text}

Return ONLY JSON:
{
  "mealName": "",
  "ingredients": [],
  "estimatedCalories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0
}

IMPORTANT: JSON only.`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content || "";
  return safeParse(content);
}

/**
 * Generate recommendations
 */
export async function generateMealRecommendations(data: any) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "Return ONLY valid JSON. No markdown. No explanation. JSON only.",
      },
      {
        role: "user",
        content: `Generate meal recommendations based on this data:

${JSON.stringify(data)}

Return ONLY JSON:
{
  "recommendations": [
    {
      "name": "",
      "calories": 0,
      "reason": ""
    }
  ]
}

IMPORTANT: JSON only.`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content || "";
  return safeParse(content);
}