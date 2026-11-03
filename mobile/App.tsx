import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Navbar from './components/Navbar';
import ProductDetailSheet from './components/ProductDetailSheet';
import ProductFeed from './components/ProductFeed';
import SearchBar from './components/SearchBar';
import { Product } from './data/sampleProducts';

// Rough height of the floating navbar, and the gap below it
const NAV_HEIGHT = 56;
const NAV_MARGIN = 12;

function HomeScreen() {
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const insets = useSafeAreaInsets();

  // The navbar floats over the feed, so leave room for it at the bottom
  const navBottom = Math.max(insets.bottom, NAV_MARGIN);
  const feedBottomPadding = navBottom + NAV_HEIGHT + 16;

  return (
    // The navbar looks after the bottom edge itself
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="auto" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>ClothingPlace</Text>
        <Text style={styles.subtitle}>Find your next outfit</Text>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          containerStyle={styles.searchBar}
        />
      </View>

      {/* Listings */}
      <ProductFeed
        query={query}
        onSelectProduct={setSelectedProduct}
        bottomPadding={feedBottomPadding}
      />

      {/* Floating navbar */}
      <View style={[styles.navDock, { bottom: navBottom }]}>
        <Navbar />
      </View>

      <ProductDetailSheet
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  // Lets the app know about notches and the home bar
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <HomeScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#fff',
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
  },
  searchBar: {
    marginTop: 16,
  },
  navDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    pointerEvents: 'box-none',
  },
});
