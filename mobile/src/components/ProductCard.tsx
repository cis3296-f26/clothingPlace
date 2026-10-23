import { StyleSheet, Text, View } from 'react-native';
import { Product } from '../types/product';
import SaveButton from './SaveButton';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <View style={styles.card}>
      {/* Color swatch stands in for the product image for now */}
      <View style={[styles.image, { backgroundColor: product.colorHex }]}>
        <View style={styles.saveSlot}>
          <SaveButton product={product} />
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.vendor}>{product.vendorName}</Text>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, margin: 6, borderRadius: 12, backgroundColor: '#fff', overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  image: { height: 150 },
  saveSlot: { position: 'absolute', top: 8, right: 8, backgroundColor: '#ffffffdd', borderRadius: 20 },
  info: { padding: 10 },
  vendor: { fontSize: 12, color: '#777' },
  name: { fontSize: 15, fontWeight: '600', marginTop: 2 },
  price: { fontSize: 14, marginTop: 4 },
});
