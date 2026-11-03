import { Product } from '../data/sampleProducts';

// Finds products that match the search text
// An empty search shows everything
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
