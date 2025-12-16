import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

// Client reads GEMINI_API_KEY from env automatically
const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY
});

export async function generateExplanation({ distance, carbonEmission, vehicleType }) {
  try {
    const prompt = `
You are an environmental sustainability assistant.

A user is traveling using a ${vehicleType} vehicle.
Total distance: ${distance.toFixed(2)} km
Estimated carbon emission: ${carbonEmission.toFixed(2)} kg CO2.

Explain in simple, friendly language:
- Why this route is environmentally efficient
- What the carbon emission means in real life
- Give 2 eco-friendly travel tips
Keep it concise.
Also briefly mention how choosing an optimized route helps reduce emissions compared to a longer or inefficient route.

`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    return response.text;

  } catch (error) {
    console.error("Gemini NEW SDK error:", error);
    throw new Error("Gemini generation failed");
  }
}
