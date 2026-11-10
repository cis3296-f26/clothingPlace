import { StyleSheet, Text, View } from 'react-native';
import { Product } from '../types/product';
import SaveButton from './SaveButton';

const CARD_RADIUS = 16;

// Same anatomy as components/ProductCard: shadow view -> clip -> image -> body.
// The color swatch stands in for a photo until vendors upload real images.
export default function ProductCard({ product }: { product: Product }) {
  return (
    <View style={styles.card}>
      <View style={styles.clip}>
        <View style={[styles.image, { backgroundColor: product.colorHex }]}>
          <View style={styles.saveSlot}>
            <SaveButton product={product} />
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.vendor} numberOfLines={1}>{product.vendorName}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  image: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#f0f0f0',
  },
  saveSlot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  info: {
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
