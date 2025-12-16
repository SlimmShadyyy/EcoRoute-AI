import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT,
  GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};