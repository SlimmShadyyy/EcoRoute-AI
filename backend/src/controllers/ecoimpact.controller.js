import { geocodePlaces, getRouteDistance } from "../services/geoapify.service.js";
import { solveTSP } from "../services/tsp.service.js";
import { calculateCarbon } from "../services/carbon.service.js";
import { generateExplanation } from "../services/gemini.service.js";

export async function analyzeEcoImpact(req, res) {
  try {
    const { locations, vehicleType } = req.body;

    if (!locations || locations.length < 2) {
      return res.status(400).json({
        error: "At least two locations are required",
      });
    }

    // 1️⃣ Geocode
    const coords = await geocodePlaces(locations);

    // 2️⃣ NORMAL route (user order)
    const normalRouteData = await getRouteDistance(coords);
    const normalDistanceKm = normalRouteData.distanceKm;
    const normalCarbonKg = calculateCarbon(normalDistanceKm, vehicleType);

    // 3️⃣ OPTIMIZED route (TSP)
    const tspRoute = solveTSP(coords);
    const tspRouteData = await getRouteDistance(tspRoute);

    // 4️⃣ Decide FINAL route
    let finalRoute = tspRoute;
    let finalRouteData = tspRouteData;

    if (tspRouteData.distanceKm >= normalDistanceKm) {
      finalRoute = coords;
      finalRouteData = normalRouteData;
    }

    // 5️⃣ Carbon
    const optimizedCarbonKg = calculateCarbon(
      finalRouteData.distanceKm,
      vehicleType
    );

    const carbonSavedKg = Math.max(
      normalCarbonKg - optimizedCarbonKg,
      0
    );

    // 6️⃣ AI explanation
    const aiExplanation = await generateExplanation({
      distance: finalRouteData.distanceKm,
      carbonEmission: optimizedCarbonKg,
      carbonSavedKg,
      vehicleType,
    });

    // 7️⃣ RESPONSE (THIS is what frontend needs)
    res.json({
      optimizedRoute: finalRoute.map(p => p.name),

      normalCoordinates: normalRouteData.geometry,
      optimizedCoordinates: finalRouteData.geometry,

      normalDistanceKm: Number(normalDistanceKm.toFixed(2)),
      optimizedDistanceKm: Number(finalRouteData.distanceKm.toFixed(2)),

      normalCarbonKg: Number(normalCarbonKg.toFixed(2)),
      optimizedCarbonKg: Number(optimizedCarbonKg.toFixed(2)),

      carbonSavedKg: Number(carbonSavedKg.toFixed(2)),
      aiExplanation,
    });

  } catch (error) {
    console.error("EcoImpact Pipeline Error 🔴", error);

    res.status(500).json({
      error: error.message || "EcoImpact analysis failed",
    });
  }
}
