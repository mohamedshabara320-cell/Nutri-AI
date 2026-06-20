"use client";

import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import { useDailyLog } from "@/hooks/useDailyLog";
import CalorieSummary from "@/components/Dashboard/CalorieSummary";
import MacroProgress from "@/components/Dashboard/MacroProgress";
import ThemeToggle from "@/components/ThemeToggle";
import MealInput from "@/components/MealTracker/MealInput";
import { Droplet } from "lucide-react";

export default function DashboardPage() {
  const { profile, loading: profileLoading } = useProfile();
  const { meals, totals, loading: mealsLoading, refresh } = useDailyLog();

  if (profileLoading || mealsLoading) {
    return <div className="flex h-screen items-center justify-center text-gray-400">Loading…</div>;
  }

  if (!profile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <p>Let's finish setting up your profile first.</p>
        <Link href="/onboarding" className="btn-primary">
          Go to onboarding
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
          </p>
          <h1 className="text-xl font-bold">Hi {profile.full_name || "there"} 👋</h1>
        </div>
        <ThemeToggle />
      </div>

      <CalorieSummary consumed={totals.calories} target={profile.calorie_target ?? 0} />

      <MacroProgress
        protein={totals.protein}
        carbs={totals.carbs}
        fat={totals.fat}
        proteinTarget={profile.protein_target_g ?? 0}
        carbTarget={profile.carb_target_g ?? 0}
        fatTarget={profile.fat_target_g ?? 0}
      />

      <div className="card flex items-center gap-3">
        <Droplet className="text-blue-500" size={20} />
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Water target</p>
          <p className="font-semibold">{((profile.water_target_ml ?? 0) / 1000).toFixed(1)} L / day</p>
        </div>
      </div>

      <MealInput onLogged={refresh} />

      <div>
        <h2 className="mb-2 font-semibold">Today's meals</h2>
        {meals.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No meals logged yet today.</p>
        ) : (
          <ul className="space-y-2">
            {meals.map((m) => (
              <li key={m.id} className="card flex items-center justify-between">
                <div>
                  <p className="font-medium">{m.meal_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.round(m.calories)} kcal · P{Math.round(m.protein_g)} C{Math.round(m.carbs_g)} F{Math.round(m.fat_g)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
