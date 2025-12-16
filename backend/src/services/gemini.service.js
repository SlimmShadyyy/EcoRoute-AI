export async function generateExplanation({
  distance = 0,
  carbonEmission = 0,
  vehicleType = "vehicle",
  carbonSavedKg = 0,
}) {

  // 🚀 EARLY EXIT (put this at the TOP of the function)
  if (carbonSavedKg === 0) {
    return `
You already chose the most efficient route for this trip 🌱  
That means there was no extra carbon to save — which is actually a good thing.

This shows smart planning from the start.  
For future trips, smooth driving and proper tire pressure can still help keep emissions low.
`;
  }

  // ⬇️ Gemini only runs if savings > 0
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (err) {
    console.error("Gemini failed, using fallback", err);

    return `
Shorter routes reduce fuel usage and emissions.
You saved ${carbonSavedKg.toFixed(2)} kg of CO₂ — nice work 🌍
Drive smoothly and keep tires inflated for even better efficiency.
`;
  }
}
