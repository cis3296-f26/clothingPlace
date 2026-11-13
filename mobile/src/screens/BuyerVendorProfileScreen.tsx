
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ProfileScreen from './ProfileScreen';
import VendorProfileScreen from './VendorProfileScreen';

type ProfileMode = 'buyer' | 'vendor';

type Props = {
  onOpenWishlist?: () => void;
  onOpenProduct?: (productId: string) => void;
  bottomPadding?: number;
};

export default function BuyerVendorProfileScreen({
  onOpenWishlist,
  onOpenProduct,
  bottomPadding = 30,
}: Props) {
  const [mode, setMode] = useState<ProfileMode>('buyer');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>

        <View style={styles.tabContainer}>
          <Pressable
            onPress={() => setMode('buyer')}
            style={[
              styles.tab,
              mode === 'buyer' && styles.activeTab,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === 'buyer' }}
          >
            <Text
              style={[
                styles.tabText,
                mode === 'buyer' && styles.activeTabText,
              ]}
            >
              Buyer
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setMode('vendor')}
            style={[
              styles.tab,
              mode === 'vendor' && styles.activeTab,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === 'vendor' }}
          >
            <Text
              style={[
                styles.tabText,
                mode === 'vendor' && styles.activeTabText,
              ]}
            >
              Vendor
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        {mode === 'buyer' ? (
          <ProfileScreen
            onOpenWishlist={onOpenWishlist}
            onOpenProduct={onOpenProduct}
            bottomPadding={bottomPadding}
          />
        ) : (
          <VendorProfileScreen />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    marginBottom: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 14,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 11,
  },
  activeTab: {
    backgroundColor: '#111',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#777',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
});
