// Shapes for the catalog query.
// Matches supabase/migrations/20261027034622_create_core_schema.sql.
// Money is integer cents. *_path columns are storage keys, not URLs.

// One size + color, with its own price and stock.
export type CatalogVariant = {
  size: string;
  color: string;
  price_cents: number;
  stock_qty: number;
};

// A row from the catalog query. To-many relations come back as arrays.
export type CatalogRow = {
  id: string;
  name: string;
  description: string | null;
  vendors: { id: string; name: string; neighborhood: string | null };
  categories: { name: string } | null;
  product_variants: CatalogVariant[];
  product_images: { storage_path: string; position: number }[];
  // style_tags is null when a product has no tags, because of the left join.
  product_style_tags: { style_tags: { name: string } | null }[];
};

// What the app renders. Keeps variants so the detail sheet can price a
// selection, and derives the flat lists the chips and cards need.
export type CatalogProduct = {
  id: string;
  name: string;
  description: string | null;
  vendorId: string;
  vendorName: string;
  neighborhood: string | null;
  category: string | null;
  imageUrl: string | null;
  styleTags: string[];
  variants: CatalogVariant[];
  priceCents: number; // cheapest variant
  sizes: string[];
  colors: string[];
  inStock: boolean;
};
