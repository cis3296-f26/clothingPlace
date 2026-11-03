// Sample catalog used until the app is connected to Supabase.
// Fields mirror the `products` table (plus the vendor, category and
// style tag names it joins to). Prices are integer cents, like the schema.

export type Product = {
  id: string;
  name: string;
  vendorName: string;
  // Neighborhood the vendor sells from. Powers the "shop local" feed.
  neighborhood: string;
  category: string;
  styleTags: string[];
  priceCents: number;
  // Remote placeholder photo until vendors upload real product images.
  imageUrl: string;
};

function placeholderImage(id: string): string {
  return `https://picsum.photos/seed/clothingplace-${id}/600/800`;
}

export const sampleProducts: Product[] = [
  { id: '1', name: 'Washed Denim Jacket', vendorName: 'Fishtown Thread Co.', neighborhood: 'Fishtown', category: 'Outerwear', styleTags: ['vintage', 'streetwear'], priceCents: 7800, imageUrl: placeholderImage('1') },
  { id: '2', name: 'Oversized Graphic Tee', vendorName: 'Fishtown Thread Co.', neighborhood: 'Fishtown', category: 'Tops', styleTags: ['streetwear'], priceCents: 3200, imageUrl: placeholderImage('2') },
  { id: '3', name: 'Linen Button-Up Shirt', vendorName: 'Manayunk Minimal', neighborhood: 'Manayunk', category: 'Tops', styleTags: ['minimalist'], priceCents: 5400, imageUrl: placeholderImage('3') },
  { id: '4', name: 'Wide-Leg Trousers', vendorName: 'Manayunk Minimal', neighborhood: 'Manayunk', category: 'Bottoms', styleTags: ['minimalist', 'workwear'], priceCents: 6600, imageUrl: placeholderImage('4') },
  { id: '5', name: 'Corduroy Overshirt', vendorName: 'Lansdale Vintage Supply', neighborhood: 'Lansdale', category: 'Outerwear', styleTags: ['vintage'], priceCents: 5900, imageUrl: placeholderImage('5') },
  { id: '6', name: 'Straight-Leg Denim Jeans', vendorName: 'Lansdale Vintage Supply', neighborhood: 'Lansdale', category: 'Bottoms', styleTags: ['vintage'], priceCents: 6200, imageUrl: placeholderImage('6') },
  { id: '7', name: 'Fleece Hoodie', vendorName: 'South Street Basics', neighborhood: 'South Street', category: 'Tops', styleTags: ['streetwear', 'athleisure'], priceCents: 4800, imageUrl: placeholderImage('7') },
  { id: '8', name: 'Ribbed Knit Beanie', vendorName: 'South Street Basics', neighborhood: 'South Street', category: 'Accessories', styleTags: ['streetwear', 'minimalist'], priceCents: 2200, imageUrl: placeholderImage('8') },
];
