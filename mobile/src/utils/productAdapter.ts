
import type { Product as FeedProduct } from '../../data/sampleProducts';
import type { Product as SavedProduct } from '../types/product';

// Converts products from the main UI into the Wishlist format.
export function toSavedProduct(product: FeedProduct): SavedProduct {
  return {
    id: product.id,
    name: product.name,
    price: product.priceCents / 100,
    category: product.category,
    color: 'Not specified',
    colorHex: '#eeeeee',
    styleTags: product.styleTags,
    vendorId: product.vendorName,
    vendorName: product.vendorName,
  };
}
