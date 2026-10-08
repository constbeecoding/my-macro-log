/** Live food lookup against the Open Food Facts database (no key needed). */
export interface LiveFood {
  id: string;
  name: string;
  portion: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

type Nutr = Record<string, number | string | undefined>;
interface Hit {
  code?: string;
  product_name?: string;
  brands?: string | string[];
  serving_size?: string;
  serving_quantity?: number | string;
  nutriments?: Nutr;
}

const num = (v: unknown) => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : NaN;
};
const r = (n: number) => Math.round(n * 10) / 10;

function toFood(h: Hit): LiveFood | null {
  const n = h.nutriments ?? {};
  const name = (h.product_name ?? "").trim();
  if (!name) return null;
  const brand = Array.isArray(h.brands) ? h.brands[0] : h.brands?.split(",")[0];
  const label = brand ? `${name} · ${brand.trim()}` : name;

  const servingKcal = num(n["energy-kcal_serving"]);
  if (Number.isFinite(servingKcal) && h.serving_size) {
    return {
      id: h.code ?? label,
      name: label.slice(0, 80),
      portion: `1 serving (${h.serving_size})`.slice(0, 80),
      kcal: Math.round(servingKcal),
      protein: r(num(n["proteins_serving"]) || 0),
      carbs: r(num(n["carbohydrates_serving"]) || 0),
      fat: r(num(n["fat_serving"]) || 0),
    };
  }
  const kcal100 = num(n["energy-kcal_100g"]);
  if (!Number.isFinite(kcal100)) return null;
  return {
    id: h.code ?? label,
    name: label.slice(0, 80),
    portion: "100 g",
    kcal: Math.round(kcal100),
    protein: r(num(n["proteins_100g"]) || 0),
    carbs: r(num(n["carbohydrates_100g"]) || 0),
    fat: r(num(n["fat_100g"]) || 0),
  };
}

export async function searchLiveFoods(q: string, signal?: AbortSignal): Promise<LiveFood[]> {
  const url = new URL("https://search.openfoodfacts.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("page_size", "15");
  url.searchParams.set(
    "fields",
    "code,product_name,brands,serving_size,serving_quantity,nutriments",
  );
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("lookup failed");
  const data = (await res.json()) as { hits?: Hit[] };
  const seen = new Set<string>();
  const out: LiveFood[] = [];
  for (const h of data.hits ?? []) {
    const f = toFood(h);
    if (!f || seen.has(f.name.toLowerCase())) continue;
    seen.add(f.name.toLowerCase());
    out.push(f);
    if (out.length >= 8) break;
  }
  return out;
}
