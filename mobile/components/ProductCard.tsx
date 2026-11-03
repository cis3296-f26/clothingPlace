import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../data/sampleProducts';
import { formatPrice } from '../utils/filterProducts';

type ProductCardProps = {
  product: Product;
  onPress?: (product: Product) => void;
};

// One listing in the feed grid: photo, name, vendor + neighborhood, price,
// and a couple of style tags. Tapping it will open the product detail screen.
export default function ProductCard({ product, onPress }: ProductCardProps) {
  const { name, vendorName, neighborhood, priceCents, styleTags, imageUrl } =
    product;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress?.(product)}
      accessibilityRole="button"
      accessibilityLabel={`${name} by ${vendorName} in ${neighborhood}, ${formatPrice(priceCents)}`}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.vendor} numberOfLines={1}>
          {vendorName} · {neighborhood}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(priceCents)}</Text>
          <View style={styles.tags}>
            {styleTags.slice(0, 2).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eeeeee',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardPressed: {
    opacity: 0.85,
  },
  image: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#f0f0f0',
  },
  body: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  vendor: {
    marginTop: 2,
    fontSize: 12,
    color: '#777777',
  },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  tags: {
    flexDirection: 'row',
    gap: 4,
    flexShrink: 1,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  tagText: {
    fontSize: 10,
    color: '#555555',
  },
});
