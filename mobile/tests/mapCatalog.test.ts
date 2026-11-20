import test from 'node:test';
import assert from 'node:assert/strict';

import { mapCatalogRow } from '../data/mapCatalog';
import { catalogFixture } from '../data/catalogFixture';
import {
  toFeedProduct,
  toFeedProducts,
  PLACEHOLDER_IMAGE,
} from '../data/catalogToFeed';
import type { CatalogRow } from '../data/catalogTypes';

function byId(id: string): CatalogRow {
  const row = catalogFixture.find((candidate) => candidate.id === id);
  if (!row) throw new Error(`fixture row not found: ${id}`);
  return row;
}

const resolveImage = (path: string) => `https://cdn.test/${path}`;

// Some tests trigger the drop warning, silence it so the output stays readable
function withoutWarnings<T>(run: () => T): T {
  const warn = console.warn;
  console.warn = () => {};
  try {
    return run();
  } finally {
    console.warn = warn;
  }
}

test('drops a product with no variants', () => {
  withoutWarnings(() => {
    assert.equal(mapCatalogRow(byId('p-no-price')), null);
  });
});

test('maps the scalar and vendor fields', () => {
  const product = mapCatalogRow(byId('p-linen-shirt'), resolveImage);
  assert.ok(product);
  assert.equal(product.id, 'p-linen-shirt');
  assert.equal(product.name, 'Linen Button-Up Shirt');
  assert.equal(product.vendorId, 'v-manayunk-minimal');
  assert.equal(product.vendorName, 'Manayunk Minimal');
  assert.equal(product.neighborhood, 'Manayunk');
  assert.equal(product.category, 'Tops');
});

test('picks the cheapest variant for the card price', () => {
  const product = mapCatalogRow(byId('p-washed-denim-jacket'), resolveImage);
  assert.ok(product);
  // 7800, 7800, 8200
  assert.equal(product.priceCents, 7800);
});

test('keeps every variant so per-size pricing survives', () => {
  const product = mapCatalogRow(byId('p-washed-denim-jacket'), resolveImage);
  assert.ok(product);
  assert.equal(product.variants.length, 3);
  const large = product.variants.find((variant) => variant.size === 'L');
  assert.ok(large);
  assert.equal(large.price_cents, 8200);
  assert.equal(large.color, 'Washed Black');
});

test('collects unique sizes and colors in query order', () => {
  const product = mapCatalogRow(byId('p-washed-denim-jacket'), resolveImage);
  assert.ok(product);
  // Indigo appears in two variants but should only show up once
  assert.deepEqual(product.sizes, ['S', 'M', 'L']);
  assert.deepEqual(product.colors, ['Indigo', 'Washed Black']);
});

test('uses the lowest image position as the cover', () => {
  const product = mapCatalogRow(byId('p-washed-denim-jacket'), resolveImage);
  assert.ok(product);
  assert.equal(
    product.imageUrl,
    'https://cdn.test/products/denim-jacket/look-1.jpg',
  );
});

test('returns null imageUrl when nothing has been uploaded', () => {
  const product = mapCatalogRow(byId('p-beanie'), resolveImage);
  assert.ok(product);
  assert.equal(product.imageUrl, null);
});

test('treats an empty resolved URL as no image', () => {
  // No resolver passed, so the default returns ''
  const catalogProduct = mapCatalogRow(byId('p-washed-denim-jacket'));
  assert.ok(catalogProduct);
  assert.equal(catalogProduct.imageUrl, null);
  assert.equal(toFeedProduct(catalogProduct).imageUrl, PLACEHOLDER_IMAGE);
});

test('filters out null style-tag joins', () => {
  const product = mapCatalogRow(byId('p-beanie'), resolveImage);
  assert.ok(product);
  assert.deepEqual(product.styleTags, []);
});

test('keeps real style tags', () => {
  const product = mapCatalogRow(byId('p-washed-denim-jacket'), resolveImage);
  assert.ok(product);
  assert.deepEqual(product.styleTags, ['vintage', 'streetwear']);
});

test('maps a null category to null', () => {
  const product = mapCatalogRow(byId('p-beanie'), resolveImage);
  assert.ok(product);
  assert.equal(product.category, null);
});

test('reports stock across all variants', () => {
  assert.equal(mapCatalogRow(byId('p-linen-shirt'), resolveImage)?.inStock, true);
  // One size is at zero, the other two aren't
  assert.equal(
    mapCatalogRow(byId('p-washed-denim-jacket'), resolveImage)?.inStock,
    true,
  );
  assert.equal(
    mapCatalogRow(byId('p-sold-out-hoodie'), resolveImage)?.inStock,
    false,
  );
});

test('does not mutate the input row', () => {
  const row = byId('p-washed-denim-jacket');
  const originalOrder = row.product_images.map((image) => image.position);
  mapCatalogRow(row, resolveImage);
  assert.deepEqual(
    row.product_images.map((image) => image.position),
    originalOrder,
  );
});

test('maps every fixture row except the unpriced one', () => {
  withoutWarnings(() => {
    const products = catalogFixture
      .map((row) => mapCatalogRow(row, resolveImage))
      .filter((product) => product !== null);
    assert.equal(products.length, catalogFixture.length - 1);
  });
});

// The second hop, catalog shape to what the UI renders

test('feeds the UI a Product with the fields the sheet needs', () => {
  const catalogProduct = mapCatalogRow(
    byId('p-washed-denim-jacket'),
    resolveImage,
  );
  assert.ok(catalogProduct);
  const feedProduct = toFeedProduct(catalogProduct);

  assert.equal(feedProduct.priceCents, 7800);
  assert.deepEqual(feedProduct.sizes, ['S', 'M', 'L']);
  assert.deepEqual(feedProduct.colors, ['Indigo', 'Washed Black']);
  assert.equal(feedProduct.neighborhood, 'Fishtown');
  assert.ok(feedProduct.description);
});

test('falls back to a placeholder image instead of a null URL', () => {
  const catalogProduct = mapCatalogRow(byId('p-beanie'), resolveImage);
  assert.ok(catalogProduct);
  const feedProduct = toFeedProduct(catalogProduct);
  assert.equal(feedProduct.imageUrl, PLACEHOLDER_IMAGE);
});

test('fills in placeholder text for missing neighborhood and category', () => {
  const catalogProduct = mapCatalogRow(byId('p-beanie'), resolveImage);
  assert.ok(catalogProduct);
  const feedProduct = toFeedProduct(catalogProduct);
  // Both are required strings on Product, and filterProducts calls
  // toLowerCase on them
  assert.equal(typeof feedProduct.neighborhood, 'string');
  assert.equal(typeof feedProduct.category, 'string');
  assert.ok(feedProduct.category.length > 0);
});

test('omits an empty description rather than sending a blank string', () => {
  const catalogProduct = mapCatalogRow(byId('p-beanie'), resolveImage);
  assert.ok(catalogProduct);
  const feedProduct = toFeedProduct(catalogProduct);
  assert.equal(feedProduct.description, undefined);
});

test('a product with a variant always has at least one size', () => {
  // Price lives on the variant, so anything without one gets dropped. That
  // means sizes is never empty, though it can be just "One Size".
  const catalogProduct = mapCatalogRow(byId('p-beanie'), resolveImage);
  assert.ok(catalogProduct);
  const feedProduct = toFeedProduct(catalogProduct);
  assert.deepEqual(feedProduct.sizes, ['One Size']);
});

test('maps a whole page of products', () => {
  withoutWarnings(() => {
    const catalogProducts = catalogFixture
      .map((row) => mapCatalogRow(row, resolveImage))
      .filter((product) => product !== null)
      .map((product) => product!);
    const feedProducts = toFeedProducts(catalogProducts);
    assert.equal(feedProducts.length, 4);
    assert.ok(feedProducts.every((product) => product.imageUrl.length > 0));
  });
});
