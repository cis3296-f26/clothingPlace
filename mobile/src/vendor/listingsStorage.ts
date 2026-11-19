import AsyncStorage from '@react-native-async-storage/async-storage';

// A product a vendor published from the "Upload a product" sheet
export type VendorListing = {
  id: string;
  photoUri: string;
  name: string;
  priceCents: number;
  category: string;
  styleTags: string[];
  description: string;
  createdAt: number; // epoch ms
};

// Saved on this device for now, the same way the vendor profile is.
// Should move to Supabase once the app is connected to the database.
const STORAGE_KEY = 'clothingplace:vendor-listings:demo-user';

function isListing(value: unknown): value is VendorListing {
  if (value === null || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.photoUri === 'string' &&
    typeof v.name === 'string' &&
    typeof v.priceCents === 'number' &&
    typeof v.category === 'string' &&
    Array.isArray(v.styleTags) &&
    v.styleTags.every((tag) => typeof tag === 'string') &&
    typeof v.description === 'string' &&
    typeof v.createdAt === 'number'
  );
}

export async function loadListings(): Promise<VendorListing[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isListing) : [];
  } catch (error) {
    console.warn('Could not load vendor listings:', error);
    return [];
  }
}

export async function saveListings(listings: VendorListing[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
