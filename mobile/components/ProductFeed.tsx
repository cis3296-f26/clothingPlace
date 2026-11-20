import { FlatList, StyleSheet, Text, View } from "react-native";
import { useMemo } from "react";
import ProductCard from "./ProductCard";
import { Product, sampleProducts } from "../data/sampleProducts";
import { filterProducts } from "../utils/filterProducts";

const recommended = sampleProducts.slice(0, 5);
type ProductFeedProps = {
  query: string;
  onSelectProduct: (product: Product) => void;
  // Extra space at the bottom, like room for the floating navbar
  bottomPadding?: number;
};

// Blank filler so a lone last card doesn't stretch across the full width
type FeedItem = { product: Product } | { spacer: true };

const NUM_COLUMNS = 2;

export default function ProductFeed({
  query,
  onSelectProduct,
  bottomPadding = 20,
}: ProductFeedProps) {
  const results = useMemo(() => filterProducts(sampleProducts, query), [query]);

  const items = useMemo<FeedItem[]>(() => {
    const list: FeedItem[] = results.map((product) => ({ product }));
    const remainder = list.length % NUM_COLUMNS;
    if (remainder !== 0) {
      for (let i = 0; i < NUM_COLUMNS - remainder; i += 1) {
        list.push({ spacer: true });
      }
    }
    return list;
  }, [results]);

  const trimmedQuery = query.trim();

  return (
    <FlatList
      data={items}
      numColumns={NUM_COLUMNS}
      keyExtractor={(item, index) =>
        "product" in item ? item.product.id : `spacer-${index}`
      }
      renderItem={({ item }) =>
        "product" in item ? (
          <ProductCard product={item.product} onPress={onSelectProduct} />
        ) : (
          <View style={styles.spacer} />
        )
      }
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
      ListHeaderComponent={
        <View>
          <Text style={styles.recHeading}>Recommended for your style</Text>
          <FlatList
            data={recommended}
            keyExtractor={(p) => p.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.recCard}>
                <ProductCard product={item} onPress={onSelectProduct} />
              </View>
            )}
            style={styles.recRow}
          />
          {results.length > 0 && (
            <Text style={styles.count}>
              {results.length} {results.length === 1 ? "listing" : "listings"}
            </Text>
          )}
        </View>
      }
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    // Extra space so card shadows don't get cut off
    paddingBottom: 20,
    gap: 16,
  },
  row: {
    gap: 16,
  },
  spacer: {
    flex: 1,
  },
  count: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  empty: {
    paddingTop: 48,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
  },
  emptyHint: {
    marginTop: 6,
    fontSize: 13,
    color: "#777777",
    textAlign: "center",
  },
  recHeading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  recRow: {
    marginBottom: 20,
  },
  recCard: {
    width: 160,
    marginRight: 12,
  },
});
