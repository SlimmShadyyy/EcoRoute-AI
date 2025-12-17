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
    let finalDistanceKm = tspRouteData.distanceKm;
    
    if (tspRouteData.distanceKm >= normalDistanceKm) {
      finalRoute = coords;
      finalDistanceKm = normalDistanceKm;
    }

    // 5️⃣ Carbon
    const optimizedCarbonKg = calculateCarbon(
      finalDistanceKm,
      vehicleType
    );

    const carbonSavedKg = Math.max(
      normalCarbonKg - optimizedCarbonKg,
      0
    );

    // 6️⃣ AI explanation
    const aiExplanation = await generateExplanation({
      distance: finalDistanceKm,
      carbonEmission: optimizedCarbonKg,
      carbonSavedKg,
      vehicleType,
    });

    const toCoords = (arr) =>
    arr.map((p) => [Number(p.lat), Number(p.lon)]);
  
  res.json({
    optimizedRoute: finalRoute.map((p) => p.name),
  
    normalCoordinates: toCoords(coords),
    optimizedCoordinates: toCoords(finalRoute),
  
    normalDistanceKm: Number(normalDistanceKm.toFixed(2)),
    optimizedDistanceKm: Number(finalDistanceKm.toFixed(2)),
  
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
