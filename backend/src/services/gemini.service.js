import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateExplanation({
  distance = 0,
  carbonEmission = 0,
  vehicleType = "vehicle",
  carbonSavedKg = 0,
}) {

  if (carbonSavedKg === 0) {
    return `
You already chose the most efficient route 🌱  
That means no extra carbon was saved — which is actually a win.

Smart routing from the start reduces unnecessary fuel burn.  
Keeping a steady speed and proper tire pressure will help keep emissions low.
`;
  }

  try {
    const prompt = `
Vehicle type: ${vehicleType}
Distance traveled: ${distance.toFixed(2)} km
Carbon emitted: ${carbonEmission.toFixed(2)} kg CO₂
Carbon saved: ${carbonSavedKg.toFixed(2)} kg CO₂

Explain in simple, human language:
- Why this route is eco-friendly
- What this carbon saving practically means
- Give exactly 2 eco-friendly driving tips
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;

  } catch (err) {
    console.error("Gemini failed, using fallback", err);

    return `
By choosing a shorter and more efficient route, fuel consumption was reduced.
This saved ${carbonSavedKg.toFixed(2)} kg of CO₂ 🌍

Driving smoothly and maintaining proper tire pressure can further improve efficiency.
`;
  }
}
