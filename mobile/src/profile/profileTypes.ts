// Mirrors the `profiles` table (display_name, role, style_quiz_completed) and
// the `profile_style_tags` join table from supabase/migrations.
export type ProfileRole = 'shopper' | 'vendor';

// Style quiz answers that have no Supabase column yet. Kept on-device for now;
// the recommender can read them alongside styleTags.
export type StylePreferences = {
  categories: string[]; // matches Product.category, e.g. "Tops"
  colors: string[]; // color family ids, e.g. "earth"
  fit: string; // fitted | relaxed | oversized | mix
  sizes: { top: string; bottom: string };
  budget: string; // under30 | 30to60 | 60to100 | 100plus
  priceRange: { minCents: number; maxCents: number | null };
  values: string[]; // local | handmade | sustainable | unique | deals
  completedAt: number; // epoch ms
};

export type ShopperProfile = {
  displayName: string;
  // The neighborhood the shopper wants to buy from (local-first discovery).
  neighborhood: string;
  role: ProfileRole;
  // Style tag slugs, e.g. "vintage", "streetwear".
  styleTags: string[];
  styleQuizCompleted: boolean;
  // True if the shopper dismissed the quiz popup, so it doesn't reopen every launch.
  styleQuizSkipped: boolean;
  stylePreferences: StylePreferences | null;
  memberSince: number; // epoch ms
  // Local file URI of the profile photo taken with the camera or picked from the library
  photoUri: string | null;
};

export const defaultProfile = (now = Date.now()): ShopperProfile => ({
  displayName: '',
  neighborhood: '',
  role: 'shopper',
  styleTags: [],
  styleQuizCompleted: false,
  styleQuizSkipped: false,
  stylePreferences: null,
  memberSince: now,
  photoUri: null,
});
