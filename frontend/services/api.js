const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function analyzeEcoImpact(payload) {
  const res = await fetch(`${API_URL}/api/ecoimpact/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}
