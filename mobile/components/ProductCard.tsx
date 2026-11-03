import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../data/sampleProducts';
import { formatPrice } from '../utils/filterProducts';

type ProductCardProps = {
  product: Product;
  onPress?: (product: Product) => void;
};

// A product in the grid: photo, name, vendor and price
// The shadow and the rounded corners are on separate views on purpose
export default function ProductCard({ product, onPress }: ProductCardProps) {
  const { name, vendorName, neighborhood, priceCents, styleTags, imageUrl } =
    product;
  const primaryTag = styleTags[0];

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress?.(product)}
      accessibilityRole="button"
      accessibilityLabel={`${name} by ${vendorName} in ${neighborhood}, ${formatPrice(priceCents)}`}
    >
      <View style={styles.clip}>
        <View>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
          {primaryTag && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{primaryTag}</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.vendor} numberOfLines={1}>
            {vendorName} · {neighborhood}
          </Text>
          <Text style={styles.price}>{formatPrice(priceCents)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const CARD_RADIUS = 16;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: CARD_RADIUS,
    // White background so the shadow shows up
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  clip: {
    flex: 1,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e8e8e8',
  },
  image: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#f0f0f0',
  },
  // Style label on top of the photo
  tag: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333333',
    textTransform: 'capitalize',
  },
  body: {
    flex: 1,
    padding: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    color: '#111111',
  },
  vendor: {
    marginTop: 3,
    fontSize: 12,
    color: '#8a8a8a',
  },
  price: {
    marginTop: 'auto',
    paddingTop: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
});
