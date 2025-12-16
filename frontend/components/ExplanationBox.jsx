export default function ExplanationBox({ text }) {
  return (
    <div className="mt-6 bg-white border border-emerald-200 rounded-3xl shadow-xl p-8">
      <div className="card-body">
        <h3 className="text-lg font-bold mb-4">AI Insight 🤖🌍</h3>
        <p className="whitespace-pre-line leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}
