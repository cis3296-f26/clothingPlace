import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedItem } from '../types/product';

// Saved items are stored on-device per user. When there's a backend, swap these
// two functions for API calls and nothing else needs to change.

const VERSION = 1;
const keyFor = (userId: string) => `clothingPlace:savedItems:v${VERSION}:${userId}`;

export async function loadSavedItems(userId: string): Promise<SavedItem[]> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(userId));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isSavedItem) : [];
  } catch (err) {
    console.warn('[savedItems] failed to load, starting empty', err);
    return [];
  }
}

export async function persistSavedItems(userId: string, items: SavedItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(keyFor(userId), JSON.stringify(items));
  } catch (err) {
    console.warn('[savedItems] failed to persist', err);
  }
}

// Drops corrupted or old-shape entries instead of crashing the Saved screen.
function isSavedItem(value: unknown): value is SavedItem {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  const p = v.product as Record<string, unknown> | undefined;
  return (
    typeof v.productId === 'string' &&
    typeof v.savedAt === 'number' &&
    typeof p === 'object' &&
    p !== null &&
    p.id === v.productId &&
    typeof p.name === 'string' &&
    typeof p.price === 'number'
  );
}
