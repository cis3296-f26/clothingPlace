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
  bottomPadding = 20,
}: Props) {
  const [mode, setMode] = useState<ProfileMode>('buyer');

  return (
    <View style={styles.container}>
      <View style={styles.switcherWrap}>
        <View style={styles.track}>
          <Pressable
            onPress={() => setMode('buyer')}
            style={[
              styles.tab,
              mode === 'buyer' && styles.tabSelected,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === 'buyer' }}
          >
            <Text
              style={[
                styles.tabText,
                mode === 'buyer' && styles.tabTextSelected,
              ]}
            >
              Buyer
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setMode('vendor')}
            style={[
              styles.tab,
              mode === 'vendor' && styles.tabSelected,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === 'vendor' }}
          >
            <Text
              style={[
                styles.tabText,
                mode === 'vendor' && styles.tabTextSelected,
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
          <VendorProfileScreen bottomPadding={bottomPadding} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  switcherWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  track: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 999,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 999,
  },
  tabSelected: {
    backgroundColor: '#111111',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
  },
  tabTextSelected: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
});
