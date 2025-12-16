import { geocodePlaces, getRouteDistance } from "../services/geoapify.service.js";
import { solveTSP } from "../services/tsp.service.js";
import { calculateCarbon } from "../services/carbon.service.js";

export async function optimizeRoute(req, res) {
  try {
    const { locations, vehicleType } = req.body;

    const coords = await geocodePlaces(locations);

    const optimized = solveTSP(coords);

    const distance = await getRouteDistance(optimized);

    const carbon = calculateCarbon(distance, vehicleType);

    res.json({
      optimizedOrder: optimized.map(p => p.name),
      distance,
      carbonEmission: carbon,
      routeCoordinates: optimized
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}