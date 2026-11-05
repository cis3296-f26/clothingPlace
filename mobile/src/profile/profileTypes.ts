// Mirrors the `profiles` table (display_name, role, style_quiz_completed) and
// the `profile_style_tags` join table from supabase/migrations.
export type ProfileRole = 'shopper' | 'vendor';

export type ShopperProfile = {
  displayName: string;
  // The neighborhood the shopper wants to buy from (local-first discovery).
  neighborhood: string;
  role: ProfileRole;
  // Style tag slugs, e.g. "vintage", "streetwear".
  styleTags: string[];
  styleQuizCompleted: boolean;
  memberSince: number; // epoch ms
};

export const defaultProfile = (now = Date.now()): ShopperProfile => ({
  displayName: '',
  neighborhood: '',
  role: 'shopper',
  styleTags: [],
  styleQuizCompleted: false,
  memberSince: now,
});
