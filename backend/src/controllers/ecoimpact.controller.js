import { geocodePlaces, getRouteDistance } from "../services/geoapify.service.js";
import { solveTSP } from "../services/tsp.service.js";
import { calculateCarbon } from "../services/carbon.service.js";
import { generateExplanation } from "../services/gemini.service.js";

export async function analyzeEcoImpact(req, res) {
  try {
    const { locations, vehicleType } = req.body;

    if (!locations || locations.length < 2) {
      return res.status(400).json({
        error: "At least two locations are required"
      });
    }

    // 1️⃣ Geocode
    const coords = await geocodePlaces(locations);

    // 2️⃣ Optimize order
    const optimizedRoute = solveTSP(coords);

    // 3️⃣ Distance calculation
    const distanceKm = await getRouteDistance(optimizedRoute);

    // 4️⃣ Carbon emission
    const carbonEmissionKg = calculateCarbon(distanceKm, vehicleType);

    // 5️⃣ AI explanation
    const aiExplanation = await generateExplanation({
      distance: distanceKm,
      carbonEmission: carbonEmissionKg,
      vehicleType
    });

    // 6️⃣ Final response
    res.json({
      optimizedRoute: optimizedRoute.map(p => p.name),
      distanceKm: Number(distanceKm.toFixed(2)),
      carbonEmissionKg: Number(carbonEmissionKg.toFixed(2)),
      aiExplanation
    });

  } catch (error) {
    console.error("EcoImpact Pipeline Error:", error);
    res.status(500).json({
      error: "EcoImpact analysis failed"
    });
  }
}
