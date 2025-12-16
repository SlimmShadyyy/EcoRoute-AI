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

    // 1️⃣ Geocode all locations
    const coords = await geocodePlaces(locations);

    // 2️⃣ NORMAL route (as user entered)
    const normalDistanceKm = await getRouteDistance(coords);
    const normalCarbonKg = calculateCarbon(normalDistanceKm, vehicleType);

    // 3️⃣ OPTIMIZED route (TSP)
    const optimizedRoute = solveTSP(coords);
    const optimizedDistanceKm = await getRouteDistance(optimizedRoute);
    const optimizedCarbonKg = calculateCarbon(optimizedDistanceKm, vehicleType);

    const rawCarbonSaved = normalCarbonKg - optimizedCarbonKg;

    // Ensure no negative / NaN values (edge-case safe)
    const carbonSavedKg = Number.isFinite(rawCarbonSaved)
      ? Math.max(rawCarbonSaved, 0)
      : 0;


    // 5️⃣ AI explanation (now with comparison 🔥)
    const aiExplanation = await generateExplanation({
      distance: optimizedDistanceKm,
      carbonEmission: optimizedCarbonKg,
      vehicleType,
      carbonSaved: carbonSavedKg
    });

    // 6️⃣ Final response
    res.json({
      optimizedRoute: optimizedRoute.map(p => p.name),

      normalDistanceKm: Number(normalDistanceKm.toFixed(2)),
      optimizedDistanceKm: Number(optimizedDistanceKm.toFixed(2)),

      normalCarbonKg: Number(normalCarbonKg.toFixed(2)),
      optimizedCarbonKg: Number(optimizedCarbonKg.toFixed(2)),

      carbonSavedKg: Number(carbonSavedKg.toFixed(2)),
      aiExplanation
    });

  } catch (error) {
  console.error("EcoImpact Pipeline Error 🔴");
  console.error(error);
  console.error(error?.response?.data);

  res.status(500).json({
    error: error.message || "EcoImpact analysis failed"
  });
  }
}
