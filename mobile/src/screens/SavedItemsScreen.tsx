
import { useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { sampleProducts } from '../../data/sampleProducts';
import { useSavedItems } from '../saved/SavedItemsContext';
import type { SavedItem } from '../types/product';

type Props = {
  onAddToCart?: (item: SavedItem) => void;
  onOpenProduct?: (productId: string) => void;
  onBrowse?: () => void;
  // Extra space at the bottom, like room for the floating navbar
  bottomPadding?: number;
};

const NUM_COLUMNS = 2;
const CARD_RADIUS = 16;

// Blank filler so a lone last card doesn't stretch across the full width
type ListRow = { item: SavedItem } | { spacer: true };

export default function SavedItemsScreen({
  onAddToCart,
  onOpenProduct,
  onBrowse,
  bottomPadding = 20,
}: Props) {
  const { items, hydrated, remove } = useSavedItems();

  // Pad to a full final row so the last card keeps its grid width
  const rows = useMemo<ListRow[]>(() => {
    const list: ListRow[] = items.map((item) => ({ item }));
    const remainder = list.length % NUM_COLUMNS;

    if (remainder !== 0) {
      for (let i = 0; i < NUM_COLUMNS - remainder; i += 1) {
        list.push({ spacer: true });
      }
    }

    return list;
  }, [items]);

  // Ask before removing an item from the Wishlist.
  const confirmRemove = (productId: string, productName: string) => {
    Alert.alert(
      'Remove from Wishlist?',
      `Are you sure you want to remove ${productName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => remove(productId),
        },
      ],
    );
  };

  if (!hydrated) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111" />
        <Text style={styles.loadingText}>
          Loading your wishlist...
        </Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyHeart}>{'\u2661'}</Text>

        <Text style={styles.emptyTitle}>
          Your wishlist is empty
        </Text>

        <Text style={styles.emptyBody}>
          Found something you love? Tap the heart on any
          product to save it here for later.
        </Text>

        {onBrowse && (
          <Pressable
            style={styles.browseButton}
            onPress={onBrowse}
            accessibilityRole="button"
          >
            <Text style={styles.browseText}>
              Explore Clothing
            </Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          My Wishlist {'\u2661'}
        </Text>

        <Text style={styles.subtitle}>
          Your favorite clothing, all in one place.
        </Text>

        <Text style={styles.count}>
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </Text>
      </View>

      <FlatList
        data={rows}
        numColumns={NUM_COLUMNS}
        keyExtractor={(row, index) =>
          'item' in row ? row.item.productId : `spacer-${index}`
        }
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomPadding },
        ]}
        columnWrapperStyle={styles.columns}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: row }) => {
          if (!('item' in row)) {
            return <View style={styles.spacer} />;
          }

          const { item } = row;
          const product = item.product;

          const catalogProduct = sampleProducts.find(
            (p) => p.id === product.id,
          );

          const imageUrl = catalogProduct?.imageUrl;

          return (
            <View style={styles.card}>
              <View style={styles.clip}>
                <Pressable
                  onPress={() => onOpenProduct?.(product.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${product.name}`}
                >
                  {imageUrl ? (
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.productImage}
                      resizeMode="cover"
                      accessibilityIgnoresInvertColors
                    />
                  ) : (
                    <View
                      style={[
                        styles.productImage,
                        styles.imageFallback,
                        {
                          backgroundColor:
                            product.colorHex || '#f0f0f0',
                        },
                      ]}
                    >
                      <Text style={styles.imagePlaceholder}>
                        ClothingPlace
                      </Text>
                    </View>
                  )}
                </Pressable>

                {/* Remove with confirmation */}
                <Pressable
                  style={({ pressed }) => [
                    styles.heartButton,
                    pressed && styles.heartButtonPressed,
                  ]}
                  onPress={() =>
                    confirmRemove(product.id, product.name)
                  }
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${product.name} from wishlist`}
                >
                  <Text style={styles.heartIcon}>
                    {'\u2665'}
                  </Text>
                </Pressable>

                <View style={styles.cardInfo}>
                  <Text
                    style={styles.vendor}
                    numberOfLines={1}
                  >
                    {product.vendorName}
                  </Text>

                  <Text
                    style={styles.productName}
                    numberOfLines={2}
                  >
                    {product.name}
                  </Text>

                  <Text style={styles.price}>
                    ${product.price.toFixed(2)}
                  </Text>

                  {product.color !== 'Not specified' && (
                    <Text style={styles.color}>
                      {product.color}
                    </Text>
                  )}

                  {onAddToCart && (
                    <Pressable
                      style={({ pressed }) => [
                        styles.cartButton,
                        pressed && styles.cartButtonPressed,
                      ]}
                      onPress={() => onAddToCart(item)}
                      accessibilityRole="button"
                      accessibilityLabel={`Add ${product.name} to cart`}
                    >
                      <Text style={styles.cartText}>
                        Add to Cart
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  count: {
    fontSize: 12,
    color: '#999999',
    marginTop: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },

  columns: {
    gap: 16,
  },

  spacer: {
    flex: 1,
  },

  // Shadow and rounded corners live on separate views on purpose:
  // overflow: 'hidden' on the clip would otherwise kill the shadow.
  card: {
    flex: 1,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  clip: {
    flex: 1,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e8e8e8',
  },

  productImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#f0f0f0',
  },

  imageFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  imagePlaceholder: {
    fontSize: 11,
    color: '#8a8a8a',
  },

  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  heartButtonPressed: {
    opacity: 0.7,
  },

  heartIcon: {
    fontSize: 22,
    color: '#e63946',
  },

  cardInfo: {
    padding: 12,
  },

  vendor: {
    fontSize: 12,
    color: '#8a8a8a',
  },

  productName: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 3,
    color: '#111',
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 'auto',
    paddingTop: 10,
    color: '#111',
  },

  color: {
    fontSize: 12,
    color: '#8a8a8a',
    marginTop: 3,
  },

  cartButton: {
    backgroundColor: '#111',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },

  cartButtonPressed: {
    opacity: 0.8,
  },

  cartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#666',
    marginTop: 12,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },

  emptyHeart: {
    fontSize: 78,
    color: '#e63946',
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },

  emptyBody: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },

  browseButton: {
    backgroundColor: '#111',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },

  browseText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
