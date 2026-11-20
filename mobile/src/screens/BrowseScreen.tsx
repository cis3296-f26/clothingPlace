import { FlatList, StyleSheet, Text, View } from 'react-native';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../data/mockProducts';

type Props = {
  // Extra space at the bottom, like room for the floating navbar
  bottomPadding?: number;
};

export default function BrowseScreen({ bottomPadding = 20 }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Browse</Text>
        <Text style={styles.subtitle}>
          Independent clothing brands near you
        </Text>
      </View>

      <FlatList
        data={MOCK_PRODUCTS}
        keyExtractor={(p) => p.id}
        numColumns={2}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomPadding },
        ]}
        columnWrapperStyle={styles.columns}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </View>
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
    fontSize: 14,
    color: '#666666',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  columns: {
    gap: 16,
  },
});
