import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import ProductCard from './ProductCard';
import { Product, sampleProducts } from '../data/sampleProducts';
import { filterProducts } from '../utils/filterProducts';

type ProductFeedProps = {
  query: string;
  onSelectProduct: (product: Product) => void;
};

// A null entry keeps the last row on an odd result count from stretching its
// only card across the full width.
type FeedItem = { product: Product } | { spacer: true };

const NUM_COLUMNS = 2;

export default function ProductFeed({
  query,
  onSelectProduct,
}: ProductFeedProps) {
  const results = useMemo(
    () => filterProducts(sampleProducts, query),
    [query],
  );

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
        'product' in item ? item.product.id : `spacer-${index}`
      }
      renderItem={({ item }) =>
        'product' in item ? (
          <ProductCard
            product={item.product}
            onPress={onSelectProduct}
          />
        ) : (
          <View style={styles.spacer} />
        )
      }
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        results.length > 0 ? (
          <Text style={styles.count}>
            {results.length} {results.length === 1 ? 'listing' : 'listings'}
          </Text>
        ) : undefined
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          {trimmedQuery === '' ? (
            <Text style={styles.emptyText}>No listings available yet.</Text>
          ) : (
            <>
              <Text style={styles.emptyText}>
                No listings match "{trimmedQuery}".
              </Text>
              <Text style={styles.emptyHint}>
                Try a category, a style, or a neighborhood name.
              </Text>
            </>
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
    paddingBottom: 8,
    gap: 12,
  },
  row: {
    gap: 12,
  },
  spacer: {
    flex: 1,
  },
  count: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  empty: {
    paddingTop: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  emptyHint: {
    marginTop: 6,
    fontSize: 13,
    color: '#777777',
    textAlign: 'center',
  },
});
