import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { Interaction, Product, SavedItem } from '../types/product';
import { initialSavedItemsState, savedItemsReducer } from './savedItemsReducer';
import { loadSavedItems, persistSavedItems } from './savedItemsStorage';

type SavedItemsContextValue = {
  items: SavedItem[];
  count: number;
  hydrated: boolean;
  isSaved: (productId: string) => boolean;
  save: (product: Product) => void;
  remove: (productId: string) => void;
  toggle: (product: Product) => void;
  clear: () => void;
};

const SavedItemsContext = createContext<SavedItemsContextValue | null>(null);

type Props = {
  userId: string;
  // Hook for the recommender's Phase 2 data: every save/unsave is reported here.
  onInteraction?: (interaction: Interaction) => void;
  children: ReactNode;
};

export function SavedItemsProvider({ userId, onInteraction, children }: Props) {
  const [state, dispatch] = useReducer(savedItemsReducer, initialSavedItemsState);

  // Keep the latest items/callback in refs so the action functions stay stable.
  const itemsRef = useRef(state.items);
  itemsRef.current = state.items;
  const onInteractionRef = useRef(onInteraction);
  onInteractionRef.current = onInteraction;

  // Load from storage whenever the signed-in user changes.
  useEffect(() => {
    let cancelled = false;
    dispatch({ type: 'clear' });
    loadSavedItems(userId).then((items) => {
      if (!cancelled) dispatch({ type: 'hydrate', items });
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Write back after every change, but never before the initial load finishes
  // (that would overwrite the stored list with an empty one).
  useEffect(() => {
    if (state.hydrated) persistSavedItems(userId, state.items);
  }, [state.items, state.hydrated, userId]);

  const log = useCallback(
    (productId: string, type: 'save' | 'unsave') =>
      onInteractionRef.current?.({ userId, productId, type, timestamp: Date.now() }),
    [userId],
  );

  const isSaved = useCallback(
    (productId: string) => state.items.some((i) => i.productId === productId),
    [state.items],
  );

  const save = useCallback(
    (product: Product) => {
      if (itemsRef.current.some((i) => i.productId === product.id)) return;
      dispatch({ type: 'save', product, now: Date.now() });
      log(product.id, 'save');
    },
    [log],
  );

  const remove = useCallback(
    (productId: string) => {
      if (!itemsRef.current.some((i) => i.productId === productId)) return;
      dispatch({ type: 'remove', productId });
      log(productId, 'unsave');
    },
    [log],
  );

  const toggle = useCallback(
    (product: Product) => {
      if (itemsRef.current.some((i) => i.productId === product.id)) remove(product.id);
      else save(product);
    },
    [save, remove],
  );

  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  const value = useMemo(
    () => ({
      items: state.items,
      count: state.items.length,
      hydrated: state.hydrated,
      isSaved,
      save,
      remove,
      toggle,
      clear,
    }),
    [state.items, state.hydrated, isSaved, save, remove, toggle, clear],
  );

  return <SavedItemsContext.Provider value={value}>{children}</SavedItemsContext.Provider>;
}

export function useSavedItems(): SavedItemsContextValue {
  const ctx = useContext(SavedItemsContext);
  if (!ctx) throw new Error('useSavedItems must be used inside <SavedItemsProvider>');
  return ctx;
}
