import { ActivityLevel, Gender, Goal, MacroTargets } from "@/types";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

/** Mifflin-St Jeor equation */
export function calculateBMR(params: {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: Gender;
}): number {
  const { weightKg, heightCm, age, gender } = params;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel];
}

/** Calorie target based on goal. Lean bulk = +10-15% surplus. */
export function calculateCalorieTarget(tdee: number, goal: Goal): number {
  switch (goal) {
    case "weight_gain":
      return Math.round(tdee * 1.12); // ~12% lean bulk surplus
    case "weight_loss":
      return Math.round(tdee * 0.8); // ~20% deficit
    default:
      return Math.round(tdee);
  }
}

/**
 * Macro split tuned per goal.
 * Lean bulk: higher protein + carbs to fuel training, moderate fat.
 */
export function calculateMacroTargets(params: {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
}): MacroTargets {
  const { weightKg, heightCm, age, gender, activityLevel, goal } = params;

  const bmr = calculateBMR({ weightKg, heightCm, age, gender });
  const tdee = calculateTDEE(bmr, activityLevel);
  const calorie_target = calculateCalorieTarget(tdee, goal);

  // Protein: g per kg bodyweight depending on goal
  const proteinPerKg = goal === "weight_gain" ? 2.0 : goal === "weight_loss" ? 2.2 : 1.8;
  const protein_target_g = Math.round(weightKg * proteinPerKg);
  const proteinCalories = protein_target_g * 4;

  // Fat: 25% of total calories
  const fatCalories = calorie_target * 0.25;
  const fat_target_g = Math.round(fatCalories / 9);

  // Remainder goes to carbs
  const remainingCalories = calorie_target - proteinCalories - fatCalories;
  const carb_target_g = Math.max(0, Math.round(remainingCalories / 4));

  // Water: 35ml per kg bodyweight, +500ml if very active
  const water_target_ml = Math.round(
    weightKg * 35 + (activityLevel === "active" || activityLevel === "very_active" ? 500 : 0)
  );

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorie_target,
    protein_target_g,
    carb_target_g,
    fat_target_g,
    water_target_ml,
  };
}

/** Predict date a goal weight will be reached from recent trend (kg/week). */
export function predictGoalDate(
  currentWeightKg: number,
  goalWeightKg: number,
  weeklyRateKg: number
): { weeksRemaining: number; estimatedDate: string } | null {
  if (weeklyRateKg === 0) return null;
  const diff = goalWeightKg - currentWeightKg;
  // Rate must move in same direction as required diff
  if (Math.sign(diff) !== Math.sign(weeklyRateKg)) return null;

  const weeksRemaining = Math.abs(diff / weeklyRateKg);
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + weeksRemaining * 7);

  return {
    weeksRemaining: Math.round(weeksRemaining * 10) / 10,
    estimatedDate: estimatedDate.toISOString().split("T")[0],
  };
}

/** Simple linear regression slope (kg/week) from {date, weight} points */
export function calculateWeeklyTrend(
  points: { logged_at: string; weight_kg: number }[]
): number {
  if (points.length < 2) return 0;
  const sorted = [...points].sort(
    (a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime()
  );
  const t0 = new Date(sorted[0].logged_at).getTime();
  const xs = sorted.map((p) => (new Date(p.logged_at).getTime() - t0) / (1000 * 60 * 60 * 24 * 7));
  const ys = sorted.map((p) => p.weight_kg);

  const n = xs.length;
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((acc, x, i) => acc + x * ys[i], 0);
  const sumXX = xs.reduce((acc, x) => acc + x * x, 0);

  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return 0;
  return (n * sumXY - sumX * sumY) / denom; // slope = kg per week
}
