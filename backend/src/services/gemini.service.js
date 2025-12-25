import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
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
No extra carbon was saved — which actually means great planning.

Keeping steady speeds and proper tire pressure will help keep emissions low.
`;
  }

  try {
    const prompt = `
Vehicle: ${vehicleType}
Distance: ${distance.toFixed(2)} km
Carbon emission: ${carbonEmission.toFixed(2)} kg CO2
Carbon saved: ${carbonSavedKg.toFixed(2)} kg CO2

Explain clearly:
- Why this route is eco-friendly
- What the savings mean
- Give 2 eco tips
`;

    const result = await model.generateContent(prompt);
    return result.response.text();

  } catch (err) {
    console.error("Gemini failed, using fallback", err);

    return `
Shorter routes reduce fuel usage and emissions.
You saved ${carbonSavedKg.toFixed(2)} kg of CO₂ 🌍
Drive smoothly and keep tires inflated for better efficiency.
`;
  }
}
