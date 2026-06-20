import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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
          "You are a JSON generator. Always return ONLY valid JSON. No explanations. No markdown. Only JSON.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this meal. ${
              caption || "No caption provided"
            }. Return ONLY JSON in this format:

{
  "mealName": "",
  "ingredients": [],
  "estimatedCalories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0
}

IMPORTANT: return JSON only.`,
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

  const content = response.choices[0]?.message?.content || "{}";

  try {
    return JSON.parse(content);
  } catch (err) {
    return { raw: content };
  }
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
          "You are a JSON generator. Always return ONLY valid JSON. No explanations. Only JSON output.",
      },
      {
        role: "user",
        content: `Extract meal data from this text:

"${text}"

Return ONLY JSON in this format:

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

  const content = response.choices[0]?.message?.content || "{}";

  try {
    return JSON.parse(content);
  } catch (err) {
    return { raw: content };
  }
}

/**
 * Generate meal recommendations
 */
export async function generateMealRecommendations(data: any) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a JSON generator. Always return ONLY valid JSON. No explanations. No markdown.",
      },
      {
        role: "user",
        content: `Generate meal recommendations based on this data:

${JSON.stringify(data)}

Return ONLY JSON in this format:

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

  const content = response.choices[0]?.message?.content || "{}";

  try {
    return JSON.parse(content);
  } catch (err) {
    return { raw: content };
  }
}