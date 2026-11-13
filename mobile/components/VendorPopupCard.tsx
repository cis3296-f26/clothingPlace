/**
 * VendorPopupCard — the "upload a product" popup vendors see from the
 * Vendor Dashboard.
 *
 * Design notes (matches DesignStyleGuide.md):
 * - It is a full sheet, not a small dialog: a listing needs a photo, a name,
 *   a category and a price. Sheet geometry is copied from ProductDetailSheet
 *   (radius 24, shadowSheet, spring in at damping 18 / stiffness 190).
 * - Photo comes first. A fashion listing is a photo with details attached,
 *   so the dropzone is the only large element in the form.
 * - The destructive/error affordance is value, not colour: the publish button
 *   stays disabled and the footer tells you exactly what is still missing.
 *   `accent` stays reserved for the wishlist heart.
 * - Field labels use the 12/600 uppercase label spec; chips use the pill spec.
 *
 * Scope: UI and the opening view. Publishing is not wired up yet — the
 * button renders and enables on a complete form, but the upload call and the
 *
 * Scope: sheet shell, header and the fields committed so far.
 */
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Props = {
  visible: boolean;
  onClose: () => void;
  /**
   * Swap in `expo-image-picker` here. Without it the dropzone walks through
   * demo photos so the design stays explorable.
   */
  onPickPhoto?: () => void;
};

export default function VendorPopupCard({
  visible,
  onClose,
  onPickPhoto,
}: Props) {

  const [shown, setShown] = useState(visible);

  // Sheet motion — same spec as ProductDetailSheet.
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShown(true);
      return;
    }

    Animated.timing(progress, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setShown(false);
    });
  }, [visible]);

  useEffect(() => {
    if (shown && visible) {
      progress.setValue(0);
      Animated.spring(progress, {
        toValue: 1,
        useNativeDriver: true,
        damping: 18,
        stiffness: 190,
        mass: 0.9,
      }).start();
    }
  }, [shown, visible]);

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

  const requestClose = () => {
    onClose();
  };

  const closeIcon = (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 6l12 12M18 6L6 18"
        stroke="#111111"
        strokeWidth={2.25}
        strokeLinecap="round"
      />
    </Svg>
  );

  return (
    <Modal
      visible={shown}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={requestClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: fade }]}
        />

        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={requestClose}
          accessibilityRole="button"
          accessibilityLabel="Close upload"
        />

        <Animated.View
          style={[
            styles.card,
            {
              opacity: fade,
              transform: [{ translateY: lift }, { scale }],
            },
          ]}
        >
          <Pressable
            onPress={requestClose}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.pressed,
            ]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            {closeIcon}
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.eyebrow}>New listing</Text>
            <Text style={styles.title}>Upload a product</Text>
            <Text style={styles.subtitle}>
              Add a photo and the details shoppers need. It appears in the
              feed as soon as you publish.
            </Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
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
    maxHeight: '90%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  // Close — sits over the sheet header, not over a photo
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    paddingRight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});
