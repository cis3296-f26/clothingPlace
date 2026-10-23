import { FlatList, StyleSheet } from 'react-native';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export default function BrowseScreen() {
  return (
    <FlatList
      data={MOCK_PRODUCTS}
      keyExtractor={(p) => p.id}
      numColumns={2}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 10 },
});
