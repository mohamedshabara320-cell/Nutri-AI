"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ActivityLevel, Gender, Goal } from "@/types";

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Sedentary (little/no exercise)" },
  { value: "light", label: "Light (1-3 days/week)" },
  { value: "moderate", label: "Moderate (3-5 days/week)" },
  { value: "active", label: "Active (6-7 days/week)" },
  { value: "very_active", label: "Very active (athlete/physical job)" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    height_cm: "",
    weight_kg: "",
    age: "",
    gender: "male" as Gender,
    activity_level: "moderate" as ActivityLevel,
    goal: "weight_gain" as Goal,
    goal_weight_kg: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: form.full_name || undefined,
        height_cm: Number(form.height_cm),
        weight_kg: Number(form.weight_kg),
        age: Number(form.age),
        gender: form.gender,
        activity_level: form.activity_level,
        goal: form.goal,
        goal_weight_kg: form.goal_weight_kg ? Number(form.goal_weight_kg) : undefined,
      }),
    });

    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="px-5 py-8">
      <h1 className="mb-1 text-2xl font-bold">Let's set up your profile</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        We'll calculate your personalized calorie and macro targets.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium">Full name (optional)</label>
          <input className="input" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Height (cm)</label>
            <input
              type="number"
              required
              className="input"
              value={form.height_cm}
              onChange={(e) => update("height_cm", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Weight (kg)</label>
            <input
              type="number"
              required
              step="0.1"
              className="input"
              value={form.weight_kg}
              onChange={(e) => update("weight_kg", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Age</label>
            <input
              type="number"
              required
              className="input"
              value={form.age}
              onChange={(e) => update("age", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Gender</label>
            <select className="input" value={form.gender} onChange={(e) => update("gender", e.target.value as Gender)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Activity level</label>
          <select
            className="input"
            value={form.activity_level}
            onChange={(e) => update("activity_level", e.target.value as ActivityLevel)}
          >
            {ACTIVITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Goal</label>
          <select className="input" value={form.goal} onChange={(e) => update("goal", e.target.value as Goal)}>
            <option value="weight_gain">Weight gain (lean bulk)</option>
            <option value="maintenance">Maintain weight</option>
            <option value="weight_loss">Weight loss</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Goal weight (kg, optional)</label>
          <input
            type="number"
            step="0.1"
            className="input"
            value={form.goal_weight_kg}
            onChange={(e) => update("goal_weight_kg", e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Calculating…" : "Calculate my targets"}
        </button>
      </form>
    </div>
  );
}
