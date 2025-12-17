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
          limit: 1,
          country: "india", // 🔥 IMPORTANT
          apiKey: env.GEOAPIFY_API_KEY,
        },
      }
    );

    if (!res.data.results || res.data.results.length === 0) {
      throw new Error(`Could not geocode location: ${place}`);
    }

    const loc = res.data.results[0];

    results.push({
      name: place,
      lat: Number(loc.lat),
      lon: Number(loc.lon),
    });
  }
  return results;
}

export async function getRouteDistance(coords) {
  const waypoints = coords
    .map(c => `${c.lat},${c.lon}`)
    .join("|");

  const res = await axios.get(
    "https://api.geoapify.com/v1/routing",
    {
      params: {
        waypoints,
        mode: "drive",
        apiKey: process.env.GEOAPIFY_API_KEY
      }
    }
  );

  const feature = res.data.features[0];

  return {
    distanceKm: feature.properties.distance / 1000,
    geometry: feature.geometry.coordinates.map(([lon, lat]) => [lat, lon])
  };
}

