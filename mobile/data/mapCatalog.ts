import type {CatalogProduct, CatalogRow} from './catalogTypes';

export function mapCatalogRow(
    row: CatalogRow,
    resolveImage: (storagePath: string) => string = () => '',
  ): CatalogProduct | null {
    // No price means no card. Drop it
    if (row.product_variants.length === 0) {
      console.warn(`[catalog] "${row.name}" has no variants and was dropped`);
      return null;
    }

    // The cheapest variant sets the price shown on the card
    const variant = row.product_variants.reduce((lowest, next) =>
      next.price_cents < lowest.price_cents ? next : lowest,
    );

    // The first image by position is the card photo
    const cover = [...row.product_images].sort(
      (a, b) => a.position - b.position,
    )[0];

    const styleTags = row.product_style_tags
      .map(({style_tags}) => style_tags?.name)
      .filter((name): name is string => Boolean(name));

    return {
      id: row.id,
      name: row.name,
      priceCents: variant.price_cents,
      category: row.categories?.name ?? null,
      color: variant.color,
      styleTags,
      vendorId: row.vendors.id,
      vendorName: row.vendors.name,
      neighborhood: row.vendors.neighborhood,
      imageUrl: cover ? resolveImage(cover.storage_path) : null,
      description: row.description,
    };
}
