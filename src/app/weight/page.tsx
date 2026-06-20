"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useWeightHistory } from "@/hooks/useWeightHistory";
import WeightChart from "@/components/Weight/WeightChart";
import { TrendingUp } from "lucide-react";

export default function WeightPage() {
  const { profile } = useProfile();
  const { logs, loading, addEntry, weeklyTrendKg, currentWeight, prediction } = useWeightHistory(
    profile?.goal_weight_kg
  );
  const [weight, setWeight] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!weight) return;
    setSubmitting(true);
    await addEntry(Number(weight));
    setWeight("");
    setSubmitting(false);
  }

  return (
    <div className="space-y-5 px-4 py-6">
      <h1 className="text-xl font-bold">Weight tracking</h1>

      <div className="card">
        {loading ? <p className="text-center text-gray-400">Loading…</p> : <WeightChart logs={logs} />}
      </div>

      <form onSubmit={handleSubmit} className="card flex gap-2">
        <input
          type="number"
          step="0.1"
          required
          placeholder="Today's weight (kg)"
          className="input flex-1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <button type="submit" disabled={submitting} className="btn-primary">
          Log
        </button>
      </form>

      <div className="card space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-brand-600" />
          <h2 className="font-semibold">Trend & prediction</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Current: <strong>{currentWeight ?? "—"} kg</strong> · Weekly trend:{" "}
          <strong>{weeklyTrendKg >= 0 ? "+" : ""}{weeklyTrendKg.toFixed(2)} kg/week</strong>
        </p>
        {profile?.goal_weight_kg ? (
          prediction ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              At this rate, you'll reach your goal of <strong>{profile.goal_weight_kg} kg</strong> around{" "}
              <strong>{prediction.estimatedDate}</strong> (~{prediction.weeksRemaining} weeks).
            </p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Log a few more weigh-ins in the right direction to get a prediction.
            </p>
          )
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Set a goal weight in your profile to see a prediction.
          </p>
        )}
      </div>
    </div>
  );
}
