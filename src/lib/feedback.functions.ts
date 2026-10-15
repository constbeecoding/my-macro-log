import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const feedbackSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  category: z.enum(["bug", "improvement", "other"]),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export const submitFeedback = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => feedbackSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabasePublic = createClient<Database>(
      process.env["SUPABASE_URL"]!,
      key,
      {
        auth: { persistSession: false },
        global: {
          fetch: (input, init) => {
            const h = new Headers(init?.headers);
            if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
              h.delete("Authorization");
            h.set("apikey", key);
            return fetch(input, { ...init, headers: h });
          },
        },
      },
    );

    const { error } = await supabasePublic.from("feedback").insert({
      name: data.name,
      email: data.email,
      category: data.category,
      message: data.message,
    });
    if (error) {
      console.error("Feedback insert failed:", error.message);
      throw new Error("Could not send your message. Please try again.");
    }
    return { ok: true as const };
  });
