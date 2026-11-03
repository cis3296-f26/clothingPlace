import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SearchBar from './SearchBar';
import { sampleProducts } from '../data/sampleProducts';
import { filterProducts, formatPrice } from '../utils/filterProducts';

export default function ProductSearch() {
  const [query, setQuery] = useState('');
  const results = filterProducts(sampleProducts, query);

  return (
    <View>
      <SearchBar value={query} onChangeText={setQuery} />

      {query.trim() === '' ? (
        <Text style={styles.hint}>Try "denim", "vintage", or a brand name.</Text>
      ) : results.length === 0 ? (
        <Text style={styles.hint}>No results for "{query.trim()}".</Text>
      ) : (
        <View style={styles.results}>
          {results.map((p) => (
            <View key={p.id} style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.name}>{p.name}</Text>
                <Text style={styles.meta}>
                  {p.vendorName} · {p.category}
                </Text>
              </View>
              <Text style={styles.price}>{formatPrice(p.priceCents)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: 12,
    color: '#666',
  },
  results: {
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  rowText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    marginTop: 2,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
});
