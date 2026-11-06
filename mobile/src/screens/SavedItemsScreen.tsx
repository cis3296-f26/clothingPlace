import {
  ActivityIndicator,
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
};

export default function SavedItemsScreen({
  onAddToCart,
  onOpenProduct,
  onBrowse,
}: Props) {
  const { items, hydrated, remove } = useSavedItems();

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
        data={items}
        numColumns={2}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columns}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const product = item.product;

          // Find the matching photo from the Home screen catalog.
          const catalogProduct = sampleProducts.find(
            (p) => p.id === product.id,
          );

          const imageUrl = catalogProduct?.imageUrl;

          return (
            <View style={styles.card}>
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
                  />
                ) : (
                  <View
                    style={[
                      styles.productImage,
                      styles.imageFallback,
                      {
                        backgroundColor:
                          product.colorHex || '#eeeeee',
                      },
                    ]}
                  >
                    <Text style={styles.imagePlaceholder}>
                      ClothingPlace
                    </Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                style={styles.heartButton}
                onPress={() => remove(product.id)}
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
                    style={styles.cartButton}
                    onPress={() => onAddToCart(item)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.cartText}>
                      Add to Cart
                    </Text>
                  </Pressable>
                )}
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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 6,
  },

  count: {
    fontSize: 13,
    color: '#555',
    marginTop: 16,
    fontWeight: '600',
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  columns: {
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    marginBottom: 22,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },

  productImage: {
    width: '100%',
    height: 170,
    backgroundColor: '#eeeeee',
  },

  imageFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  imagePlaceholder: {
    fontSize: 12,
    color: '#777',
  },

  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },

  heartIcon: {
    fontSize: 22,
    color: '#e63946',
  },

  cardInfo: {
    padding: 12,
  },

  vendor: {
    fontSize: 11,
    color: '#888',
    textTransform: 'uppercase',
  },

  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    color: '#111',
  },

  price: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
    color: '#111',
  },

  color: {
    fontSize: 12,
    color: '#777',
    marginTop: 3,
  },

  cartButton: {
    backgroundColor: '#111',
    paddingVertical: 9,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 12,
  },

  cartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#777',
    marginTop: 12,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },

  emptyHeart: {
    fontSize: 78,
    color: '#e63946',
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },

  emptyBody: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
  },

  browseButton: {
    backgroundColor: '#111',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
  },

  browseText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
