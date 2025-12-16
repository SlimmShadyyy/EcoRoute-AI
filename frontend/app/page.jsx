"use client";
import ResultCards from "@/components/ResultCards";
import ExplanationBox from "@/components/ExplanationBox";
import { useState } from "react";
import { analyzeEcoImpact } from "@/services/api";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
});

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationsInput, setLocationsInput] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingMap, setLoadingMap] = useState(false);

  const handleTest = async () => {
    if (!locationsInput.trim()) {
      setError("Please enter at least two locations.");
      return;
    }

    const locations = locationsInput
      .split(",")
      .map((loc) => loc.trim())
      .filter(Boolean);

    if (locations.length < 2) {
      setError("Enter at least two locations.");
      return;
    }

    setLoadingAI(true);
    setLoadingMap(false);
    setError(null);
    setResult(null);

    const payload = {
      locations,
      vehicleType: "petrol",
    };

    try {
      const response = await analyzeEcoImpact(payload);

      if (response.error) {
        setError("AI is taking a bit longer. Please try again.");
      } else {
        setResult(response);
        setLoadingAI(false);
        setLoadingMap(true);
      }
    } catch (err) {
      setError("Something went wrong. Please retry.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-50 to-emerald-200 flex justify-center py-20">
      <div className="w-full max-w-3xl px-6 text-center">
        {/* HERO */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10">
          <h1 className="text-4xl font-extrabold text-green-700 mb-4">
            EcoRoute AI 🌱
          </h1>

          <p className="text-gray-600 mb-8">
            AI-powered route optimization to reduce carbon emissions
          </p>

          <input
            type="text"
            placeholder="Enter locations (e.g. Bangalore, Vellore, Chennai)"
            value={locationsInput}
            onChange={(e) => setLocationsInput(e.target.value)}
            className="w-full mb-6 px-5 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700"
          />

          <button
            onClick={handleTest}
            disabled={loadingAI}
            className={`px-10 py-4 rounded-2xl text-lg font-semibold shadow-lg transition ${
              loadingAI
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:scale-[1.03]"
            }`}
          >
            {loadingAI ? "🌍 Analyzing Eco Impact..." : "🌱 Test Eco Impact"}
          </button>


          {loadingAI && (
            <div className="mt-6 flex flex-col items-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-300 border-t-emerald-700"></div>
              <p className="mt-3 text-sm text-gray-600">
                Calculating optimal route & carbon impact…
              </p>
            </div>
          )}


          {error && (
            <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
          )}
        </div>

        {/* RESULTS */}
        {result && (
  <div className="mt-12 space-y-8 text-left">
        <ResultCards data={result} />
        <ExplanationBox text={result.aiExplanation} />
        <div className="mt-10 relative h-[420px] rounded-3xl overflow-hidden shadow-xl border border-emerald-200">
          {loadingMap && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-emerald-50">
              <p className="text-emerald-700 font-medium animate-pulse">
                🗺️ Loading optimized route…
              </p>
            </div>
          )}

          <MapView
            coordinates={result.optimizedCoordinates}
            onMapReady={() => setLoadingMap(false)}
          />
        </div>

      </div>
    )}

      </div>
    </main>
  );
}
