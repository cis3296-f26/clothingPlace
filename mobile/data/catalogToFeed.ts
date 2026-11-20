import type { Product } from './sampleProducts';
import type { CatalogProduct } from './catalogTypes';

// Product.imageUrl is a plain string, so fill in something when nothing was
// uploaded.
export const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=800&fit=crop&q=80';

const UNCATEGORIZED = 'Uncategorized';
const UNKNOWN_NEIGHBORHOOD = 'Philadelphia';

// Turns a catalog product into the Product the feed and detail sheet expect.
export function toFeedProduct(product: CatalogProduct): Product {
  return {
    id: product.id,
    name: product.name,
    vendorName: product.vendorName,
    neighborhood: product.neighborhood ?? UNKNOWN_NEIGHBORHOOD,
    category: product.category ?? UNCATEGORIZED,
    styleTags: product.styleTags,
    priceCents: product.priceCents,
    imageUrl: product.imageUrl ?? PLACEHOLDER_IMAGE,
    // Leave these out when empty so the sheet hides those sections
    ...(product.description ? { description: product.description } : {}),
    ...(product.sizes.length > 0 ? { sizes: product.sizes } : {}),
    ...(product.colors.length > 0 ? { colors: product.colors } : {}),
  };
}

export function toFeedProducts(products: CatalogProduct[]): Product[] {
  return products.map(toFeedProduct);
}
