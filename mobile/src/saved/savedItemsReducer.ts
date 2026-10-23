import { Product, SavedItem } from '../types/product';

// Pure state logic, kept separate from React and storage so it's easy to unit test.

export type SavedItemsState = {
  items: SavedItem[]; // newest first
  hydrated: boolean; // true once storage has been read
};

export type SavedItemsAction =
  | { type: 'hydrate'; items: SavedItem[] }
  | { type: 'save'; product: Product; now: number }
  | { type: 'remove'; productId: string }
  | { type: 'clear' };

export const initialSavedItemsState: SavedItemsState = { items: [], hydrated: false };

export function savedItemsReducer(
  state: SavedItemsState,
  action: SavedItemsAction,
): SavedItemsState {
  switch (action.type) {
    case 'hydrate': {
      // Anything saved before storage finished loading wins over the stored copy.
      const current = new Set(state.items.map((i) => i.productId));
      const stored = action.items.filter((i) => !current.has(i.productId));
      return { items: sortNewestFirst([...state.items, ...stored]), hydrated: true };
    }
    case 'save': {
      if (state.items.some((i) => i.productId === action.product.id)) return state;
      const item: SavedItem = {
        productId: action.product.id,
        savedAt: action.now,
        product: action.product,
      };
      return { ...state, items: [item, ...state.items] };
    }
    case 'remove': {
      const items = state.items.filter((i) => i.productId !== action.productId);
      return items.length === state.items.length ? state : { ...state, items };
    }
    case 'clear':
      return state.items.length === 0 ? state : { ...state, items: [] };
  }
}

function sortNewestFirst(items: SavedItem[]): SavedItem[] {
  return [...items].sort((a, b) => b.savedAt - a.savedAt);
}
