export async function analyzeEcoImpact(payload) {
  const res = await fetch("http://localhost:5000/api/ecoimpact/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Backend error:", data);
    return {
      error: true,
      message: data?.error || "Something went wrong"
    };
  }

  return data;
}
