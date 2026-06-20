export type Gender = "male" | "female";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";
export type Goal = "weight_gain" | "weight_loss" | "maintenance";

export interface Profile {
  id: string;
  full_name: string | null;
  height_cm: number;
  weight_kg: number;
  age: number;
  gender: Gender;
  activity_level: ActivityLevel;
  goal: Goal;
  goal_weight_kg: number | null;
  bmr: number | null;
  tdee: number | null;
  calorie_target: number | null;
  protein_target_g: number | null;
  carb_target_g: number | null;
  fat_target_g: number | null;
  water_target_ml: number | null;
  created_at: string;
  updated_at: string;
}

export interface MealItem {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealLog {
  id: string;
  user_id: string;
  raw_input: string | null;
  input_type: "text" | "image";
  image_url: string | null;
  meal_name: string | null;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  items: MealItem[];
  logged_at: string;
  meal_time: string;
  created_at: string;
}

export interface WeightLog {
  id: string;
  user_id: string;
  weight_kg: number;
  logged_at: string;
  note: string | null;
  created_at: string;
}

export interface DailySummary {
  user_id: string;
  logged_at: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
}

export interface MacroTargets {
  bmr: number;
  tdee: number;
  calorie_target: number;
  protein_target_g: number;
  carb_target_g: number;
  fat_target_g: number;
  water_target_ml: number;
}

export interface MealRecommendation {
  id: string;
  user_id: string;
  context: Record<string, number>;
  suggestions: {
    name: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  created_at: string;
}

export interface ProfileFormInput {
  full_name?: string;
  height_cm: number;
  weight_kg: number;
  age: number;
  gender: Gender;
  activity_level: ActivityLevel;
  goal: Goal;
  goal_weight_kg?: number;
}
