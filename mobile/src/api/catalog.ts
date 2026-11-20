import { supabase } from '../lib/supabase';
import type { CatalogRow } from '../../data/catalogTypes';

// The nested select the mapper expects. Kept as a constant so the same string
// can be pasted into Studio or .select() when the shape needs checking.
export const CATALOG_SELECT = `
  id,
  name,
  description,
  vendors ( id, name, neighborhood ),
  categories ( name ),
  product_variants ( size, color, price_cents, stock_qty ),
  product_images ( storage_path, position ),
  product_style_tags ( style_tags ( name ) )
`;

export type CatalogResult =
  | { status: 'ok'; rows: CatalogRow[] }
  | { status: 'error'; message: string };

// Reads the catalog and hands back rows in the shape mapCatalogRow wants.
// PostgREST returns embedded relations as objects or arrays depending on the
// relationship, so the cast is deliberate: if the select above changes, this
// is where the mismatch surfaces.
export async function fetchCatalogRows(): Promise<CatalogResult> {
  const { data, error } = await supabase
    .from('products')
    .select(CATALOG_SELECT)
    // Stable order so the feed doesn't reshuffle between loads
    .order('name', { ascending: true });

  if (error) {
    return { status: 'error', message: error.message };
  }

  return { status: 'ok', rows: (data ?? []) as unknown as CatalogRow[] };
}
