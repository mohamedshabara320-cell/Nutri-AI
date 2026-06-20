"use client";

import { useCallback, useEffect, useState } from "react";
import { WeightLog } from "@/types";
import { calculateWeeklyTrend, predictGoalDate } from "@/lib/calculations";

export function useWeightHistory(goalWeightKg?: number | null) {
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/weight?limit=120");
    const json = await res.json();
    if (res.ok) setLogs(json.logs ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addEntry(weight_kg: number, note?: string) {
    const res = await fetch("/api/weight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight_kg, note }),
    });
    if (res.ok) await refresh();
    return res.ok;
  }

  const weeklyTrendKg = calculateWeeklyTrend(
    logs.map((l) => ({ logged_at: l.logged_at, weight_kg: l.weight_kg }))
  );

  const currentWeight = logs.length ? logs[logs.length - 1].weight_kg : null;
  const prediction =
    goalWeightKg && currentWeight
      ? predictGoalDate(currentWeight, goalWeightKg, weeklyTrendKg)
      : null;

  return { logs, loading, addEntry, refresh, weeklyTrendKg, currentWeight, prediction };
}
