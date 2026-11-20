import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultProfile, ShopperProfile, StylePreferences } from './profileTypes';

// The profile is stored on-device per user, the same way saved items are.
// When the app is connected to Supabase, swap these two functions for reads
// and writes to the `profiles` / `profile_style_tags` tables.

const VERSION = 1;
const keyFor = (userId: string) => `clothingPlace:profile:v${VERSION}:${userId}`;

export async function loadProfile(userId: string): Promise<ShopperProfile> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(userId));
    if (!raw) return defaultProfile();
    return sanitizeProfile(JSON.parse(raw));
  } catch (err) {
    console.warn('[profile] failed to load, using defaults', err);
    return defaultProfile();
  }
}

export async function persistProfile(userId: string, profile: ShopperProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(keyFor(userId), JSON.stringify(profile));
  } catch (err) {
    console.warn('[profile] failed to persist', err);
  }
}

// Fills in any missing or corrupted fields with defaults instead of crashing.
function sanitizeProfile(value: unknown): ShopperProfile {
  const base = defaultProfile();
  if (typeof value !== 'object' || value === null) return base;
  const v = value as Record<string, unknown>;

  return {
    displayName: typeof v.displayName === 'string' ? v.displayName : base.displayName,
    neighborhood: typeof v.neighborhood === 'string' ? v.neighborhood : base.neighborhood,
    role: v.role === 'vendor' ? 'vendor' : 'shopper',
    styleTags: Array.isArray(v.styleTags)
      ? v.styleTags.filter((t): t is string => typeof t === 'string')
      : base.styleTags,
    styleQuizCompleted:
      typeof v.styleQuizCompleted === 'boolean' ? v.styleQuizCompleted : base.styleQuizCompleted,
    styleQuizSkipped:
      typeof v.styleQuizSkipped === 'boolean' ? v.styleQuizSkipped : base.styleQuizSkipped,
    stylePreferences: sanitizeStylePreferences(v.stylePreferences),
    memberSince: typeof v.memberSince === 'number' ? v.memberSince : base.memberSince,
    photoUri: typeof v.photoUri === 'string' && v.photoUri ? v.photoUri : base.photoUri,
  };
}

// Older profiles won't have quiz preferences; anything malformed becomes null.
function sanitizeStylePreferences(value: unknown): StylePreferences | null {
  if (typeof value !== 'object' || value === null) return null;
  const v = value as Record<string, unknown>;
  const strings = (x: unknown) =>
    Array.isArray(x) ? x.filter((s): s is string => typeof s === 'string') : [];
  const str = (x: unknown) => (typeof x === 'string' ? x : '');
  const sizes = (typeof v.sizes === 'object' && v.sizes !== null ? v.sizes : {}) as Record<string, unknown>;
  const range = (typeof v.priceRange === 'object' && v.priceRange !== null ? v.priceRange : {}) as Record<string, unknown>;

  if (typeof v.completedAt !== 'number') return null;
  return {
    categories: strings(v.categories),
    colors: strings(v.colors),
    fit: str(v.fit),
    sizes: { top: str(sizes.top), bottom: str(sizes.bottom) },
    budget: str(v.budget),
    priceRange: {
      minCents: typeof range.minCents === 'number' ? range.minCents : 0,
      maxCents: typeof range.maxCents === 'number' ? range.maxCents : null,
    },
    values: strings(v.values),
    completedAt: v.completedAt,
  };
}
