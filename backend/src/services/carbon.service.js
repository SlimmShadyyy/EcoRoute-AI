import { EMISSION_FACTORS } from "../utils/emissionFactors.js";

export function calculateCarbon(distance, vehicleType) {
  return distance * EMISSION_FACTORS[vehicleType];
}