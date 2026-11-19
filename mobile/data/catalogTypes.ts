// The row shape returned by the catalog query. Child tables come back as

export type CatalogRow = {
    id: string;
    name: string;
    description: string | null;
    vendors: { id: string; name: string; neighborhood: string | null };
    categories: { name: string } | null;
    product_variants: { price_cents: number; color: string; stock_qty: number }[];
    product_images: { storage_path: string; position: number }[];
    product_style_tags: { style_tags: { name: string } | null }[];
  };


// what the app will render in the catalog page
export type CatalogProduct = {
    id: string;
    name: string;
    priceCents: number;
    category: string | null;
    color: string | null;
    styleTags: string[];
    vendorId: string;
    vendorName: string;
    neighborhood: string | null;
    imageUrl: string | null;
    description: string | null;
  };