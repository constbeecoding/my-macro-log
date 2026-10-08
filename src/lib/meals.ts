export type MealType = "breakfast" | "lunch" | "snack" | "dinner";

export interface Meal {
  id: string;
  name: string;
  portion: string;
  type: MealType;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  /** minutes since midnight, for sorting/display */
  time: string; // "HH:MM"
  date: string; // "YYYY-MM-DD"
}

export interface Goals {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const DEFAULT_GOALS: Goals = { kcal: 2150, protein: 160, carbs: 240, fat: 62 };

export const MEAL_TYPE_META: Record<MealType, { letter: string; label: string; color: "cy" | "lime" | "mag" | "amber" }> = {
  breakfast: { letter: "B", label: "Breakfast", color: "cy" },
  lunch: { letter: "L", label: "Lunch", color: "lime" },
  snack: { letter: "S", label: "Snack", color: "mag" },
  dinner: { letter: "D", label: "Dinner", color: "amber" },
};

export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const MEALS_KEY = "macrolift.meals.v1";
const GOALS_KEY = "macrolift.goals.v1";
const LEGACY_MEALS_KEY = "volta.meals.v1";
const LEGACY_GOALS_KEY = "volta.goals.v1";

export function loadMeals(): Meal[] {
  try {
    const raw = localStorage.getItem(MEALS_KEY);
    if (!raw) return seedMeals();
    const parsed = JSON.parse(raw) as Meal[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMeals(meals: Meal[]) {
  localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}

export function loadGoals(): Goals {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (!raw) return DEFAULT_GOALS;
    return { ...DEFAULT_GOALS, ...(JSON.parse(raw) as Partial<Goals>) };
  } catch {
    return DEFAULT_GOALS;
  }
}

export function saveGoals(goals: Goals) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

function seedMeals(): Meal[] {
  const today = todayKey();
  const yesterday = todayKey(new Date(Date.now() - 86400000));
  const seed: Meal[] = [
    { id: "seed-1", name: "Greek yogurt & berries", portion: "1 bowl · oats, honey", type: "breakfast", kcal: 320, protein: 28, carbs: 38, fat: 7, time: "07:40", date: today },
    { id: "seed-2", name: "Grilled chicken bowl", portion: "1 plate · quinoa, greens", type: "lunch", kcal: 540, protein: 46, carbs: 52, fat: 14, time: "12:15", date: today },
    { id: "seed-3", name: "Protein shake + banana", portion: "1 scoop · whey", type: "snack", kcal: 210, protein: 30, carbs: 24, fat: 2, time: "15:30", date: today },
    { id: "seed-4", name: "Salmon, rice & broccoli", portion: "1 fillet · olive oil", type: "dinner", kcal: 772, protein: 42, carbs: 105, fat: 29, time: "19:05", date: today },
    { id: "seed-5", name: "Eggs & sourdough toast", portion: "3 eggs · 2 slices", type: "breakfast", kcal: 480, protein: 27, carbs: 44, fat: 22, time: "08:10", date: yesterday },
    { id: "seed-6", name: "Beef burrito bowl", portion: "1 bowl · guac", type: "lunch", kcal: 690, protein: 44, carbs: 68, fat: 26, time: "13:00", date: yesterday },
    { id: "seed-7", name: "Cottage cheese & apple", portion: "1 cup · 1 apple", type: "snack", kcal: 240, protein: 25, carbs: 28, fat: 4, time: "16:20", date: yesterday },
    { id: "seed-8", name: "Pasta bolognese", portion: "1 plate · parmesan", type: "dinner", kcal: 640, protein: 36, carbs: 82, fat: 18, time: "19:40", date: yesterday },
  ];
  localStorage.setItem(MEALS_KEY, JSON.stringify(seed));
  return seed;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}
