// Sample catalog used until the app is connected to Supabase.
// Fields mirror the `products` table (plus the vendor, category and
// style tag names it joins to). Prices are integer cents, like the schema.

export type Product = {
  id: string;
  name: string;
  vendorName: string;
  category: string;
  styleTags: string[];
  priceCents: number;
};

export const sampleProducts: Product[] = [
  { id: '1', name: 'Washed Denim Jacket', vendorName: 'Fishtown Thread Co.', category: 'Outerwear', styleTags: ['vintage', 'streetwear'], priceCents: 7800 },
  { id: '2', name: 'Oversized Graphic Tee', vendorName: 'Fishtown Thread Co.', category: 'Tops', styleTags: ['streetwear'], priceCents: 3200 },
  { id: '3', name: 'Linen Button-Up Shirt', vendorName: 'Manayunk Minimal', category: 'Tops', styleTags: ['minimalist'], priceCents: 5400 },
  { id: '4', name: 'Wide-Leg Trousers', vendorName: 'Manayunk Minimal', category: 'Bottoms', styleTags: ['minimalist', 'workwear'], priceCents: 6600 },
  { id: '5', name: 'Corduroy Overshirt', vendorName: 'Lansdale Vintage Supply', category: 'Outerwear', styleTags: ['vintage'], priceCents: 5900 },
  { id: '6', name: 'Straight-Leg Denim Jeans', vendorName: 'Lansdale Vintage Supply', category: 'Bottoms', styleTags: ['vintage'], priceCents: 6200 },
  { id: '7', name: 'Fleece Hoodie', vendorName: 'South Street Basics', category: 'Tops', styleTags: ['streetwear', 'athleisure'], priceCents: 4800 },
  { id: '8', name: 'Ribbed Knit Beanie', vendorName: 'South Street Basics', category: 'Accessories', styleTags: ['streetwear', 'minimalist'], priceCents: 2200 },
];
