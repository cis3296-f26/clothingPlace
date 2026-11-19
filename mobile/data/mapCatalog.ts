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