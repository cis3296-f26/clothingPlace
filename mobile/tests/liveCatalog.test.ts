import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { mapCatalogRow } from '../data/mapCatalog';
import { toFeedProduct } from '../data/catalogToFeed';
import type { CatalogRow } from '../data/catalogTypes';

// Rows captured from the live cloud project, so this asserts the mapper
// against what PostgREST actually returns rather than a hand-written guess.
const liveRows: CatalogRow[] = JSON.parse(
  readFileSync(
    join(__dirname, 'fixtures', 'live-catalog-rows.json'),
    'utf8',
  ),
);

test('the live payload has the shape CatalogRow declares', () => {
  assert.ok(liveRows.length > 0);
  const row = liveRows[0];
  // These are the assumptions the mapper makes about the embedded joins
  assert.equal(typeof row.vendors.id, 'string');
  assert.ok(Array.isArray(row.product_variants));
  assert.ok(Array.isArray(row.product_images));
  assert.ok(Array.isArray(row.product_style_tags));
  assert.equal(typeof row.product_style_tags[0].style_tags?.name, 'string');
});

test('maps the live row without dropping it', () => {
  const product = mapCatalogRow(liveRows[0], (path) => `https://cdn/${path}`);
  assert.ok(product, 'live row was dropped by the mapper');
  assert.equal(product.name, 'Washed Denim Jacket');
  assert.equal(product.vendorName, 'Fishtown Thread Co.');
  assert.equal(product.category, 'Outerwear');
  // Cheapest of 7800, 7800, 8200
  assert.equal(product.priceCents, 7800);
  assert.deepEqual(product.sizes, ['S', 'M', 'L']);
  assert.deepEqual(product.colors, ['Indigo', 'Washed Black']);
  assert.deepEqual(product.styleTags, ['vintage']);
  assert.equal(product.imageUrl, 'https://cdn/products/denim-jacket/look-1.jpg');
});

test('the live row survives the hop to the feed shape', () => {
  const product = mapCatalogRow(liveRows[0], (path) => `https://cdn/${path}`);
  assert.ok(product);
  const feedProduct = toFeedProduct(product);
  assert.equal(feedProduct.priceCents, 7800);
  assert.deepEqual(feedProduct.sizes, ['S', 'M', 'L']);
  assert.ok(feedProduct.imageUrl.startsWith('https://cdn/'));
});
