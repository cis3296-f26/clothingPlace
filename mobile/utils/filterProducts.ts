import { Product } from '../data/sampleProducts';

// Returns products whose name, brand, neighborhood, category, or style tags
// contain the query. An empty query returns the whole catalog, so the home
// feed can show every listing before the user searches.
export function filterProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (q === '') return products;

  return products.filter((p) =>
    [p.name, p.vendorName, p.neighborhood, p.category, ...p.styleTags].some(
      (field) => field.toLowerCase().includes(q),
    ),
  );
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
