import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSavedItems } from '../saved/SavedItemsContext';
import { SavedItem } from '../types/product';

type Props = {
  // Wire these up once Cart and the product detail page exist.
  onAddToCart?: (item: SavedItem) => void;
  onOpenProduct?: (productId: string) => void;
  onBrowse?: () => void;
};

export default function SavedItemsScreen({ onAddToCart, onOpenProduct, onBrowse }: Props) {
  const { items, hydrated, remove } = useSavedItems();

  if (!hydrated) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>Nothing saved yet</Text>
        <Text style={styles.emptyBody}>Tap the ♡ on any item to save it for later.</Text>
        {onBrowse && (
          <Pressable style={styles.primary} onPress={onBrowse}>
            <Text style={styles.primaryText}>Browse items</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(i) => i.productId}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<Text style={styles.count}>{items.length} saved</Text>}
      renderItem={({ item }) => {
        const p = item.product;
        return (
          <Pressable style={styles.row} onPress={() => onOpenProduct?.(p.id)}>
            <View style={[styles.thumb, { backgroundColor: p.colorHex }]} />
            <View style={styles.info}>
              <Text style={styles.vendor}>{p.vendorName}</Text>
              <Text style={styles.name} numberOfLines={1}>{p.name}</Text>
              <Text style={styles.meta}>{p.color} · ${p.price.toFixed(2)}</Text>
              <View style={styles.actions}>
                {onAddToCart && (
                  <Pressable style={styles.primarySmall} onPress={() => onAddToCart(item)}>
                    <Text style={styles.primaryText}>Add to cart</Text>
                  </Pressable>
                )}
                <Pressable onPress={() => remove(p.id)} hitSlop={8}>
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '600' },
  emptyBody: { marginTop: 6, color: '#666', textAlign: 'center' },
  list: { padding: 16 },
  count: { color: '#666', marginBottom: 8 },
  row: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  thumb: { width: 84, height: 100, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12 },
  vendor: { fontSize: 12, color: '#777' },
  name: { fontSize: 16, fontWeight: '600', marginTop: 2 },
  meta: { fontSize: 14, color: '#444', marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 10 },
  primary: { marginTop: 16, backgroundColor: '#111', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  primarySmall: { backgroundColor: '#111', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  primaryText: { color: '#fff', fontWeight: '600' },
  removeText: { color: '#D7263D', fontWeight: '500' },
});
