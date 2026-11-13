
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type VendorProfile = {
  brandName: string;
  description: string;
  location: string;
};

type Props = {
  // Extra space at the bottom, like room for the floating navbar
  bottomPadding?: number;
};

const STORAGE_KEY = 'clothingplace:vendor-profile:demo-user';

export default function VendorProfileScreen({ bottomPadding = 20 }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [editing, setEditing] = useState(false);

  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    let active = true;

    async function loadVendor() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (stored && active) {
          const savedProfile: unknown = JSON.parse(stored);

          if (
            savedProfile !== null &&
            typeof savedProfile === 'object' &&
            'brandName' in savedProfile &&
            'description' in savedProfile &&
            'location' in savedProfile &&
            typeof savedProfile.brandName === 'string' &&
            typeof savedProfile.description === 'string' &&
            typeof savedProfile.location === 'string'
          ) {
            const validProfile: VendorProfile = {
              brandName: savedProfile.brandName,
              description: savedProfile.description,
              location: savedProfile.location,
            };

            setVendor(validProfile);
          }
        }
      } catch (error) {
        console.warn('Could not load vendor profile:', error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadVendor();

    return () => {
      active = false;
    };
  }, []);

  const saveVendor = async () => {
    const name = brandName.trim();
    const bio = description.trim();
    const city = location.trim();

    if (!name || !bio || !city) {
      Alert.alert(
        'Missing information',
        'Please complete all three fields to continue.'
      );
      return;
    }

    const updatedVendor: VendorProfile = {
      brandName: name,
      description: bio,
      location: city,
    };

    try {
      setSaving(true);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedVendor)
      );

      setVendor(updatedVendor);
      setEditing(false);
    } catch (error) {
      console.warn('Could not save vendor profile:', error);

      Alert.alert(
        'Unable to save',
        'Please try saving your vendor profile again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const startEditing = () => {
    if (!vendor) return;

    setBrandName(vendor.brandName);
    setDescription(vendor.description);
    setLocation(vendor.location);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111111" />
        <Text style={styles.loadingText}>
          Loading vendor profile...
        </Text>
      </View>
    );
  }

  // Registration form, also reused for editing
  if (!vendor || editing) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: bottomPadding },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.screenTitle}>
            {editing ? 'Edit Your Brand' : 'Become a Vendor'}
          </Text>

          <Text style={styles.screenSubtitle}>
            {editing
              ? 'Update your brand information below.'
              : 'Create your brand profile and connect with shoppers on ClothingPlace.'}
          </Text>

          <Text style={styles.label}>Brand name</Text>
          <TextInput
            style={styles.input}
            value={brandName}
            onChangeText={setBrandName}
            placeholder="e.g. Urban Threads"
            placeholderTextColor="#999"
            maxLength={60}
            autoCapitalize="words"
            accessibilityLabel="Brand name"
          />

          <Text style={styles.label}>Brand description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Tell shoppers about your brand..."
            placeholderTextColor="#999"
            multiline
            maxLength={300}
            textAlignVertical="top"
            accessibilityLabel="Brand description"
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Philadelphia, PA"
            placeholderTextColor="#999"
            autoCapitalize="words"
            maxLength={80}
            accessibilityLabel="Brand location"
          />

          <Pressable
            style={[
              styles.primaryButton,
              saving && styles.disabledButton,
            ]}
            onPress={saveVendor}
            disabled={saving}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>
              {saving
                ? 'Saving...'
                : editing
                  ? 'Save Changes'
                  : 'Create Vendor Profile'}
            </Text>
          </Pressable>

          {editing && (
            <Pressable
              style={styles.secondaryButton}
              onPress={cancelEditing}
              disabled={saving}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>
                Cancel
              </Text>
            </Pressable>
          )}

          <Text style={styles.footerNote}>
            You can continue shopping as a buyer while
            managing your vendor profile.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Registered vendor dashboard
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: bottomPadding },
      ]}
    >
      <Text style={styles.screenTitle}>Vendor Dashboard</Text>

      <Text style={styles.screenSubtitle}>
        Manage how your brand appears to shoppers.
      </Text>

      {/* Brand identity card */}
      <View style={styles.brandCard}>
        <View style={styles.brandHeader}>
          <View style={styles.brandAvatar}>
            <Text style={styles.brandInitial}>
              {vendor.brandName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.brandInfo}>
            <Text
              style={styles.brandName}
              numberOfLines={2}
            >
              {vendor.brandName}
            </Text>

            <Text style={styles.brandLocation}>
              {'\uD83D\uDCCD'} {vendor.location}
            </Text>

            <View style={styles.brandMetaRow}>
              <View style={styles.rolePill}>
                <Text style={styles.rolePillText}>Vendor</Text>
              </View>

              <Text style={styles.brandStatus}>Set up</Text>
            </View>
          </View>
        </View>

        <Text style={styles.brandDescription}>
          {vendor.description}
        </Text>
      </View>

      {/* Statistics */}
      <Text style={styles.sectionTitle}>
        Store Overview
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statTile}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Listings</Text>
        </View>

        <View style={styles.statTile}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>

        <View style={styles.statTile}>
          <Text style={styles.statValue}>$0</Text>
          <Text style={styles.statLabel}>Sales</Text>
        </View>
      </View>

      <Text style={styles.demoNote}>
        Demo placeholders — live listings, orders,
        and sales are not connected yet.
      </Text>

      {/* Management section */}
      <Text style={styles.sectionTitle}>
        Manage Your Store
      </Text>

      <View style={styles.managementCard}>
        <View style={styles.managementRow}>
          <View style={styles.managementInfo}>
            <Text style={styles.managementTitle}>
              Your Products
            </Text>
            <Text style={styles.managementSubtitle}>
              View your clothing listings
            </Text>
          </View>
          <Text style={styles.comingSoon}>Soon</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.managementRow}>
          <View style={styles.managementInfo}>
            <Text style={styles.managementTitle}>
              Add a Product
            </Text>
            <Text style={styles.managementSubtitle}>
              Create a new clothing listing
            </Text>
          </View>
          <Text style={styles.comingSoon}>Soon</Text>
        </View>

        <View style={styles.divider} />

        <Pressable
          style={styles.managementRow}
          onPress={startEditing}
          accessibilityRole="button"
          accessibilityLabel="Edit brand information"
        >
          <View style={styles.managementInfo}>
            <Text style={styles.managementTitle}>
              Edit Brand Information
            </Text>
            <Text style={styles.managementSubtitle}>
              Update your name, location, or description
            </Text>
          </View>
          <Text style={styles.chevron}>{'\u203A'}</Text>
        </Pressable>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          Keep Growing Your Brand
        </Text>
        <Text style={styles.muted}>
          Product uploads, order tracking, and sales
          management can be connected as ClothingPlace
          expands its marketplace features.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muted: {
    fontSize: 14,
    color: '#777',
    lineHeight: 22,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
  },
  // Screen header — the standard block from the design guide
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    lineHeight: 20,
  },
  // Brand identity card — same anatomy as the buyer identity card
  brandCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  brandAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandInitial: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  brandInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
    minHeight: 64,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },
  brandLocation: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  brandDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginTop: 16,
  },
  rolePill: {
    backgroundColor: '#111111',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  rolePillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  brandMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  brandStatus: {
    fontSize: 12,
    color: '#8a8a8a',
  },
  // Sections
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    marginTop: 28,
    marginBottom: 16,
  },
  // Stat tiles — outlines, no fill, no shadow
  statsRow: {
    flexDirection: 'row',
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
    color: '#111111',
  },
  statLabel: {
    fontSize: 12,
    color: '#8a8a8a',
    marginTop: 2,
  },
  demoNote: {
    fontSize: 11,
    color: '#999',
    marginTop: 10,
    marginBottom: 30,
    lineHeight: 17,
  },
  managementCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 26,
  },
  managementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  managementInfo: {
    flex: 1,
    paddingRight: 6,
  },
  managementTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
  },
  managementSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    lineHeight: 17,
  },
  comingSoon: {
    fontSize: 12,
    color: '#999',
  },
  chevron: {
    fontSize: 22,
    color: '#999999',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
  infoCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#111',
  },
  textArea: {
    minHeight: 110,
  },
  primaryButton: {
    backgroundColor: '#111',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 28,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  footerNote: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 16,
  },
});
