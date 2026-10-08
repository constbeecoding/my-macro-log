import type { MealType } from "./meals";

export interface CommonFood {
  name: string;
  portion: string;
  type: MealType;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
}

/** Built-in library of common meals with typical macro values per serving. */
export const COMMON_FOODS: CommonFood[] = [
  // Breakfast
  { name: "Scrambled eggs & toast", portion: "2 eggs · 2 slices", type: "breakfast", kcal: 380, protein: 22, carbs: 34, fat: 17, tags: ["eggs", "bread", "classic"] },
  { name: "Oatmeal with banana", portion: "1 bowl · 1 banana", type: "breakfast", kcal: 320, protein: 10, carbs: 58, fat: 6, tags: ["oats", "porridge", "fruit"] },
  { name: "Greek yogurt & berries", portion: "1 bowl · granola", type: "breakfast", kcal: 300, protein: 24, carbs: 36, fat: 6, tags: ["yogurt", "berries", "granola"] },
  { name: "Avocado toast", portion: "2 slices · 1 avocado", type: "breakfast", kcal: 420, protein: 12, carbs: 44, fat: 24, tags: ["avocado", "bread", "toast"] },
  { name: "Pancakes with maple syrup", portion: "3 pancakes", type: "breakfast", kcal: 520, protein: 12, carbs: 88, fat: 14, tags: ["pancakes", "sweet", "syrup"] },
  { name: "Breakfast burrito", portion: "1 burrito · egg, cheese", type: "breakfast", kcal: 560, protein: 28, carbs: 52, fat: 26, tags: ["burrito", "eggs", "wrap"] },
  { name: "Smoothie bowl", portion: "1 bowl · acai, fruit", type: "breakfast", kcal: 340, protein: 9, carbs: 62, fat: 8, tags: ["smoothie", "acai", "fruit"] },
  { name: "Bacon, egg & cheese sandwich", portion: "1 sandwich", type: "breakfast", kcal: 480, protein: 24, carbs: 36, fat: 26, tags: ["bacon", "sandwich", "eggs"] },
  { name: "Protein shake", portion: "1 scoop · milk", type: "breakfast", kcal: 220, protein: 30, carbs: 12, fat: 4, tags: ["shake", "whey", "protein"] },

  // Lunch
  { name: "Grilled chicken salad", portion: "1 bowl · mixed greens", type: "lunch", kcal: 380, protein: 38, carbs: 18, fat: 16, tags: ["chicken", "salad", "light"] },
  { name: "Chicken burrito bowl", portion: "1 bowl · rice, beans", type: "lunch", kcal: 650, protein: 42, carbs: 72, fat: 20, tags: ["burrito", "chipotle", "rice"] },
  { name: "Turkey & cheese sandwich", portion: "1 sandwich · whole grain", type: "lunch", kcal: 450, protein: 30, carbs: 48, fat: 14, tags: ["sandwich", "turkey", "deli"] },
  { name: "Caesar salad with chicken", portion: "1 bowl · dressing", type: "lunch", kcal: 480, protein: 34, carbs: 22, fat: 28, tags: ["caesar", "salad", "chicken"] },
  { name: "Tuna poke bowl", portion: "1 bowl · rice, edamame", type: "lunch", kcal: 520, protein: 36, carbs: 58, fat: 14, tags: ["poke", "tuna", "sushi"] },
  { name: "Veggie wrap", portion: "1 wrap · hummus", type: "lunch", kcal: 380, protein: 14, carbs: 52, fat: 14, tags: ["wrap", "veggie", "hummus"] },
  { name: "Pho (beef noodle soup)", portion: "1 large bowl", type: "lunch", kcal: 450, protein: 30, carbs: 60, fat: 10, tags: ["pho", "soup", "noodles", "vietnamese"] },
  { name: "Sushi roll set", portion: "8 pieces · salmon", type: "lunch", kcal: 400, protein: 22, carbs: 58, fat: 8, tags: ["sushi", "salmon", "japanese"] },
  { name: "Quinoa Buddha bowl", portion: "1 bowl · roasted veg", type: "lunch", kcal: 460, protein: 18, carbs: 62, fat: 16, tags: ["quinoa", "buddha", "vegan"] },

  // Dinner
  { name: "Salmon, rice & broccoli", portion: "1 fillet · 1 cup rice", type: "dinner", kcal: 620, protein: 40, carbs: 62, fat: 22, tags: ["salmon", "fish", "rice"] },
  { name: "Spaghetti bolognese", portion: "1 plate · parmesan", type: "dinner", kcal: 640, protein: 34, carbs: 82, fat: 18, tags: ["pasta", "bolognese", "italian"] },
  { name: "Grilled steak & potatoes", portion: "200g steak · 1 potato", type: "dinner", kcal: 680, protein: 48, carbs: 44, fat: 32, tags: ["steak", "beef", "potatoes"] },
  { name: "Chicken stir fry", portion: "1 plate · rice", type: "dinner", kcal: 560, protein: 38, carbs: 58, fat: 16, tags: ["stir fry", "chicken", "asian"] },
  { name: "Margherita pizza", portion: "3 slices", type: "dinner", kcal: 660, protein: 26, carbs: 84, fat: 24, tags: ["pizza", "italian", "cheese"] },
  { name: "Tacos (3) with beef", portion: "3 tacos · salsa", type: "dinner", kcal: 580, protein: 32, carbs: 54, fat: 26, tags: ["tacos", "mexican", "beef"] },
  { name: "Chicken curry & rice", portion: "1 plate · basmati", type: "dinner", kcal: 640, protein: 36, carbs: 70, fat: 22, tags: ["curry", "indian", "rice"] },
  { name: "Baked cod & vegetables", portion: "1 fillet · roasted veg", type: "dinner", kcal: 380, protein: 36, carbs: 28, fat: 12, tags: ["cod", "fish", "light"] },
  { name: "Ramen bowl", portion: "1 bowl · pork, egg", type: "dinner", kcal: 620, protein: 30, carbs: 72, fat: 22, tags: ["ramen", "noodles", "japanese"] },
  { name: "Cheeseburger & fries", portion: "1 burger · medium fries", type: "dinner", kcal: 860, protein: 38, carbs: 82, fat: 42, tags: ["burger", "fries", "fast food"] },

  // Snacks
  { name: "Protein bar", portion: "1 bar", type: "snack", kcal: 210, protein: 20, carbs: 22, fat: 7, tags: ["bar", "protein"] },
  { name: "Apple & peanut butter", portion: "1 apple · 2 tbsp", type: "snack", kcal: 280, protein: 8, carbs: 32, fat: 16, tags: ["apple", "peanut butter", "fruit"] },
  { name: "Mixed nuts", portion: "1 handful · 30g", type: "snack", kcal: 180, protein: 6, carbs: 6, fat: 16, tags: ["nuts", "almonds"] },
  { name: "Cottage cheese & fruit", portion: "1 cup · pineapple", type: "snack", kcal: 220, protein: 24, carbs: 26, fat: 3, tags: ["cottage cheese", "fruit"] },
  { name: "Hummus & pita", portion: "1/4 cup · 1 pita", type: "snack", kcal: 300, protein: 10, carbs: 44, fat: 10, tags: ["hummus", "pita"] },
  { name: "Greek yogurt cup", portion: "1 cup · plain", type: "snack", kcal: 130, protein: 17, carbs: 8, fat: 4, tags: ["yogurt", "greek"] },
  { name: "Rice cakes & avocado", portion: "2 cakes · 1/2 avocado", type: "snack", kcal: 190, protein: 4, carbs: 22, fat: 10, tags: ["rice cakes", "avocado"] },
  { name: "Chocolate milk", portion: "1 glass · 300ml", type: "snack", kcal: 210, protein: 9, carbs: 30, fat: 6, tags: ["milk", "chocolate", "drink"] },
  { name: "Banana", portion: "1 medium", type: "snack", kcal: 105, protein: 1, carbs: 27, fat: 0, tags: ["banana", "fruit"] },
  { name: "Trail mix", portion: "1/4 cup", type: "snack", kcal: 200, protein: 6, carbs: 18, fat: 12, tags: ["trail mix", "nuts", "dried fruit"] },
];

export function searchFoods(query: string, limit = 6): CommonFood[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored = COMMON_FOODS.map((f) => {
    const name = f.name.toLowerCase();
    let score = -1;
    if (name.startsWith(q)) score = 3;
    else if (name.includes(q)) score = 2;
    else if (f.tags.some((t) => t.includes(q))) score = 1;
    return { f, score };
  }).filter((s) => s.score > 0);
  scored.sort((a, b) => b.score - a.score || a.f.name.localeCompare(b.f.name));
  return scored.slice(0, limit).map((s) => s.f);
}
