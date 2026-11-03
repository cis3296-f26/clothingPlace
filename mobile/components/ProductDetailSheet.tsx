import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Product } from '../data/sampleProducts';
import { formatPrice } from '../utils/filterProducts';

type ProductDetailSheetProps = {
  product: Product | null;
  onClose: () => void;
};

// Bottom sheet shown when a feed card is tapped. Uses a plain Modal so the
// app stays dependency-free; swap for a router screen when navigation lands.
export default function ProductDetailSheet({
  product,
  onClose,
}: ProductDetailSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={product !== null}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Tapping the dimmed area behind the sheet dismisses it. */}
        <Pressable
          style={styles.backdropFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close product details"
        />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          {product && (
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
            >
              <View style={styles.grabber} />

              <Image
                source={{ uri: product.imageUrl }}
                style={styles.image}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
              />

              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.vendor}>
                {product.vendorName} · {product.neighborhood}
              </Text>
              <Text style={styles.price}>
                {formatPrice(product.priceCents)}
              </Text>

              <View style={styles.tags}>
                {product.styleTags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.category}>{product.category}</Text>

              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
                accessibilityRole="button"
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backdropFill: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
    maxHeight: '85%',
  },
  content: {
    paddingBottom: 8,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d4d4d4',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  name: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },
  vendor: {
    marginTop: 4,
    fontSize: 14,
    color: '#777777',
  },
  price: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
  },
  tags: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  tagText: {
    fontSize: 12,
    color: '#555555',
  },
  category: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#111111',
    alignItems: 'center',
  },
  closeButtonPressed: {
    opacity: 0.8,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
