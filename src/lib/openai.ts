import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateMealRecommendations(remaining: any) {
  const prompt = `
    Based on these remaining macros: ${JSON.stringify(remaining)},
    provide meal recommendations for the next meal.
    Return the response as a valid JSON object.
  `;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama3-70b-8192", 
    response_format: { type: "json_object" },
  });

  return JSON.parse(chatCompletion.choices[0].message.content || "{}");
}