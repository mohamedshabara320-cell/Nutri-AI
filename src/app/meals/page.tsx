"use client";

import { useState } from "react";
import { useDailyLog } from "@/hooks/useDailyLog";
import MealInput from "@/components/MealTracker/MealInput";
import { Trash2 } from "lucide-react";

export default function MealsPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const { meals, totals, loading, refresh, deleteMeal } = useDailyLog(date);

  return (
    <div className="space-y-5 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Meals</h1>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input w-auto"
        />
      </div>

      <div className="card flex justify-between text-sm">
        <span>Total: {Math.round(totals.calories)} kcal</span>
        <span>
          P{Math.round(totals.protein)} C{Math.round(totals.carbs)} F{Math.round(totals.fat)}
        </span>
      </div>

      <MealInput onLogged={refresh} />

      {loading ? (
        <p className="text-center text-gray-400">Loading…</p>
      ) : meals.length === 0 ? (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">No meals logged for this day.</p>
      ) : (
        <ul className="space-y-3">
          {meals.map((m) => (
            <li key={m.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{m.meal_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.round(m.calories)} kcal · P{Math.round(m.protein_g)} C{Math.round(m.carbs_g)} F
                    {Math.round(m.fat_g)}
                  </p>
                  {m.items?.length > 0 && (
                    <ul className="mt-2 space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {m.items.map((item, i) => (
                        <li key={i}>
                          • {item.quantity} {item.unit} {item.name} — {Math.round(item.calories)} kcal
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  onClick={() => deleteMeal(m.id)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
