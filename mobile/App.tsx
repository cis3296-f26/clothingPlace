import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import Navbar from './components/Navbar';
import ProductDetailSheet from './components/ProductDetailSheet';
import ProductFeed from './components/ProductFeed';
import SearchBar from './components/SearchBar';
import { Product } from './data/sampleProducts';

function HomeScreen() {
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    // Left/right/top insets pad the header; the footer owns the bottom inset
    // so the navbar background extends under the home indicator.
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
      <ProductFeed query={query} onSelectProduct={setSelectedProduct} />

      {/* Bottom Navigation Bar */}
      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <Navbar />
      </SafeAreaView>

      <ProductDetailSheet
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  // initialWindowMetrics avoids a safe-area flash on first render.
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
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e5e5',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
