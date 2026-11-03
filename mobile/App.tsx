
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import Navbar, { type TabName } from './components/Navbar';
import ProductDetailSheet from './components/ProductDetailSheet';
import ProductFeed from './components/ProductFeed';
import SearchBar from './components/SearchBar';

import {
  Product,
  sampleProducts,
} from './data/sampleProducts';

import SavedItemsScreen from './src/screens/SavedItemsScreen';
import { SavedItemsProvider } from './src/saved/SavedItemsContext';

const NAV_HEIGHT = 56;
const NAV_MARGIN = 12;

function ClothingPlaceApp() {
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const insets = useSafeAreaInsets();

  const navBottom = Math.max(insets.bottom, NAV_MARGIN);
  const feedBottomPadding = navBottom + NAV_HEIGHT + 20;

  const openProduct = (productId: string) => {
    const product = sampleProducts.find(
      (item) => item.id === productId,
    );

    if (product) {
      setSelectedProduct(product);
    }
  };

  const showProducts =
    activeTab === 'Home' || activeTab === 'Discover';

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style="auto" />

      {showProducts && (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>ClothingPlace</Text>

            <Text style={styles.subtitle}>
              {activeTab === 'Discover'
                ? 'Discover independent clothing brands'
                : 'Find your next outfit'}
            </Text>

            <SearchBar
              value={query}
              onChangeText={setQuery}
              containerStyle={styles.searchBar}
            />
          </View>

          <ProductFeed
            query={query}
            onSelectProduct={setSelectedProduct}
            bottomPadding={feedBottomPadding}
          />
        </>
      )}

      {activeTab === 'Wishlist' && (
        <View
          style={[
            styles.screenContent,
            { paddingBottom: feedBottomPadding },
          ]}
        >
          <SavedItemsScreen
            onBrowse={() => setActiveTab('Discover')}
            onOpenProduct={openProduct}
          />
        </View>
      )}

      {activeTab === 'Profile' && (
        <View style={styles.placeholderScreen}>
          <Text style={styles.placeholderIcon}>👤</Text>

          <Text style={styles.placeholderTitle}>
            Your Profile
          </Text>

          <Text style={styles.placeholderText}>
            Account settings and personal style preferences
            are coming soon.
          </Text>
        </View>
      )}

      {/* Floating navigation bar */}
      <View
        style={[
          styles.navDock,
          { bottom: navBottom },
        ]}
      >
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </View>

      {/* Product details and Wishlist button */}
      <ProductDetailSheet
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SavedItemsProvider userId="demo-user">
        <ClothingPlaceApp />
      </SavedItemsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
  },

  subtitle: {
    marginTop: 4,
    color: '#666666',
    fontSize: 14,
  },

  searchBar: {
    marginTop: 16,
  },

  screenContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  placeholderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  placeholderIcon: {
    fontSize: 50,
    marginBottom: 16,
  },

  placeholderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
  },

  placeholderText: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
  },

  navDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    pointerEvents: 'box-none',
  },
});
