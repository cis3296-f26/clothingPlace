// Mirrors the Product / Vendor entities from the conceptual design.
export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  color: string; // display name, e.g. "Olive"
  colorHex: string; // used for the placeholder swatch until real images exist
  styleTags: string[];
  vendorId: string;
  vendorName: string;
};

// A saved item keeps a snapshot of the product so the Saved list still renders
// if the product later changes or is removed from the catalog.
export type SavedItem = {
  productId: string;
  savedAt: number; // epoch ms
  product: Product;
};

// Matches the Interaction entity (view, like, save, purchase). "unsave" is
// logged too so the recommender can tell a lasting save from a quick undo.
export type InteractionType = 'view' | 'like' | 'save' | 'unsave' | 'purchase';

export type Interaction = {
  userId: string;
  productId: string;
  type: InteractionType;
  timestamp: number;
};
