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
    const tspRoute = solveTSP(coords);
    const tspDistanceKm = await getRouteDistance(tspRoute);

    // 4️⃣ Decide final route
    let finalRoute = tspRoute;
    let finalDistanceKm = tspDistanceKm;

    if (tspDistanceKm >= normalDistanceKm) {
      finalRoute = coords;
      finalDistanceKm = normalDistanceKm;
    }

    // 5️⃣ Carbon calculation (ONLY optimized here)
    const optimizedCarbonKg = calculateCarbon(finalDistanceKm, vehicleType);
    const carbonSavedKg = Math.max(normalCarbonKg - optimizedCarbonKg, 0);

    // 6️⃣ AI explanation
    const aiExplanation = await generateExplanation({
      distance: finalDistanceKm,
      carbonEmission: optimizedCarbonKg,
      carbonSavedKg,
      vehicleType,
    });

    // 7️⃣ RESPONSE
    res.json({
      optimizedRoute: finalRoute.map(p => p.name),
      optimizedCoordinates: finalRoute.map(p => [p.lat, p.lon]),

      normalDistanceKm: Number(normalDistanceKm.toFixed(2)),
      optimizedDistanceKm: Number(finalDistanceKm.toFixed(2)),

      normalCarbonKg: Number(normalCarbonKg.toFixed(2)),
      optimizedCarbonKg: Number(optimizedCarbonKg.toFixed(2)),

      carbonSavedKg: Number(carbonSavedKg.toFixed(2)),
      aiExplanation,
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
