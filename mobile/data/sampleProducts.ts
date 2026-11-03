// Sample products to use until we connect to the database
// Prices are stored in cents

export type Product = {
  id: string;
  name: string;
  vendorName: string;
  // Where the vendor is based
  neighborhood: string;
  category: string;
  styleTags: string[];
  priceCents: number;
  // Placeholder photo until vendors upload their own
  imageUrl: string;
};

// Builds a photo link sized for the product cards
function photo(id: string): string {
  return `https://images.unsplash.com/photo-${id}?w=600&h=800&fit=crop&q=80`;
}

export const sampleProducts: Product[] = [
  { id: '1', name: 'Washed Denim Jacket', vendorName: 'Fishtown Thread Co.', neighborhood: 'Fishtown', category: 'Outerwear', styleTags: ['vintage', 'streetwear'], priceCents: 7800, imageUrl: photo('1543076447-215ad9ba6923') },
  { id: '2', name: 'Oversized Graphic Tee', vendorName: 'Fishtown Thread Co.', neighborhood: 'Fishtown', category: 'Tops', styleTags: ['streetwear'], priceCents: 3200, imageUrl: photo('1576871337622-98d48d1cf531') },
  { id: '3', name: 'Linen Button-Up Shirt', vendorName: 'Manayunk Minimal', neighborhood: 'Manayunk', category: 'Tops', styleTags: ['minimalist'], priceCents: 5400, imageUrl: photo('1596755094514-f87e34085b2c') },
  { id: '4', name: 'Wide-Leg Trousers', vendorName: 'Manayunk Minimal', neighborhood: 'Manayunk', category: 'Bottoms', styleTags: ['minimalist', 'workwear'], priceCents: 6600, imageUrl: photo('1517445312882-bc9910d016b7') },
  { id: '5', name: 'Corduroy Overshirt', vendorName: 'Lansdale Vintage Supply', neighborhood: 'Lansdale', category: 'Outerwear', styleTags: ['vintage'], priceCents: 5900, imageUrl: photo('1591047139829-d91aecb6caea') },
  { id: '6', name: 'Straight-Leg Denim Jeans', vendorName: 'Lansdale Vintage Supply', neighborhood: 'Lansdale', category: 'Bottoms', styleTags: ['vintage'], priceCents: 6200, imageUrl: photo('1576995853123-5a10305d93c0') },
  { id: '7', name: 'Fleece Hoodie', vendorName: 'South Street Basics', neighborhood: 'South Street', category: 'Tops', styleTags: ['streetwear', 'athleisure'], priceCents: 4800, imageUrl: photo('1556821840-3a63f95609a7') },
  { id: '8', name: 'Ribbed Knit Beanie', vendorName: 'South Street Basics', neighborhood: 'South Street', category: 'Accessories', styleTags: ['streetwear', 'minimalist'], priceCents: 2200, imageUrl: photo('1544022613-e87ca75a784a') },
];
