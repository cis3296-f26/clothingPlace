import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { sampleProducts } from '../../data/sampleProducts';
import { useProfile } from '../profile/ProfileContext';
import { useSavedItems } from '../saved/SavedItemsContext';

type Props = {
  onOpenWishlist?: () => void;
  onOpenProduct?: (productId: string) => void;
  bottomPadding?: number;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const RECENT_LIMIT = 4;

// Until the app reads from Supabase, the choices come from the sample catalog.
const STYLE_OPTIONS = unique(sampleProducts.flatMap((p) => p.styleTags));
const NEIGHBORHOOD_OPTIONS = unique(sampleProducts.map((p) => p.neighborhood));

function unique(values: string[]): string[] {
  return [...new Set(values)].sort();
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

function formatMemberSince(epochMs: number): string {
  const date = new Date(epochMs);
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export default function ProfileScreen({ onOpenWishlist, onOpenProduct, bottomPadding = 30 }: Props) {
  const { profile, hydrated, updateProfile, toggleStyleTag } = useProfile();
  const { items: savedItems, hydrated: savedHydrated } = useSavedItems();

  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftNeighborhood, setDraftNeighborhood] = useState('');

  const recentSaved = useMemo(
    () => [...savedItems].sort((a, b) => b.savedAt - a.savedAt).slice(0, RECENT_LIMIT),
    [savedItems],
  );

  const shopsNearby = useMemo(() => {
    const products = profile.neighborhood
      ? sampleProducts.filter((p) => p.neighborhood === profile.neighborhood)
      : sampleProducts;
    return new Set(products.map((p) => p.vendorName)).size;
  }, [profile.neighborhood]);

  if (!hydrated) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  const startEditing = () => {
    setDraftName(profile.displayName);
    setDraftNeighborhood(profile.neighborhood);
    setEditing(true);
  };

  const saveEdits = () => {
    updateProfile({ displayName: draftName, neighborhood: draftNeighborhood });
    setEditing(false);
  };

  const displayName = profile.displayName || 'Guest Shopper';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Profile</Text>
        {!editing && (
          <Pressable
            style={styles.editButton}
            onPress={startEditing}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        )}
      </View>

      {/* Identity card */}
      <View style={styles.identityCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initialsFor(editing ? draftName : profile.displayName)}</Text>
        </View>

        {editing ? (
          <View style={styles.editForm}>
            <Text style={styles.fieldLabel}>Display name</Text>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Your name"
              placeholderTextColor="#888"
              style={styles.input}
              maxLength={40}
              autoFocus
              returnKeyType="done"
              accessibilityLabel="Display name"
            />

            <Text style={[styles.fieldLabel, styles.fieldSpacing]}>Shop near</Text>
            <View style={styles.chipWrap}>
              {['', ...NEIGHBORHOOD_OPTIONS].map((hood) => {
                const selected = draftNeighborhood === hood;
                return (
                  <Pressable
                    key={hood || 'anywhere'}
                    onPress={() => setDraftNeighborhood(hood)}
                    style={[styles.chip, selected && styles.chipSelected]}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {hood || 'Anywhere'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.formActions}>
              <Pressable
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => setEditing(false)}
                accessibilityRole="button"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.formButton, styles.saveButton]}
                onPress={saveEdits}
                accessibilityRole="button"
              >
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.identityInfo}>
            <Text style={styles.name} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={styles.neighborhood}>
              {profile.neighborhood ? `📍 Shopping near ${profile.neighborhood}` : '📍 Shopping anywhere'}
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.rolePill}>
                <Text style={styles.rolePillText}>{titleCase(profile.role)}</Text>
              </View>
              <Text style={styles.memberSince}>Member since {formatMemberSince(profile.memberSince)}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <Pressable style={styles.statTile} onPress={onOpenWishlist} accessibilityRole="button">
          <Text style={styles.statValue}>{savedHydrated ? savedItems.length : '–'}</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </Pressable>
        <View style={styles.statTile}>
          <Text style={styles.statValue}>{profile.styleTags.length}</Text>
          <Text style={styles.statLabel}>Styles</Text>
        </View>
        <View style={styles.statTile}>
          <Text style={styles.statValue}>{shopsNearby}</Text>
          <Text style={styles.statLabel}>{profile.neighborhood ? 'Local shops' : 'Shops'}</Text>
        </View>
      </View>

      {/* Style preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your style</Text>
        <Text style={styles.sectionSubtitle}>
          Pick the styles you like and we'll use them to recommend clothing from local brands.
        </Text>
        <View style={styles.chipWrap}>
          {STYLE_OPTIONS.map((tag) => {
            const selected = profile.styleTags.includes(tag);
            return (
              <Pressable
                key={tag}
                onPress={() => toggleStyleTag(tag)}
                style={[styles.chip, selected && styles.chipSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`${titleCase(tag)} style`}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {selected ? '✓ ' : ''}
                  {titleCase(tag)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Recently saved */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recently saved</Text>
          {savedItems.length > 0 && onOpenWishlist && (
            <Pressable onPress={onOpenWishlist} hitSlop={8} accessibilityRole="button">
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          )}
        </View>

        {recentSaved.length === 0 ? (
          <Text style={styles.sectionSubtitle}>
            Nothing saved yet. Tap the heart on any product to keep it here.
          </Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentRow}>
            {recentSaved.map(({ product }) => {
              const imageUrl = sampleProducts.find((p) => p.id === product.id)?.imageUrl;
              return (
                <Pressable
                  key={product.id}
                  style={styles.recentCard}
                  onPress={() => onOpenProduct?.(product.id)}
                  accessibilityRole="button"
                  accessibilityLabel={product.name}
                >
                  {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.recentImage} />
                  ) : (
                    <View style={[styles.recentImage, { backgroundColor: product.colorHex || '#f0f0f0' }]} />
                  )}
                  <Text style={styles.recentName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text style={styles.recentPrice}>${product.price.toFixed(2)}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    marginTop: 12,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },

  identityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f7f7f7',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  identityInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
    minHeight: 64,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  neighborhood: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  rolePill: {
    backgroundColor: '#111',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  rolePillText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  memberSince: {
    fontSize: 12,
    color: '#8a8a8a',
  },

  editForm: {
    flex: 1,
    marginLeft: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldSpacing: {
    marginTop: 14,
  },
  input: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111',
    backgroundColor: '#fff',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  formButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
    marginLeft: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  cancelText: {
    color: '#111',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#111',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },

  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  statTile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e8e8e8',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
  },
  statLabel: {
    fontSize: 12,
    color: '#8a8a8a',
    marginTop: 2,
  },

  section: {
    marginTop: 28,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    lineHeight: 20,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    textDecorationLine: 'underline',
  },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  chipSelected: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  chipText: {
    fontSize: 14,
    color: '#555',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },

  recentRow: {
    paddingTop: 12,
    gap: 12,
  },
  recentCard: {
    width: 120,
  },
  recentImage: {
    width: 120,
    aspectRatio: 4 / 5,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  recentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginTop: 6,
  },
  recentPrice: {
    fontSize: 12,
    color: '#8a8a8a',
    marginTop: 3,
  },
});
