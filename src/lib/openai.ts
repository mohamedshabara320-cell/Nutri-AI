import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function parseMealFromImage(imageUrl: string, caption?: string) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that outputs only valid JSON."
      },
      {
        role: "user",
        content: [
          { type: "text", text: `Analyze this meal: ${caption || "What is this?"}. Return the response as a JSON object.` },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
    response_format: { type: "json_object" },
  });
  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function parseMealFromText(text: string) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that outputs only valid JSON."
      },
      {
        role: "user",
        content: `Extract meal details from this text: ${text}. Return the response as a JSON object.`,
      },
    ],
    response_format: { type: "json_object" },
  });
  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function generateMealRecommendations(data: any) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that outputs only valid JSON."
      },
      {
        role: "user",
        content: `Provide meal recommendations based on: ${JSON.stringify(data)}. Return the response as a JSON object.`,
      },
    ],
    response_format: { type: "json_object" },
  });
  return JSON.parse(response.choices[0].message.content || "{}");
}