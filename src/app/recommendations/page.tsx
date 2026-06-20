"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

const MEAL_TIMES = ["breakfast", "lunch", "dinner", "snack"];

export default function RecommendationsPage() {
  const [mealTime, setMealTime] = useState("dinner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [remaining, setRemaining] = useState<any>(null);

  async function generate() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealTime }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Failed to generate recommendations");
        setSuggestions([]);
        setRemaining(null);
        return;
      }

      setSuggestions(json?.suggestions?.recommendations ?? []);
      setRemaining(json?.remaining ?? null);
    } catch (err) {
      setError("Network error");
      setSuggestions([]);
      setRemaining(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5 px-4 py-6">
      <h1 className="text-xl font-bold">AI meal suggestions</h1>

      <div className="card space-y-3">
        <label className="block text-sm font-medium">
          What meal are you planning?
        </label>

        <div className="flex gap-2">
          {MEAL_TIMES.map((t) => (
            <button
              key={t}
              onClick={() => setMealTime(t)}
              className={`flex-1 rounded-xl border px-2 py-2 text-sm capitalize ${
                mealTime === t
                  ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-600/10 dark:text-brand-400"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="btn-primary w-full gap-2"
        >
          <Sparkles size={16} />
          {loading ? "Thinking…" : "Get suggestions"}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {remaining && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Remaining today: {remaining.remainingCalories} kcal · P
          {remaining.remainingProtein} C{remaining.remainingCarbs} F
          {remaining.remainingFat}
        </p>
      )}

      <div className="space-y-3">
        {Array.isArray(suggestions) && suggestions.length > 0 ? (
          suggestions.map((s, i) => (
            <div key={i} className="card">
              <p className="font-semibold">{s.name}</p>
              <p className="mt-2 text-xs text-gray-500">
                {s.calories} kcal · P{s.protein} C{s.carbs} F{s.fat}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {s.reason}
              </p>
            </div>
          ))
        ) : (
          !loading && <p className="text-sm text-gray-500">No suggestions yet</p>
        )}
      </div>
    </div>
  );
}