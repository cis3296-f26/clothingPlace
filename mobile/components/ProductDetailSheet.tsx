import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Product } from '../data/sampleProducts';
import { formatPrice } from '../utils/filterProducts';

type ProductDetailSheetProps = {
  product: Product | null;
  onClose: () => void;
};

// Popup card shown when you tap a product
// Everything behind it is dimmed
export default function ProductDetailSheet({
  product,
  onClose,
}: ProductDetailSheetProps) {
  return (
    <Modal
      visible={product !== null}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Tap outside the card to close it */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close product details"
        />

        {product && (
          <View style={styles.card}>
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
            >
              <Image
                source={{ uri: product.imageUrl }}
                style={styles.image}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
              />

              <View style={styles.body}>
                <Text style={styles.category}>{product.category}</Text>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.vendor}>
                  {product.vendorName} · {product.neighborhood}
                </Text>

                <View style={styles.tags}>
                  {product.styleTags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.price}>
                  {formatPrice(product.priceCents)}
                </Text>
              </View>
            </ScrollView>

            {/* Close button */}
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
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="#111111"
                  strokeWidth={2.25}
                  strokeLinecap="round"
                />
              </Svg>
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  name: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
  },
  vendor: {
    marginTop: 4,
    fontSize: 14,
    color: '#777777',
  },
  tags: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#f2f2f2',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555555',
    textTransform: 'capitalize',
  },
  price: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: '800',
    color: '#111111',
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
