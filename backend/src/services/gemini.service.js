import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

// ✅ CREATE THE AI CLIENT (THIS WAS MISSING)
const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY
});

export async function generateExplanation({
  distance,
  carbonEmission,
  vehicleType,
  carbonSaved
}) {
  try {
    const prompt = `
You are an environmental sustainability assistant.

A user is traveling using a ${vehicleType} vehicle.
Optimized route distance: ${distance.toFixed(2)} km
Carbon emission for optimized route: ${carbonEmission.toFixed(2)} kg CO2
Carbon saved compared to a non-optimized route: ${Number(carbonSaved).toFixed(2)} kg CO2

Explain in simple, friendly language:
- How route optimization helped reduce emissions
- What the carbon savings mean in real-world terms
- Give 2 eco-friendly travel tips

Keep it concise and non-technical.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    return response.text;

  } catch (error) {
    console.error("Gemini error:", error);
    throw new Error("Gemini generation failed");
  }
}
