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

const MEALS_KEY = "macrolift.meals.v2";
const GOALS_KEY = "macrolift.goals.v1";
const LEGACY_GOALS_KEY = "volta.goals.v1";

export function loadMeals(): Meal[] {
  try {
    const raw = localStorage.getItem(MEALS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Meal[];
      return Array.isArray(parsed) ? parsed : [];
    }
    return seedMeals();
  } catch {
    return [];
  }
}

export function saveMeals(meals: Meal[]) {
  localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}

export function loadGoals(): Goals {
  try {
    const raw = localStorage.getItem(GOALS_KEY) ?? localStorage.getItem(LEGACY_GOALS_KEY);
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
  const day = (offset: number) => todayKey(new Date(Date.now() - offset * 86400000));
  const d0 = day(0);
  const d1 = day(1);
  const d2 = day(2);
  const d3 = day(3);
  const d4 = day(4);
  const seed: Meal[] = [
    // Today
    { id: "seed-1", name: "Greek yogurt & berries", portion: "1 bowl · oats, honey", type: "breakfast", kcal: 320, protein: 28, carbs: 38, fat: 7, time: "07:40", date: d0 },
    { id: "seed-2", name: "Grilled chicken bowl", portion: "1 plate · quinoa, greens", type: "lunch", kcal: 540, protein: 46, carbs: 52, fat: 14, time: "12:15", date: d0 },
    { id: "seed-3", name: "Protein shake + banana", portion: "1 scoop · whey", type: "snack", kcal: 210, protein: 30, carbs: 24, fat: 2, time: "15:30", date: d0 },
    { id: "seed-4", name: "Salmon, rice & broccoli", portion: "1 fillet · olive oil", type: "dinner", kcal: 772, protein: 42, carbs: 105, fat: 29, time: "19:05", date: d0 },
    // Yesterday
    { id: "seed-5", name: "Eggs & sourdough toast", portion: "3 eggs · 2 slices", type: "breakfast", kcal: 480, protein: 27, carbs: 44, fat: 22, time: "08:10", date: d1 },
    { id: "seed-6", name: "Beef burrito bowl", portion: "1 bowl · guac", type: "lunch", kcal: 690, protein: 44, carbs: 68, fat: 26, time: "13:00", date: d1 },
    { id: "seed-7", name: "Cottage cheese & apple", portion: "1 cup · 1 apple", type: "snack", kcal: 240, protein: 25, carbs: 28, fat: 4, time: "16:20", date: d1 },
    { id: "seed-8", name: "Pasta bolognese", portion: "1 plate · parmesan", type: "dinner", kcal: 640, protein: 36, carbs: 82, fat: 18, time: "19:40", date: d1 },
    // Two days ago
    { id: "seed-9", name: "Overnight oats", portion: "1 jar · chia, almond milk", type: "breakfast", kcal: 380, protein: 18, carbs: 52, fat: 12, time: "07:20", date: d2 },
    { id: "seed-10", name: "Tuna poke bowl", portion: "1 bowl · edamame, rice", type: "lunch", kcal: 520, protein: 38, carbs: 58, fat: 14, time: "12:45", date: d2 },
    { id: "seed-11", name: "Rice cakes & peanut butter", portion: "3 cakes · 2 tbsp PB", type: "snack", kcal: 290, protein: 10, carbs: 32, fat: 14, time: "16:00", date: d2 },
    { id: "seed-12", name: "Turkey chili", portion: "1 bowl · beans, cornbread", type: "dinner", kcal: 610, protein: 42, carbs: 62, fat: 18, time: "19:20", date: d2 },
    // Three days ago
    { id: "seed-13", name: "Protein pancakes", portion: "3 pancakes · maple syrup", type: "breakfast", kcal: 450, protein: 32, carbs: 56, fat: 10, time: "08:00", date: d3 },
    { id: "seed-14", name: "Chicken caesar wrap", portion: "1 wrap · side salad", type: "lunch", kcal: 560, protein: 40, carbs: 44, fat: 22, time: "13:10", date: d3 },
    { id: "seed-15", name: "Trail mix", portion: "1 handful · nuts, raisins", type: "snack", kcal: 260, protein: 8, carbs: 22, fat: 16, time: "15:45", date: d3 },
    { id: "seed-16", name: "Shrimp stir-fry", portion: "1 wok · jasmine rice", type: "dinner", kcal: 580, protein: 38, carbs: 66, fat: 16, time: "19:30", date: d3 },
    // Four days ago
    { id: "seed-17", name: "Avocado toast & eggs", portion: "2 slices · 2 poached eggs", type: "breakfast", kcal: 420, protein: 20, carbs: 36, fat: 24, time: "07:50", date: d4 },
    { id: "seed-18", name: "Lentil soup & roll", portion: "1 bowl · whole grain roll", type: "lunch", kcal: 430, protein: 22, carbs: 62, fat: 8, time: "12:30", date: d4 },
    { id: "seed-19", name: "Skyr & granola", portion: "1 cup · honey drizzle", type: "snack", kcal: 250, protein: 20, carbs: 30, fat: 5, time: "16:10", date: d4 },
    { id: "seed-20", name: "Steak, potatoes & asparagus", portion: "200g steak · roasted", type: "dinner", kcal: 720, protein: 48, carbs: 54, fat: 32, time: "19:15", date: d4 },
  ];
  localStorage.setItem(MEALS_KEY, JSON.stringify(seed));
  return seed;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}
