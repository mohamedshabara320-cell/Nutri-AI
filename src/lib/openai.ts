import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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
          "Return ONLY valid JSON. No markdown. No explanations. Output must be a JSON object.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this meal: ${
              caption || "What is this meal?"
            }

Return a JSON object with:
{
  "mealName": "",
  "ingredients": [],
  "estimatedCalories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0
}`,
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
  } catch {
    return { raw: content };
  }
}

export async function parseMealFromText(text: string) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "Return ONLY valid JSON. No markdown. No explanations. Output must be a JSON object.",
      },
      {
        role: "user",
        content: `Extract nutrition data from:

"${text}"

Return:
{
  "mealName": "",
  "ingredients": [],
  "estimatedCalories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0
}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content || "{}";

  try {
    return JSON.parse(content);
  } catch {
    return { raw: content };
  }
}

export async function generateMealRecommendations(data: any) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "Return ONLY valid JSON. No markdown. No explanations. Output must be a JSON object.",
      },
      {
        role: "user",
        content: `Based on this user data:

${JSON.stringify(data)}

Return:
{
  "recommendations": [
    {
      "name": "",
      "calories": 0,
      "reason": ""
    }
  ]
}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content || "{}";

  try {
    return JSON.parse(content);
  } catch {
    return { raw: content };
  }
}