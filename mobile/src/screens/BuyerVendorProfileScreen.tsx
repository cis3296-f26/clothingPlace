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

const MODES: { key: ProfileMode; label: string }[] = [
  { key: 'buyer', label: 'Buyer' },
  { key: 'vendor', label: 'Vendor' },
];

export default function BuyerVendorProfileScreen({
  onOpenWishlist,
  onOpenProduct,
  bottomPadding = 20,
}: Props) {
  const [mode, setMode] = useState<ProfileMode>('buyer');

  return (
    <View style={styles.container}>
      {/*
        A single mode switch pinned above both screens. Each screen below
        renders its own 28/700 header, so only one title is ever on screen.
      */}
      <View style={styles.switcherWrap}>
        <View style={styles.track} accessibilityRole="tablist">
          {MODES.map(({ key, label }) => {
            const selected = mode === key;

            return (
              <Pressable
                key={key}
                onPress={() => setMode(key)}
                style={[styles.tab, selected && styles.tabSelected]}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={`${label} profile`}
              >
                <Text
                  style={[
                    styles.tabText,
                    selected && styles.tabTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
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
