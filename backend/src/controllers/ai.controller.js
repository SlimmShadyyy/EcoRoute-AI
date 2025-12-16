import { generateExplanation } from "../services/gemini.service.js";

export async function explainImpact(req, res) {
  try {
    const { distance, carbonEmission, vehicleType } = req.body;

    if (!distance || !carbonEmission || !vehicleType) {
      return res.status(400).json({
        error: "distance, carbonEmission, and vehicleType are required"
      });
    }

    const explanation = await generateExplanation({
      distance,
      carbonEmission,
      vehicleType
    });

    res.json({ explanation });
  } catch (error) {
    console.error("Gemini Controller Error:", error.message);
    res.status(500).json({
      error: "Failed to generate AI explanation"
    });
  }
}
