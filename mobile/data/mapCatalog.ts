import type {
  CatalogProduct,
  CatalogRow,
  CatalogVariant,
} from './catalogTypes';

// The card only has room for one price, so show the cheapest variant.
function lowestPrice(variants: CatalogVariant[]): number {
  return variants.reduce(
    (lowest, variant) =>
      variant.price_cents < lowest ? variant.price_cents : lowest,
    variants[0].price_cents,
  );
}

function uniqueInOrder(values: string[]): string[] {
  return [...new Set(values)];
}

// Cover photo is the lowest position. Copy first so we don't reorder the row.
function coverPaths(row: CatalogRow): string[] {
  return [...row.product_images]
    .sort((a, b) => a.position - b.position)
    .map((image) => image.storage_path);
}

function resolveFirst(
  paths: string[],
  resolveImage: (storagePath: string) => string,
): string | null {
  // Nothing uploaded yet, let the UI show its placeholder
  if (paths.length === 0) return null;
  // The default resolver returns '' until there's a storage bucket, and an
  // empty URI renders a blank image instead of the placeholder
  return resolveImage(paths[0]) || null;
}

export function mapCatalogRow(
  row: CatalogRow,
  resolveImage: (storagePath: string) => string = () => '',
): CatalogProduct | null {
  // No variants means no price, so there's nothing to show
  if (row.product_variants.length === 0) {
    console.warn(`[catalog] "${row.name}" has no variants and was dropped`);
    return null;
  }

  const variants = row.product_variants;

  const styleTags = row.product_style_tags
    .map((join) => join.style_tags?.name)
    .filter((name): name is string => Boolean(name));

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    vendorId: row.vendors.id,
    vendorName: row.vendors.name,
    neighborhood: row.vendors.neighborhood,
    category: row.categories?.name ?? null,
    imageUrl: resolveFirst(coverPaths(row), resolveImage),
    styleTags,
    variants,
    priceCents: lowestPrice(variants),
    sizes: uniqueInOrder(variants.map((variant) => variant.size)),
    colors: uniqueInOrder(variants.map((variant) => variant.color)),
    inStock: variants.some((variant) => variant.stock_qty > 0),
  };
}
