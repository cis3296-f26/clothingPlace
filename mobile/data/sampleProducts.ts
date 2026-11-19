
//
// Sample products to use until we connect to the database
// Prices are stored in cents
//

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

  // Additional product details
  description?: string;
  sizes?: string[];
  colors?: string[];
};

// Builds a photo link sized for the product cards
function photo(id: string): string {
  return `https://images.unsplash.com/photo-${id}?w=600&h=800&fit=crop&q=80`;
}

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Washed Denim Jacket',
    vendorName: 'Fishtown Thread Co.',
    neighborhood: 'Fishtown',
    category: 'Outerwear',
    styleTags: ['vintage', 'streetwear'],
    priceCents: 7800,
    imageUrl: photo('1543076447-215ad9ba6923'),
    description:
      'A relaxed denim jacket featuring a vintage-inspired wash and comfortable everyday fit. Perfect for layering over your favorite outfits.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Washed Blue'],
  },
  {
    id: '2',
    name: 'Oversized Graphic Tee',
    vendorName: 'Fishtown Thread Co.',
    neighborhood: 'Fishtown',
    category: 'Tops',
    styleTags: ['streetwear'],
    priceCents: 3200,
    imageUrl: photo('1576871337622-98d48d1cf531'),
    description:
      'A comfortable oversized graphic T-shirt designed for a relaxed streetwear look. Easy to pair with jeans, shorts, or cargo pants.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White'],
  },
  {
    id: '3',
    name: 'Linen Button-Up Shirt',
    vendorName: 'Manayunk Minimal',
    neighborhood: 'Manayunk',
    category: 'Tops',
    styleTags: ['minimalist'],
    priceCents: 5400,
    imageUrl: photo('1596755094514-f87e34085b2c'),
    description:
      'A lightweight linen button-up shirt with a clean, minimal design. A versatile choice for casual outings or a polished everyday look.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Beige'],
  },
  {
    id: '4',
    name: 'Wide-Leg Trousers',
    vendorName: 'Manayunk Minimal',
    neighborhood: 'Manayunk',
    category: 'Bottoms',
    styleTags: ['minimalist', 'workwear'],
    priceCents: 6600,
    imageUrl: photo('1517445312882-bc9910d016b7'),
    description:
      'Modern wide-leg trousers featuring a relaxed silhouette. Designed to work with both casual streetwear and more refined outfits.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Charcoal'],
  },
  {
    id: '5',
    name: 'Corduroy Overshirt',
    vendorName: 'Lansdale Vintage Supply',
    neighborhood: 'Lansdale',
    category: 'Outerwear',
    styleTags: ['vintage'],
    priceCents: 5900,
    imageUrl: photo('1591047139829-d91aecb6caea'),
    description:
      'A vintage-inspired corduroy overshirt with a relaxed fit. Wear it as a lightweight jacket or layer it over a basic T-shirt.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Brown', 'Olive'],
  },
  {
    id: '6',
    name: 'Straight-Leg Denim Jeans',
    vendorName: 'Lansdale Vintage Supply',
    neighborhood: 'Lansdale',
    category: 'Bottoms',
    styleTags: ['vintage'],
    priceCents: 6200,
    imageUrl: photo('1576995853123-5a10305d93c0'),
    description:
      'Classic straight-leg denim jeans with a timeless vintage-inspired design. Made for an easygoing look that works with nearly anything.',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Light Wash', 'Dark Wash'],
  },
  {
    id: '7',
    name: 'Fleece Hoodie',
    vendorName: 'South Street Basics',
    neighborhood: 'South Street',
    category: 'Tops',
    styleTags: ['streetwear', 'athleisure'],
    priceCents: 4800,
    imageUrl: photo('1556821840-3a63f95609a7'),
    description:
      'A soft fleece hoodie designed for warmth and everyday comfort. Features a relaxed fit that works for casual outfits and layering.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Gray', 'Navy'],
  },
  {
    id: '8',
    name: 'Ribbed Knit Beanie',
    vendorName: 'South Street Basics',
    neighborhood: 'South Street',
    category: 'Accessories',
    styleTags: ['streetwear', 'minimalist'],
    priceCents: 2200,
    imageUrl: photo('1544022613-e87ca75a784a'),
    description:
      'A comfortable ribbed knit beanie with a minimal design. A simple accessory for cooler weather and everyday streetwear outfits.',
    sizes: ['One Size'],
    colors: ['Black', 'Gray', 'Cream'],
  },
];
