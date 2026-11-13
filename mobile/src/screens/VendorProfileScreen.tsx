
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
        <ActivityIndicator size="large" color="#111" />
        <Text style={styles.muted}>
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
          <View style={styles.welcomeCard}>
            <Text style={styles.storeIcon}>
              {'\uD83C\uDFEA'}
            </Text>

            <Text style={styles.welcomeTitle}>
              {editing ? 'Edit Your Brand' : 'Become a Vendor'}
            </Text>

            <Text style={styles.muted}>
              {editing
                ? 'Update your brand information below.'
                : 'Create your brand profile and connect with shoppers on ClothingPlace.'}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            {editing
              ? 'Brand Information'
              : 'Tell us about your brand'}
          </Text>

          <Text style={styles.label}>BRAND NAME</Text>
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

          <Text style={styles.label}>BRAND DESCRIPTION</Text>
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

          <Text style={styles.label}>LOCATION</Text>
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
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>
            {'\uD83D\uDC55'}
          </Text>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Listings</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>
            {'\uD83D\uDCE6'}
          </Text>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>
            {'\uD83D\uDCB0'}
          </Text>
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
          <Text style={styles.managementIcon}>
            {'\uD83D\uDCE6'}
          </Text>
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
          <Text style={styles.managementIcon}>
            {'\u2795'}
          </Text>
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
          <Text style={styles.managementIcon}>
            {'\u270F\uFE0F'}
          </Text>
          <View style={styles.managementInfo}>
            <Text style={styles.managementTitle}>
              Edit Brand Information
            </Text>
            <Text style={styles.managementSubtitle}>
              Update your name, location, or description
            </Text>
          </View>
          <Text style={styles.arrow}>{'\u203A'}</Text>
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
    padding: 20,
  },
  muted: {
    fontSize: 14,
    color: '#777',
    lineHeight: 22,
    textAlign: 'center',
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
  brandCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandAvatar: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  brandInitial: {
    color: '#fff',
    fontSize: 27,
    fontWeight: '800',
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },
  brandLocation: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
  },
  brandDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 21,
    marginTop: 18,
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
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 21,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 23,
    fontWeight: '800',
    color: '#111',
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
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
  managementIcon: {
    fontSize: 22,
    width: 36,
  },
  managementInfo: {
    flex: 1,
    paddingRight: 6,
  },
  managementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
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
  arrow: {
    fontSize: 27,
    color: '#999',
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
  welcomeCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
  },
  storeIcon: {
    fontSize: 42,
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#111',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 14,
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
