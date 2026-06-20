"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MealLog } from "@/types";

export function useDailyLog(date?: string) {
  const day = date ?? new Date().toISOString().split("T")[0];
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/meals?date=${day}`);
    const json = await res.json();
    if (res.ok) setMeals(json.meals ?? []);
    setLoading(false);
  }, [day]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const totals = useMemo(
    () =>
      meals.reduce(
        (acc, m) => ({
          calories: acc.calories + Number(m.calories),
          protein: acc.protein + Number(m.protein_g),
          carbs: acc.carbs + Number(m.carbs_g),
          fat: acc.fat + Number(m.fat_g),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [meals]
  );

  async function deleteMeal(id: string) {
    await fetch(`/api/meals?id=${id}`, { method: "DELETE" });
    setMeals((prev) => prev.filter((m) => m.id !== id));
  }

  return { meals, totals, loading, refresh, deleteMeal };
}
