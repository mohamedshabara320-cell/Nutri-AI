"use client";

import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import { useDailyLog } from "@/hooks/useDailyLog";

import ThemeToggle from "@/components/ThemeToggle";
import MealInput from "@/components/MealTracker/MealInput";

import AIInsightCard from "@/components/Dashboard/AIInsightCard";
import AIWeeklyInsight from "@/components/Dashboard/AIWeeklyInsight";
import ProgressRing from "@/components/Dashboard/ProgressRing";
import CalorieChart from "@/components/Dashboard/CalorieChart";
import StreakCard from "@/components/Dashboard/StreakCard";

import { Droplet, Sparkles, MessageCircle } from "lucide-react";

export default function DashboardPage() {
  const { profile, loading: profileLoading } = useProfile();
  const { meals, totals, loading: mealsLoading, refresh } =
    useDailyLog();

  if (profileLoading || mealsLoading) {
    return (
      <div className="space-y-3 px-4 py-6">
        <div className="card animate-pulse h-16" />
        <div className="card animate-pulse h-24" />
        <div className="card animate-pulse h-24" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Link href="/onboarding" className="btn-primary">
          Complete Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>

          <h1 className="text-2xl font-bold">
            Hi {profile.full_name || "User"} 👋
          </h1>

          <p className="text-sm text-gray-400">
            Your AI nutrition system is active
          </p>
        </div>

        <ThemeToggle />
      </div>

      {/* AI INSIGHT */}
      <AIInsightCard />

      {/* WEEKLY AI INSIGHT */}
      <AIWeeklyInsight caloriesTrend="stable" />

      {/* STREAK */}
      <StreakCard streak={5} />

      {/* CALORIES */}
      <div className="card">
        <p className="text-sm text-gray-400">Calories</p>
        <p className="text-xl font-bold">
          {Math.round(totals.calories)} / {profile.calorie_target}
        </p>
      </div>

      {/* MACROS */}
      <div className="card grid grid-cols-3 gap-4">
        <ProgressRing
          value={totals.protein}
          max={profile.protein_target_g}
          label="Protein"
        />
        <ProgressRing
          value={totals.carbs}
          max={profile.carb_target_g}
          label="Carbs"
        />
        <ProgressRing
          value={totals.fat}
          max={profile.fat_target_g}
          label="Fat"
        />
      </div>

      {/* CHART */}
      <CalorieChart
        data={[
          { day: "Mon", calories: 2100 },
          { day: "Tue", calories: 1900 },
          { day: "Wed", calories: 2200 },
          { day: "Thu", calories: 2000 },
          { day: "Fri", calories: 1800 },
          { day: "Sat", calories: 2300 },
          { day: "Sun", calories: 2000 },
        ]}
      />

      {/* WATER */}
      <div className="card flex items-center gap-3">
        <Droplet className="text-blue-500" />
        <div>
          <p className="text-sm text-gray-400">Water intake</p>
          <p className="font-semibold">
            {((profile.water_target_ml ?? 0) / 1000).toFixed(1)} L / day
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 gap-3">

        <MealInput onLogged={refresh} />

        <Link href="/chat" className="card text-center">
          <MessageCircle className="mx-auto mb-1" />
          <p className="text-sm font-semibold">AI Coach</p>
          <p className="text-xs text-gray-400">Chat with AI</p>
        </Link>

        <Link href="/recommendations" className="card text-center">
          <Sparkles className="mx-auto mb-1" />
          <p className="text-sm font-semibold">Meal Plan</p>
          <p className="text-xs text-gray-400">AI suggestions</p>
        </Link>

      </div>

      {/* TODAY MEALS */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">Today’s meals</h2>

          <Link href="/meals" className="text-sm text-green-500">
            View all
          </Link>
        </div>

        {meals.length === 0 ? (
          <div className="card text-center">
            <p className="font-semibold">No meals yet</p>
            <p className="text-sm text-gray-400">
              Start tracking to unlock AI insights
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {meals.slice(0, 3).map((m) => (
              <div key={m.id} className="card">
                <p className="font-medium">{m.meal_name}</p>
                <p className="text-xs text-gray-400">
                  {Math.round(m.calories)} kcal · P
                  {Math.round(m.protein_g)} C
                  {Math.round(m.carbs_g)} F
                  {Math.round(m.fat_g)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}