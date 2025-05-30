export interface UserProfile {
  id: string;
  name: string;
  email: string;
  settings?: {
    darkMode?: boolean;
    notifications?: boolean;
    units?: 'metric' | 'imperial';
  };
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id?: string;
  type: MealType;
  date: string;
  items: FoodItem[];
  totals: NutritionTotals;
  image?: string | null;
}

export interface AnalyzedMeal {
  items: FoodItem[];
  totals: NutritionTotals;
}

export interface DailyData {
  date: string;
  totalCalories: number;
  calorieGoal: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  macroGoals: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: Meal[];
}

export interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  units: 'metric' | 'imperial';
}

export interface CalorieData {
  day: string;
  calories: number;
  goal?: number;
}