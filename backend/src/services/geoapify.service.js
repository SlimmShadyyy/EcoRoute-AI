import axios from "axios";
import { env } from "../config/env.js";

export async function geocodePlaces(locations) {
  const results = [];

  for (const place of locations) {
    const res = await axios.get(
      "https://api.geoapify.com/v1/geocode/search",
      {
        params: {
          text: place,
          format: "json",
          limit: 5,
          country: "india",
          apiKey: env.GEOAPIFY_API_KEY,
        },
      }
    );

    console.log("🔎 Geocode response for:", place);
    console.log(res.data.results);

    const valid = res.data.results?.find(
      (r) => typeof r.lat === "number" && typeof r.lon === "number"
    );

    if (!valid) {
      throw new Error(`Could not geocode location: ${place}`);
    }

    results.push({
      name: place,
      lat: Number(valid.lat),
      lon: Number(valid.lon),
    });
  }

  return results;
}

export async function getRouteDistance(coords) {
  const waypoints = coords
    .map(c => `${c.lat},${c.lon}`)
    .join("|");

  const res = await axios.get("https://api.geoapify.com/v1/routing", {
    params: {
      waypoints,
      mode: "drive",
      details: "route_details",
      apiKey: env.GEOAPIFY_API_KEY,
    },
  });
  
  const routeLine = res.data.features[0].geometry.coordinates
    .map(([lon, lat]) => [lat, lon]);

  const feature = res.data.features[0];

  return {
    distanceKm: feature.properties.distance / 1000,
    geometry: feature.geometry.coordinates.map(([lon, lat]) => [lat, lon])
  };
}

