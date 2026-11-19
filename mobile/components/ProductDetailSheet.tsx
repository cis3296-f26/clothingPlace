
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { Product } from '../data/sampleProducts';
import { formatPrice } from '../utils/filterProducts';
import { useSavedItems } from '../src/saved/SavedItemsContext';
import { toSavedProduct } from '../src/utils/productAdapter';

type ProductDetailSheetProps = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductDetailSheet({
  product,
  onClose,
}: ProductDetailSheetProps) {
  const [shown, setShown] = useState<Product | null>(null);

  // Product option selections
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const progress = useRef(new Animated.Value(0)).current;

  // Wishlist
  const { isSaved, toggle } = useSavedItems();
  const productIsSaved = shown ? isSaved(shown.id) : false;

  const handleWishlist = () => {
    if (!shown) return;
    toggle(toSavedProduct(shown));
  };

  // Open and close the product pop-up
  useEffect(() => {
    if (product) {
      setShown(product);
    } else if (shown) {
      Animated.timing(progress, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setShown(null);
      });
    }
  }, [product]);

  // Animate in and reset selections for each product
  useEffect(() => {
    if (shown && product) {
      setSelectedSize(null);
      setSelectedColor(null);

      progress.setValue(0);

      Animated.spring(progress, {
        toValue: 1,
        useNativeDriver: true,
        damping: 18,
        stiffness: 190,
        mass: 0.9,
      }).start();
    }
  }, [shown?.id, product?.id]);

  const fade = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });

  const lift = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [28, 0],
  });

  const hasDescription = Boolean(shown?.description?.trim());
  const hasSizes = Boolean(shown?.sizes?.length);
  const hasColors = Boolean(shown?.colors?.length);

  const hasSelection = selectedSize !== null || selectedColor !== null;

  return (
    <Modal
      visible={shown !== null}
      animationType="none"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.backdrop,
            { opacity: fade },
          ]}
        />

        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close product details"
        />

        {shown && (
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fade,
                transform: [{ translateY: lift }, { scale }],
              },
            ]}
          >
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Product Image */}
              <Image
                source={{ uri: shown.imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />

              <View style={styles.body}>
                {/* Category */}
                <Text style={styles.category}>
                  {shown.category}
                </Text>

                {/* Product Name */}
                <Text style={styles.name}>
                  {shown.name}
                </Text>

                {/* Vendor */}
                <Text style={styles.vendor}>
                  {shown.vendorName}
                  {' \u00B7 '}
                  {shown.neighborhood}
                </Text>

                {/* Price */}
                <Text style={styles.price}>
                  {formatPrice(shown.priceCents)}
                </Text>

                {/* Description */}
                {hasDescription && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      Description
                    </Text>

                    <Text style={styles.description}>
                      {shown.description}
                    </Text>
                  </View>
                )}

                {/* Interactive Size Selection */}
                {hasSizes && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      Select Size
                    </Text>

                    <View style={styles.optionsRow}>
                      {shown.sizes?.map((size) => {
                        const selected = selectedSize === size;

                        return (
                          <Pressable
                            key={size}
                            onPress={() => setSelectedSize(size)}
                            style={[
                              styles.sizeChip,
                              selected && styles.optionSelected,
                            ]}
                            accessibilityRole="button"
                            accessibilityLabel={`Select size ${size}`}
                            accessibilityState={{ selected }}
                          >
                            <Text
                              style={[
                                styles.sizeText,
                                selected && styles.optionTextSelected,
                              ]}
                            >
                              {size}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Interactive Color Selection */}
                {hasColors && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      Select Color
                    </Text>

                    <View style={styles.optionsRow}>
                      {shown.colors?.map((color) => {
                        const selected = selectedColor === color;

                        return (
                          <Pressable
                            key={color}
                            onPress={() => setSelectedColor(color)}
                            style={[
                              styles.colorChip,
                              selected && styles.optionSelected,
                            ]}
                            accessibilityRole="button"
                            accessibilityLabel={`Select color ${color}`}
                            accessibilityState={{ selected }}
                          >
                            <Text
                              style={[
                                styles.colorText,
                                selected && styles.optionTextSelected,
                              ]}
                            >
                              {color}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Selection Summary */}
                {hasSelection && (
                  <View style={styles.selectionCard}>
                    <Text style={styles.selectionHeading}>
                      Your Selection
                    </Text>

                    {hasSizes && (
                      <Text style={styles.selectionText}>
                        Size: {selectedSize || 'Not selected'}
                      </Text>
                    )}

                    {hasColors && (
                      <Text style={styles.selectionText}>
                        Color: {selectedColor || 'Not selected'}
                      </Text>
                    )}

                    <Text style={styles.selectionNote}>
                      Selections are for preview only.
                    </Text>
                  </View>
                )}

                {/* Style Tags */}
                {shown.styleTags.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      Style
                    </Text>

                    <View style={styles.optionsRow}>
                      {shown.styleTags.map((tag) => (
                        <View key={tag} style={styles.styleChip}>
                          <Text style={styles.styleText}>
                            {tag}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Wishlist Button */}
                <Pressable
                  style={[
                    styles.wishlistButton,
                    productIsSaved && styles.savedButton,
                  ]}
                  onPress={handleWishlist}
                  accessibilityRole="button"
                  accessibilityLabel={
                    productIsSaved
                      ? 'Remove from wishlist'
                      : 'Save to wishlist'
                  }
                >
                  <Text
                    style={[
                      styles.heartIcon,
                      productIsSaved && styles.savedHeart,
                    ]}
                  >
                    {productIsSaved ? '\u2665' : '\u2661'}
                  </Text>

                  <Text
                    style={[
                      styles.wishlistText,
                      productIsSaved && styles.savedText,
                    ]}
                  >
                    {productIsSaved
                      ? 'Saved to Wishlist'
                      : 'Save to Wishlist'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>

            {/* Close Button */}
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
              >
                <Path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="#111111"
                  strokeWidth={2.25}
                  strokeLinecap="round"
                />
              </Svg>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  card: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },

  scrollContent: {
    paddingBottom: 8,
  },

  image: {
    width: '100%',
    aspectRatio: 5 / 6,
    backgroundColor: '#f0f0f0',
  },

  body: {
    padding: 20,
  },

  category: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  name: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },

  vendor: {
    marginTop: 6,
    fontSize: 14,
    color: '#777',
  },

  price: {
    marginTop: 18,
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
  },

  section: {
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },

  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  sizeChip: {
    minWidth: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sizeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  colorChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee',
  },

  colorText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
  },

  optionSelected: {
    backgroundColor: '#111',
    borderColor: '#111',
  },

  optionTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },

  selectionCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f7f7f7',
    gap: 6,
  },

  selectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },

  selectionText: {
    fontSize: 14,
    color: '#444',
  },

  selectionNote: {
    fontSize: 11,
    color: '#888',
    marginTop: 6,
  },

  styleChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#f2f2f2',
  },

  styleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555',
    textTransform: 'capitalize',
  },

  wishlistButton: {
    marginTop: 28,
    borderWidth: 1.5,
    borderColor: '#111',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  savedButton: {
    backgroundColor: '#fff0f2',
    borderColor: '#e63946',
  },

  heartIcon: {
    fontSize: 24,
    color: '#111',
  },

  savedHeart: {
    color: '#e63946',
  },

  wishlistText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },

  savedText: {
    color: '#e63946',
  },

  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },

  closeButtonPressed: {
    opacity: 0.7,
  },
});
