
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

export type VendorProfile = {
  brandName: string;
  description: string;
  location: string;
};

const STORAGE_KEY = 'clothingplace:vendor-profile:demo-user';

export default function VendorProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);

  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    let active = true;

    async function loadVendor() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (stored && active) {
          const savedProfile = JSON.parse(stored) as VendorProfile;

          if (
            typeof savedProfile.brandName === 'string' &&
            typeof savedProfile.description === 'string' &&
            typeof savedProfile.location === 'string'
          ) {
            setVendor(savedProfile);
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

  const createVendor = async () => {
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

    const newVendor: VendorProfile = {
      brandName: name,
      description: bio,
      location: city,
    };

    try {
      setSaving(true);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(newVendor)
      );

      setVendor(newVendor);
    } catch (error) {
      console.warn('Could not save vendor profile:', error);

      Alert.alert(
        'Unable to save',
        'Please try creating your vendor profile again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111" />
        <Text style={styles.muted}>Loading vendor profile...</Text>
      </View>
    );
  }

  if (vendor) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.heading}>Vendor Profile</Text>

        <View style={styles.successCard}>
          <Text style={styles.successIcon}>{'\u2713'}</Text>
          <Text style={styles.successTitle}>
            Your vendor profile is ready!
          </Text>
          <Text style={styles.muted}>
            Your brand information has been saved.
          </Text>
        </View>

        <View style={styles.brandCard}>
          <Text style={styles.label}>YOUR BRAND</Text>

          <Text style={styles.brandName}>
            {vendor.brandName}
          </Text>

          <Text style={styles.brandLocation}>
            {'\uD83D\uDCCD'} {vendor.location}
          </Text>

          <Text style={styles.brandDescription}>
            {vendor.description}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          What's next?
        </Text>

        <Text style={styles.muted}>
          Your vendor dashboard, product listings, and
          management tools will appear here.
        </Text>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.welcomeCard}>
          <Text style={styles.storeIcon}>
            {'\uD83C\uDFEA'}
          </Text>

          <Text style={styles.welcomeTitle}>
            Become a Vendor
          </Text>

          <Text style={styles.muted}>
            Turn your passion for fashion into a business.
            Create your brand profile and start connecting
            with shoppers on ClothingPlace.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Tell us about your brand
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
          placeholder="Tell shoppers about your clothing brand..."
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
          onPress={createVendor}
          disabled={saving}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>
            {saving ? 'Creating Profile...' : 'Create Vendor Profile'}
          </Text>
        </Pressable>

        <Text style={styles.footerNote}>
          You can continue shopping as a buyer while
          managing your vendor profile.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    marginBottom: 20,
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
  muted: {
    fontSize: 14,
    lineHeight: 22,
    color: '#777',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111',
    marginBottom: 18,
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
  footerNote: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 16,
  },
  successCard: {
    backgroundColor: '#f2f8f3',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    marginBottom: 22,
  },
  successIcon: {
    fontSize: 36,
    color: '#237a42',
    fontWeight: '800',
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
    textAlign: 'center',
  },
  brandCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },
  brandLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  brandDescription: {
    fontSize: 14,
    color: '#444',
    marginTop: 16,
    lineHeight: 22,
  },
});
