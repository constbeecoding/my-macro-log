import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  DEFAULT_GOALS,
  MEAL_TYPE_META,
  formatNumber,
  loadGoals,
  loadMeals,
  saveGoals,
  saveMeals,
  todayKey,
  type Goals,
  type Meal,
  type MealType,
} from "@/lib/meals";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Volta — Daily Macro Tracker" },
      {
        name: "description",
        content:
          "Track your everyday meals and macros. Log food, watch calories, protein, carbs and fat add up against your daily goals.",
      },
      { property: "og:title", content: "Volta — Daily Macro Tracker" },
      {
        property: "og:description",
        content: "Log meals and track calories, protein, carbs and fat against your daily goals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const MACRO_COLORS = {
  cy: { text: "text-cy", bar: "bg-cy", chip: "bg-cy/10 ring-cy/25 text-cy" },
  lime: { text: "text-lime", bar: "bg-lime", chip: "bg-lime/10 ring-lime/25 text-lime" },
  mag: { text: "text-mag", bar: "bg-mag", chip: "bg-mag/10 ring-mag/25 text-mag" },
  amber: { text: "text-amber", bar: "bg-amber", chip: "bg-amber/10 ring-amber/25 text-amber" },
} as const;

function Index() {
  const [meals, setMeals] = useState<Meal[]>(() => loadMeals());
  const [goals, setGoals] = useState<Goals>(() => loadGoals());
  const [showForm, setShowForm] = useState(false);
  const [editingGoals, setEditingGoals] = useState(false);

  const today = todayKey();
  const todayMeals = useMemo(
    () =>
      meals
        .filter((m) => m.date === today)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [meals, today],
  );

  const totals = useMemo(
    () =>
      todayMeals.reduce(
        (acc, m) => ({
          kcal: acc.kcal + m.kcal,
          protein: acc.protein + m.protein,
          carbs: acc.carbs + m.carbs,
          fat: acc.fat + m.fat,
        }),
        { kcal: 0, protein: 0, carbs: 0, fat: 0 },
      ),
    [todayMeals],
  );

  const week = useMemo(() => {
    const days: { label: string; date: string; kcal: number; isToday: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = todayKey(d);
      const kcal = meals
        .filter((m) => m.date === key)
        .reduce((s, m) => s + m.kcal, 0);
      days.push({
        label: "SMTWTFS"[d.getDay()],
        date: key,
        kcal,
        isToday: key === today,
      });
    }
    return days;
  }, [meals, today]);

  const weekAvg = Math.round(week.reduce((s, d) => s + d.kcal, 0) / 7);
  const weekMax = Math.max(...week.map((d) => d.kcal), goals.kcal, 1);

  function addMeal(meal: Omit<Meal, "id" | "date">) {
    const next = [
      ...meals,
      { ...meal, id: crypto.randomUUID(), date: todayKey() },
    ];
    setMeals(next);
    saveMeals(next);
    setShowForm(false);
  }

  function removeMeal(id: string) {
    const next = meals.filter((m) => m.id !== id);
    setMeals(next);
    saveMeals(next);
  }

  function updateGoals(next: Goals) {
    setGoals(next);
    saveGoals(next);
    setEditingGoals(false);
  }

  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const macros = [
    { label: "Calories", value: totals.kcal, goal: goals.kcal, unit: "", color: "cy" as const },
    { label: "Protein", value: totals.protein, goal: goals.protein, unit: "g", color: "lime" as const },
    { label: "Carbs", value: totals.carbs, goal: goals.carbs, unit: "g", color: "mag" as const },
    { label: "Fat", value: totals.fat, goal: goals.fat, unit: "g", color: "amber" as const },
  ];

  return (
    <div className="min-h-screen bg-ink font-display text-foreground">
      {/* top bar */}
      <header className="sticky top-0 z-20 border-b border-line bg-ink/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="size-2.5 animate-pulse-dot rounded-full bg-cy shadow-[0_0_12px_var(--cy)]" />
            <span className="text-[15px] font-medium uppercase tracking-[0.2em] text-foreground">
              Volta
            </span>
            <span className="hidden font-mono text-[11px] tracking-wider text-dim sm:inline">
              MACRO OS · v1.0
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditingGoals(true)}
              className="hidden h-9 items-center gap-2 rounded-md bg-panel px-3 ring-1 ring-line transition-colors hover:ring-cy/50 md:flex"
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-dim">
                Goal
              </span>
              <span className="font-mono text-[13px] text-foreground">
                {formatNumber(goals.kcal)}
              </span>
              <span className="font-mono text-[11px] text-dim">kcal</span>
            </button>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="h-9 rounded-md bg-cy px-4 text-[13px] font-medium text-ink ring-1 ring-cy transition-colors hover:bg-cy/90"
            >
              + Add meal
            </button>
          </div>
        </div>
      </header>

      {/* hero / today */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          className="absolute inset-0 animate-grid-drift opacity-[0.55]"
          style={{
            backgroundImage:
              "linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-cy/10 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 size-80 rounded-full bg-mag/10 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-cy">
                {dateLabel}
              </p>
              <h1 className="max-w-[12ch] text-balance text-4xl font-semibold leading-tight text-foreground lg:text-5xl">
                Today's intake
              </h1>
            </div>
            <div className="font-mono text-[13px] text-ash">
              <span className="text-lg text-foreground">{formatNumber(totals.kcal)}</span>{" "}
              / {formatNumber(goals.kcal)} kcal
              <span className="ml-2 text-cy">
                · {formatNumber(Math.max(goals.kcal - totals.kcal, 0))} left
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {macros.map((m, i) => {
              const pct = m.goal > 0 ? Math.min(Math.round((m.value / m.goal) * 100), 100) : 0;
              const c = MACRO_COLORS[m.color];
              return (
                <div
                  key={m.label}
                  className="animate-rise rounded-[min(1vw,14px)] bg-panel p-4 ring-1 ring-line lg:p-5"
                  style={{ animationDelay: `${0.05 + i * 0.07}s` }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ash">
                      {m.label}
                    </span>
                    <span className={`font-mono text-[11px] ${c.text}`}>{pct}%</span>
                  </div>
                  <div className="mb-4 flex items-end gap-1">
                    <span className="text-3xl font-medium tabular-nums text-foreground">
                      {formatNumber(m.value)}
                    </span>
                    <span className="pb-1 font-mono text-[12px] text-dim">
                      /{formatNumber(m.goal)}
                      {m.unit}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-grid">
                    <div
                      className={`h-full rounded-full ${c.bar} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* main */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 py-10 lg:grid-cols-12 lg:px-8 lg:py-12">
        {/* meal log */}
        <div className="lg:col-span-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-balance text-xl font-semibold text-foreground">Meal log</h2>
            <span className="font-mono text-[12px] uppercase tracking-wider text-dim">
              {todayMeals.length} {todayMeals.length === 1 ? "entry" : "entries"}
            </span>
          </div>
          <div className="space-y-2.5">
            {todayMeals.length === 0 && (
              <div className="rounded-[min(1vw,12px)] bg-panel p-8 text-center ring-1 ring-line">
                <p className="font-mono text-[13px] text-dim">
                  No meals logged yet — hit “+ Add meal” to start your day.
                </p>
              </div>
            )}
            {todayMeals.map((m, i) => {
              const meta = MEAL_TYPE_META[m.type];
              const c = MACRO_COLORS[meta.color];
              return (
                <div
                  key={m.id}
                  className="group animate-rise flex items-center gap-4 rounded-[min(1vw,12px)] bg-panel p-4 ring-1 ring-line"
                  style={{ animationDelay: `${0.3 + i * 0.06}s` }}
                >
                  <span className="w-12 shrink-0 font-mono text-[12px] text-dim">{m.time}</span>
                  <div
                    className={`grid size-9 shrink-0 place-items-center rounded-md font-mono text-[11px] ring-1 ${c.chip}`}
                  >
                    {meta.letter}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium text-foreground">{m.name}</p>
                    <p className="truncate font-mono text-[11px] text-dim">{m.portion}</p>
                  </div>
                  <div className="hidden items-center gap-3 font-mono text-[12px] sm:flex">
                    <span className="text-cy">{m.kcal}</span>
                    <span className="text-lime">{m.protein}g</span>
                    <span className="text-mag">{m.carbs}g</span>
                    <span className="text-amber">{m.fat}g</span>
                  </div>
                  <button
                    onClick={() => removeMeal(m.id)}
                    aria-label={`Delete ${m.name}`}
                    className="font-mono text-[13px] text-dim opacity-0 transition-opacity hover:text-mag group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* sidebar */}
        <aside className="lg:col-span-4">
          {showForm ? (
            <AddMealForm onSubmit={addMeal} onCancel={() => setShowForm(false)} />
          ) : (
            <div className="animate-rise rounded-[min(1vw,14px)] bg-panel p-5 ring-1 ring-line">
              <div className="mb-1 flex items-center gap-2">
                <span className="size-2 rounded-full bg-cy" />
                <h2 className="text-[15px] font-semibold text-foreground">Add a meal</h2>
              </div>
              <p className="mb-5 font-mono text-[11px] uppercase tracking-wider text-dim">
                Log it in one entry
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="h-11 w-full rounded-md bg-cy text-[14px] font-medium text-ink ring-1 ring-cy transition-colors hover:bg-cy/90"
              >
                Log meal
              </button>
            </div>
          )}

          {/* weekly overview */}
          <div className="mt-4 animate-rise rounded-[min(1vw,14px)] bg-panel p-5 ring-1 ring-line" style={{ animationDelay: "0.4s" }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-foreground">This week</h2>
              <span className="font-mono text-[11px] text-dim">
                avg {formatNumber(weekAvg)}
              </span>
            </div>
            <div className="flex h-16 items-end gap-1.5">
              {week.map((d) => (
                <div
                  key={d.date}
                  title={`${d.date}: ${formatNumber(d.kcal)} kcal`}
                  className={`flex-1 rounded-sm transition-all duration-500 ${d.isToday ? "bg-cy" : "bg-grid"}`}
                  style={{ height: `${Math.max((d.kcal / weekMax) * 100, 4)}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex gap-1.5">
              {week.map((d) => (
                <span
                  key={d.date}
                  className={`flex-1 text-center font-mono text-[10px] ${d.isToday ? "text-cy" : "text-dim"}`}
                >
                  {d.label}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {editingGoals && (
        <GoalsDialog goals={goals} onSave={updateGoals} onClose={() => setEditingGoals(false)} />
      )}
    </div>
  );
}

function AddMealForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (meal: Omit<Meal, "id" | "date">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [portion, setPortion] = useState("");
  const [type, setType] = useState<MealType>("lunch");
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [error, setError] = useState("");

  const inputCls =
    "h-10 w-full rounded-md bg-ink px-3 text-[14px] text-foreground ring-1 ring-line placeholder:text-dim focus:outline-none focus:ring-cy/60";
  const labelCls = "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em]";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError("Give the meal a name.");
    if (trimmed.length > 80) return setError("Name must be under 80 characters.");
    const nums = { kcal: +kcal || 0, protein: +protein || 0, carbs: +carbs || 0, fat: +fat || 0 };
    if (Object.values(nums).some((n) => n < 0 || n > 5000 || !Number.isFinite(n)))
      return setError("Macros must be numbers between 0 and 5000.");
    if (nums.kcal === 0 && nums.protein === 0 && nums.carbs === 0 && nums.fat === 0)
      return setError("Add at least one macro value.");
    const now = new Date();
    onSubmit({
      name: trimmed,
      portion: portion.trim().slice(0, 80) || "1 serving",
      type,
      ...nums,
      time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
    });
  }

  return (
    <form
      onSubmit={submit}
      className="animate-rise rounded-[min(1vw,14px)] bg-panel p-5 ring-1 ring-line"
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="size-2 rounded-full bg-cy" />
        <h2 className="text-[15px] font-semibold text-foreground">Add a meal</h2>
      </div>
      <p className="mb-5 font-mono text-[11px] uppercase tracking-wider text-dim">
        Log it in one entry
      </p>

      <label className="mb-4 block">
        <span className={`${labelCls} text-ash`}>Food name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Chicken stir fry"
          maxLength={80}
          className={inputCls}
        />
      </label>

      <label className="mb-4 block">
        <span className={`${labelCls} text-ash`}>Portion</span>
        <input
          type="text"
          value={portion}
          onChange={(e) => setPortion(e.target.value)}
          placeholder="1 plate"
          maxLength={80}
          className={inputCls}
        />
      </label>

      <label className="mb-4 block">
        <span className={`${labelCls} text-ash`}>Meal type</span>
        <div className="grid grid-cols-4 gap-1.5">
          {(Object.keys(MEAL_TYPE_META) as MealType[]).map((t) => {
            const meta = MEAL_TYPE_META[t];
            const c = MACRO_COLORS[meta.color];
            const active = type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`h-9 rounded-md font-mono text-[11px] uppercase ring-1 transition-colors ${
                  active ? `${c.chip}` : "bg-ink text-dim ring-line hover:text-ash"
                }`}
              >
                {meta.letter}
              </button>
            );
          })}
        </div>
      </label>

      <div className="mb-5 grid grid-cols-3 gap-2">
        <label className="block">
          <span className={`${labelCls} text-cy`}>kcal</span>
          <input type="number" min={0} max={5000} value={kcal} onChange={(e) => setKcal(e.target.value)} placeholder="0" className={`${inputCls} px-2 font-mono`} />
        </label>
        <label className="block">
          <span className={`${labelCls} text-lime`}>P</span>
          <input type="number" min={0} max={5000} value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="0" className={`${inputCls} px-2 font-mono`} />
        </label>
        <label className="block">
          <span className={`${labelCls} text-amber`}>F</span>
          <input type="number" min={0} max={5000} value={fat} onChange={(e) => setFat(e.target.value)} placeholder="0" className={`${inputCls} px-2 font-mono`} />
        </label>
      </div>

      <label className="mb-5 block">
        <span className={`${labelCls} text-mag`}>Carbs (g)</span>
        <input type="number" min={0} max={5000} value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="0" className={`${inputCls} font-mono`} />
      </label>

      {error && <p className="mb-4 font-mono text-[12px] text-mag">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          className="h-11 flex-1 rounded-md bg-cy text-[14px] font-medium text-ink ring-1 ring-cy transition-colors hover:bg-cy/90"
        >
          Log meal
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-md bg-ink px-4 font-mono text-[12px] text-ash ring-1 ring-line transition-colors hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function GoalsDialog({
  goals,
  onSave,
  onClose,
}: {
  goals: Goals;
  onSave: (g: Goals) => void;
  onClose: () => void;
}) {
  const [kcal, setKcal] = useState(String(goals.kcal));
  const [protein, setProtein] = useState(String(goals.protein));
  const [carbs, setCarbs] = useState(String(goals.carbs));
  const [fat, setFat] = useState(String(goals.fat));

  const inputCls =
    "h-10 w-full rounded-md bg-ink px-3 font-mono text-[14px] text-foreground ring-1 ring-line placeholder:text-dim focus:outline-none focus:ring-cy/60";
  const labelCls = "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em]";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Goals = {
      kcal: Math.max(0, Math.round(+kcal || DEFAULT_GOALS.kcal)),
      protein: Math.max(0, Math.round(+protein || DEFAULT_GOALS.protein)),
      carbs: Math.max(0, Math.round(+carbs || DEFAULT_GOALS.carbs)),
      fat: Math.max(0, Math.round(+fat || DEFAULT_GOALS.fat)),
    };
    onSave(next);
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm animate-rise rounded-[min(1vw,14px)] bg-panel p-6 ring-1 ring-line"
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="size-2 rounded-full bg-cy" />
          <h2 className="text-[15px] font-semibold text-foreground">Daily goals</h2>
        </div>
        <p className="mb-5 font-mono text-[11px] uppercase tracking-wider text-dim">
          Set your targets
        </p>
        <div className="mb-5 grid grid-cols-2 gap-3">
          <label className="block">
            <span className={`${labelCls} text-cy`}>Calories</span>
            <input type="number" min={0} value={kcal} onChange={(e) => setKcal(e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className={`${labelCls} text-lime`}>Protein (g)</span>
            <input type="number" min={0} value={protein} onChange={(e) => setProtein(e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className={`${labelCls} text-mag`}>Carbs (g)</span>
            <input type="number" min={0} value={carbs} onChange={(e) => setCarbs(e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className={`${labelCls} text-amber`}>Fat (g)</span>
            <input type="number" min={0} value={fat} onChange={(e) => setFat(e.target.value)} className={inputCls} />
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="h-11 flex-1 rounded-md bg-cy text-[14px] font-medium text-ink ring-1 ring-cy transition-colors hover:bg-cy/90"
          >
            Save goals
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-md bg-ink px-4 font-mono text-[12px] text-ash ring-1 ring-line transition-colors hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
