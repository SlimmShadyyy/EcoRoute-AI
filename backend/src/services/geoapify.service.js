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

export async function getRouteDistance(points) {
  const waypoints = points.map(p => `${p.lat},${p.lon}`).join("|");

  const res = await axios.get("https://api.geoapify.com/v1/geocode/search", {
  params: {
    text: place,
    filter: "countrycode:in",   
    limit: 1,
    apiKey: GEOAPIFY_KEY
  }
});;

  return res.data.features[0].properties.distance / 1000;
}
