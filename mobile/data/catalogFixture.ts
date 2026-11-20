import type { CatalogRow } from './catalogTypes';

// Stands in for seed data. Same shape as the catalog query in
// supabase/migrations/20261027034622_create_core_schema.sql, so when the real
// seed lands we only swap the source.
//
// Each row after the first covers a case the mapper has to get right.

export const catalogFixture: CatalogRow[] = [
  {
    id: 'p-washed-denim-jacket',
    name: 'Washed Denim Jacket',
    description:
      'Boxy fit with a worn-in wash. Heavyweight cotton, so it breaks in rather than out.',
    vendors: {
      id: 'v-fishtown-thread',
      name: 'Fishtown Thread Co.',
      neighborhood: 'Fishtown',
    },
    categories: { name: 'Outerwear' },
    // Prices differ per variant, and Indigo shows up in two sizes
    product_variants: [
      { size: 'S', color: 'Indigo', price_cents: 7800, stock_qty: 4 },
      { size: 'M', color: 'Indigo', price_cents: 7800, stock_qty: 0 },
      { size: 'L', color: 'Washed Black', price_cents: 8200, stock_qty: 2 },
    ],
    // Out of order on purpose, position 0 is look-1
    product_images: [
      { storage_path: 'products/denim-jacket/look-2.jpg', position: 1 },
      { storage_path: 'products/denim-jacket/look-1.jpg', position: 0 },
    ],
    product_style_tags: [
      { style_tags: { name: 'vintage' } },
      { style_tags: { name: 'streetwear' } },
    ],
  },
  {
    id: 'p-linen-shirt',
    name: 'Linen Button-Up Shirt',
    description: 'Lightweight, slightly sheer, cut straight through the body.',
    vendors: {
      id: 'v-manayunk-minimal',
      name: 'Manayunk Minimal',
      neighborhood: 'Manayunk',
    },
    categories: { name: 'Tops' },
    product_variants: [
      { size: 'S', color: 'Bone', price_cents: 5400, stock_qty: 1 },
      { size: 'M', color: 'Bone', price_cents: 5400, stock_qty: 3 },
    ],
    product_images: [
      { storage_path: 'products/linen-shirt/cover.jpg', position: 0 },
    ],
    product_style_tags: [{ style_tags: { name: 'minimal' } }],
  },
  {
    // Missing description, category and photo
    id: 'p-beanie',
    name: 'Ribbed Knit Beanie',
    description: null,
    vendors: {
      id: 'v-south-street',
      name: 'South Street Basics',
      neighborhood: 'South Street',
    },
    categories: null,
    product_variants: [
      { size: 'One Size', color: 'Charcoal', price_cents: 2200, stock_qty: 12 },
    ],
    product_images: [],
    // One row with a null join, which is what the left join returns with no tags
    product_style_tags: [{ style_tags: null }],
  },
  {
    // Every variant out of stock
    id: 'p-sold-out-hoodie',
    name: 'Fleece Hoodie',
    description: 'Brushed inner face.',
    vendors: {
      id: 'v-south-street',
      name: 'South Street Basics',
      neighborhood: 'South Street',
    },
    categories: { name: 'Tops' },
    product_variants: [
      { size: 'M', color: 'Heather Grey', price_cents: 4800, stock_qty: 0 },
    ],
    product_images: [{ storage_path: 'products/hoodie/cover.jpg', position: 0 }],
    product_style_tags: [{ style_tags: { name: 'streetwear' } }],
  },
  {
    // No variants, so the mapper should drop this one
    id: 'p-no-price',
    name: 'Unpriced Sample',
    description: 'A vendor draft that never got a variant.',
    vendors: {
      id: 'v-fishtown-thread',
      name: 'Fishtown Thread Co.',
      neighborhood: 'Fishtown',
    },
    categories: { name: 'Tops' },
    product_variants: [],
    product_images: [{ storage_path: 'products/draft/cover.jpg', position: 0 }],
    product_style_tags: [{ style_tags: { name: 'minimal' } }],
  },
];
