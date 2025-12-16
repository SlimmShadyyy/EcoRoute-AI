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
          apiKey: env.GEOAPIFY_API_KEY
        }
      }
    );

    results.push({
      name: place,
      lat: res.data.results[0].lat,
      lon: res.data.results[0].lon
    });
  }

  return results;
}

export async function getRouteDistance(coords) {
  if (!coords || coords.length < 2) {
    throw new Error("At least two coordinates required for routing");
  }

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

  return res.data.features[0].properties.distance / 1000;
}

