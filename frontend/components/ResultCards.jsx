export default function ResultCards({ data }) {
  return (
    <div className="bg-white border border-emerald-200 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] p-8">
      <div className="card-body">
        <h2 className="card-title text-success">Impact Summary 🌱</h2>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm opacity-70">Normal Distance</p>
            <p className="font-semibold">{data.normalDistanceKm} km</p>
          </div>

          <div>
            <p className="text-sm opacity-70">Optimized Distance</p>
            <p className="font-semibold">{data.optimizedDistanceKm} km</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 p-6 text-white text-center border border-emerald-700">
          <p className="text-sm opacity-90 uppercase tracking-wide">CO₂ Saved</p>
          <p className="text-4xl font-extrabold mt-1">
            {data.carbonSavedKg} kg
          </p>
        </div>
        <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <p className="text-sm uppercase tracking-wide text-emerald-700 font-semibold mb-2">
            🌍 Optimized Eco Route
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-emerald-900 font-medium">
              {data.optimizedRoute?.map((city, index) => (
                <span key={index} className="flex items-center">
                  <span className="px-3 py-1 rounded-full bg-white border border-emerald-300 shadow-sm">
                    {city}
                  </span>
                  {index < data.optimizedRoute.length - 1 && (
                    <span className="mx-2 text-emerald-500">→</span>
                  )}
                </span>
              ))}
            </div>
          </div>

        {data.isOptimizedWorse ? (
            <p className="text-sm text-yellow-700 mt-2 text-center">
              This route prioritizes feasibility over distance — emissions may be higher ⚠️
            </p>
          ) : data.carbonSavedKg === 0 ? (
            <p className="text-sm text-gray-600 mt-2 text-center">
              This route is already optimal — no extra savings possible 🌍
            </p>
          ) : (
            <p className="text-sm text-green-700 mt-2 text-center">
              You avoided unnecessary emissions by choosing the best route!
            </p>
          )}

      </div>
    </div>
  );
}
