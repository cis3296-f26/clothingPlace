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
  // Keep showing the product while the closing animation plays
  const [shown, setShown] = useState<Product | null>(null);

  // 0 is closed, 1 is fully open
  const progress = useRef(new Animated.Value(0)).current;

  const animateIn = () => {
    Animated.spring(progress, {
      toValue: 1,
      useNativeDriver: true,
      damping: 18,
      stiffness: 190,
      mass: 0.9,
    }).start();
  };

  useEffect(() => {
    if (product) {
      setShown(product);
      // Reopened while still closing, so there's no new mount to wait for
      if (shown) animateIn();
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

  // Wait until the popup is on screen before opening it
  useEffect(() => {
    if (shown && product) animateIn();
  }, [shown]);

  const fade = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });
  const lift = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [28, 0],
  });

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
          style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: fade }]}
        />

        {/* Tap outside the card to close it */}
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
            >
              <Image
                source={{ uri: shown.imageUrl }}
                style={styles.image}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
              />

              <View style={styles.body}>
                <Text style={styles.category}>{shown.category}</Text>
                <Text style={styles.name}>{shown.name}</Text>
                <Text style={styles.vendor}>
                  {shown.vendorName} · {shown.neighborhood}
                </Text>

                <View style={styles.tags}>
                  {shown.styleTags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.price}>
                  {formatPrice(shown.priceCents)}
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
