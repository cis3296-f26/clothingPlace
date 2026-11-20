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
 * Publishing: the button enables once photo, name, price and category are
 * filled in, then hands the listing to `onPublish`. The dashboard saves it on
 * this device for now; it should go to Supabase once the app is connected.
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

import PhotoSourceSheet from '../src/components/PhotoSourceSheet';
import WebcamCapture from '../src/components/WebcamCapture';
import { PhotoSource, usePhotoPicker } from '../src/media/usePhotoPicker';
import type { VendorListing } from '../src/vendor/listingsStorage';

type Props = {
  visible: boolean;
  onClose: () => void;
  // Called with the finished listing when the vendor taps Publish
  onPublish: (listing: VendorListing) => Promise<void> | void;
};

// Product photos display at 4:3 in this sheet, so photos are cropped to match
const PHOTO_ASPECT: [number, number] = [4, 3];

const CATEGORIES = ['Outerwear', 'Tops', 'Bottoms', 'Accessories', 'Shoes'];

const STYLE_TAGS = [
  'vintage',
  'streetwear',
  'minimalist',
  'workwear',
  'athleisure',
];

// Keeps the price field to something parseable: digits, one dot, 2 decimals.
function normalizePrice(input: string): string {
  const cleaned = input.replace(/[^0-9.]/g, '');
  const [whole, ...rest] = cleaned.split('.');

  if (rest.length === 0) return whole.slice(0, 6);

  return `${whole.slice(0, 6)}.${rest.join('').slice(0, 2)}`;
}

export default function VendorPopupCard({
  visible,
  onClose,
  onPublish,
}: Props) {

  const [shown, setShown] = useState(visible);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [priceText, setPriceText] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [styleTags, setStyleTags] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Camera and photo library
  const photoPicker = usePhotoPicker({ aspect: PHOTO_ASPECT });
  const [photoSheetVisible, setPhotoSheetVisible] = useState(false);
  const [webcamVisible, setWebcamVisible] = useState(false);

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
  const priceCents = Math.round((Number.parseFloat(priceText) || 0) * 100);
  const trimmedName = name.trim();

  const requiredDone = [
    photoUri !== null,
    trimmedName.length > 0,
    priceCents > 0,
    category !== null,
  ].filter(Boolean).length;

  // What's still needed before the listing can be published
  const missing = [
    photoUri === null && 'a photo',
    trimmedName.length === 0 && 'a name',
    priceCents <= 0 && 'a price',
    category === null && 'a category',
  ].filter((item): item is string => typeof item === 'string');

  const canPublish = missing.length === 0;
  const [publishing, setPublishing] = useState(false);

  const resetForm = () => {
    setPhotoUri(null);
    setName('');
    setPriceText('');
    setCategory(null);
    setStyleTags([]);
    setDescription('');
    photoPicker.clearError();
  };

  const handlePublish = async () => {
    if (!canPublish || publishing || photoUri === null || category === null) return;

    setPublishing(true);
    try {
      await onPublish({
        id: `${Date.now()}`,
        photoUri,
        name: trimmedName,
        priceCents,
        category,
        styleTags,
        description: description.trim(),
        createdAt: Date.now(),
      });
      resetForm();
      onClose();
    } catch (error) {
      console.warn('Could not publish listing:', error);
    } finally {
      setPublishing(false);
    }
  };

  const requestClose = () => {
    onClose();
  };

  const handlePhotoPress = () => {
    photoPicker.clearError();
    setPhotoSheetVisible(true);
  };

  const choosePhoto = async (source: PhotoSource) => {
    // Desktop browsers open a file picker for "camera", so use the webcam screen instead
    if (source === 'camera' && Platform.OS === 'web') {
      setWebcamVisible(true);
      return;
    }

    const uri = await photoPicker.pickPhoto(source);
    if (uri) setPhotoUri(uri);
  };

  const toggleTag = (tag: string) => {
    setStyleTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
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

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

            {/* Progress — four required things, counted out loud */}
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(requiredDone / 4) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressLabel}>{requiredDone} of 4</Text>
            </View>

            <Text style={styles.label}>Photo</Text>

            {photoUri ? (
              <View style={styles.photoClip}>
                <Image
                  source={{ uri: photoUri }}
                  style={styles.photo}
                  resizeMode="cover"
                  accessibilityIgnoresInvertColors
                />
                <Pressable
                  onPress={() => setPhotoUri(null)}
                  style={({ pressed }) => [
                    styles.removePhoto,
                    pressed && styles.pressed,
                  ]}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Remove photo"
                >
                  {closeIcon}
                </Pressable>
                <Pressable
                  onPress={handlePhotoPress}
                  style={({ pressed }) => [
                    styles.changePhoto,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Change photo"
                >
                  <Text style={styles.changePhotoText}>Change photo</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={handlePhotoPress}
                style={({ pressed }) => [
                  styles.dropzone,
                  pressed && styles.dropzonePressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Add a product photo"
              >
                <Text style={styles.dropzoneGlyph}>
                  {photoPicker.busy ? '…' : '+'}
                </Text>
                <Text style={styles.dropzoneTitle}>Add a photo</Text>
                <Text style={styles.dropzoneHint}>
                  Use your camera or photo library
                </Text>
              </Pressable>
            )}

            {/* Camera permission or picker problem */}
            {photoPicker.error && (
              <View style={styles.photoError} accessibilityRole="alert">
                <Text style={styles.photoErrorText}>
                  {photoPicker.error.message}
                </Text>
                <View style={styles.photoErrorActions}>
                  {photoPicker.error.canOpenSettings && (
                    <Pressable
                      onPress={photoPicker.openSettings}
                      accessibilityRole="button"
                      hitSlop={8}
                    >
                      <Text style={styles.photoErrorLink}>Open Settings</Text>
                    </Pressable>
                  )}
                  <Pressable
                    onPress={photoPicker.clearError}
                    accessibilityRole="button"
                    hitSlop={8}
                  >
                    <Text style={styles.photoErrorDismiss}>Dismiss</Text>
                  </Pressable>
                </View>
              </View>
            )}

            <Text style={styles.label}>Product name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Washed Denim Jacket"
              placeholderTextColor="#888888"
              style={[
                styles.input,
                focusedField === 'name' && styles.inputFocused,
              ]}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              maxLength={60}
              autoCapitalize="words"
              accessibilityLabel="Product name"
            />

            <Text style={styles.label}>Price</Text>
            <View
              style={[
                styles.priceRow,
                focusedField === 'price' && styles.inputFocused,
              ]}
            >
              <Text style={styles.pricePrefix}>$</Text>
              <TextInput
                value={priceText}
                onChangeText={(text) => setPriceText(normalizePrice(text))}
                placeholder="0.00"
                placeholderTextColor="#888888"
                style={styles.priceInput}
                onFocus={() => setFocusedField('price')}
                onBlur={() => setFocusedField(null)}
                keyboardType="decimal-pad"
                maxLength={9}
                accessibilityLabel="Price in dollars"
              />
            </View>

            <Text style={styles.label}>Category</Text>
            <View style={styles.chips}>
              {CATEGORIES.map((option) => {
                const selected = category === option;

                return (
                  <Pressable
                    key={option}
                    onPress={() => setCategory(selected ? null : option)}
                    style={[styles.chip, selected && styles.chipSelected]}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${option} category`}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Style tags</Text>
            <Text style={styles.tagHint}>Optional — helps shoppers find it.</Text>
            <View style={styles.chips}>
              {STYLE_TAGS.map((tag) => {
                const selected = styleTags.includes(tag);

                return (
                  <Pressable
                    key={tag}
                    onPress={() => toggleTag(tag)}
                    style={[styles.chip, selected && styles.chipSelected]}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${tag} style`}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {tag}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Fabric, fit, sizing, anything a shopper should know."
              placeholderTextColor="#888888"
              style={[
                styles.input,
                styles.textArea,
                focusedField === 'description' && styles.inputFocused,
              ]}
              onFocus={() => setFocusedField('description')}
              onBlur={() => setFocusedField(null)}
              multiline
              maxLength={300}
              textAlignVertical="top"
              accessibilityLabel="Product description"
            />

          </ScrollView>

          {/* Publish — disabled until the four required fields are done */}
          <View style={styles.footer}>
            <Text
              style={[styles.footerHint, canPublish && styles.footerReady]}
              accessibilityLiveRegion="polite"
            >
              {canPublish
                ? 'Ready to publish'
                : `Still need ${missing.join(', ')}`}
            </Text>
            <Pressable
              onPress={handlePublish}
              disabled={!canPublish || publishing}
              style={({ pressed }) => [
                styles.publishButton,
                (!canPublish || publishing) && styles.publishDisabled,
                pressed && canPublish && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Publish listing"
              accessibilityState={{ disabled: !canPublish || publishing }}
            >
              <Text style={styles.publishText}>
                {publishing ? 'Publishing…' : 'Publish'}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Rendered inside this Modal so they stack on top of the upload sheet */}
      <PhotoSourceSheet
        visible={photoSheetVisible}
        title="Product photo"
        hasPhoto={photoUri !== null}
        onSelect={choosePhoto}
        onRemove={() => setPhotoUri(null)}
        onClose={() => setPhotoSheetVisible(false)}
      />

      <WebcamCapture
        visible={webcamVisible}
        title="Photograph your product"
        aspect={PHOTO_ASPECT[0] / PHOTO_ASPECT[1]}
        facing="environment"
        onCapture={setPhotoUri}
        onClose={() => setWebcamVisible(false)}
      />
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
  scroll: {
    flexShrink: 1,
  },
  body: {
    padding: 20,
  },
  // Footer — stays below the scrolling form
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e8e8e8',
    backgroundColor: '#ffffff',
  },
  footerHint: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#8a8a8a',
  },
  footerReady: {
    color: '#111111',
    fontWeight: '600',
  },
  publishButton: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#111111',
  },
  publishDisabled: {
    backgroundColor: '#cccccc',
  },
  publishText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  // Progress
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 999,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#111111',
  },
  progressLabel: {
    fontSize: 12,
    color: '#8a8a8a',
  },
  // Labels
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 20,
  },
  tagHint: {
    fontSize: 13,
    color: '#777777',
    marginTop: -4,
    marginBottom: 10,
  },
  // Photo dropzone
  dropzone: {
    height: 148,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#dddddd',
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dropzonePressed: {
    backgroundColor: '#f2f2f2',
  },
  dropzoneGlyph: {
    fontSize: 24,
    fontWeight: '700',
    color: '#999999',
    marginBottom: 2,
  },
  dropzoneTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
  },
  dropzoneHint: {
    fontSize: 12,
    color: '#8a8a8a',
  },
  photoError: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff4e5',
  },
  photoErrorText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#6b4500',
  },
  photoErrorActions: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  photoErrorLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
  },
  photoErrorDismiss: {
    fontSize: 13,
    color: '#666666',
  },
  photoClip: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e8e8e8',
    backgroundColor: '#f0f0f0',
  },
  photo: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  removePhoto: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  changePhoto: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  changePhotoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },
  // Inputs — outlines, per the guide
  input: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111111',
  },
  inputFocused: {
    borderColor: '#111111',
  },
  textArea: {
    minHeight: 96,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  pricePrefix: {
    fontSize: 16,
    color: '#8a8a8a',
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111111',
  },
  // Chips
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f2f2f2',
  },
  chipSelected: {
    backgroundColor: '#111111',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555555',
    textTransform: 'capitalize',
  },
  chipTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
