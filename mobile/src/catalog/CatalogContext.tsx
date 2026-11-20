import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { Product } from '../../data/sampleProducts';
import { mapCatalogRow } from '../../data/mapCatalog';
import { toFeedProducts } from '../../data/catalogToFeed';
import type { CatalogProduct } from '../../data/catalogTypes';
import { fetchCatalogRows } from '../api/catalog';

type CatalogStatus = 'loading' | 'ready' | 'error';

type CatalogContextValue = {
  status: CatalogStatus;
  products: Product[];
  error: string | null;
  findProduct: (productId: string) => Product | undefined;
  reload: () => void;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<CatalogStatus>('loading');
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  // Bumped by reload() to re-run the fetch effect
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    fetchCatalogRows().then((result) => {
      if (cancelled) return;

      if (result.status === 'error') {
        setError(result.message);
        setStatus('error');
        return;
      }

      // No storage bucket yet, so no resolver: every product gets the placeholder
      const mapped = result.rows
        .map((row) => mapCatalogRow(row))
        .filter((product): product is CatalogProduct => product !== null);

      setProducts(toFeedProducts(mapped));
      setError(null);
      setStatus('ready');
    });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const findProduct = useCallback(
    (productId: string) => products.find((p) => p.id === productId),
    [products],
  );

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  const value = useMemo(
    () => ({ status, products, error, findProduct, reload }),
    [status, products, error, findProduct, reload],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used inside <CatalogProvider>');
  return ctx;
}
