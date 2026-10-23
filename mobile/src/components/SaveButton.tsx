import { Pressable, StyleSheet, Text } from 'react-native';
import { Product } from '../types/product';
import { useSavedItems } from '../saved/SavedItemsContext';

type Props = { product: Product; size?: number };

// Drop this on any product card or detail page.
export default function SaveButton({ product, size = 22 }: Props) {
  const { isSaved, toggle } = useSavedItems();
  const saved = isSaved(product.id);

  return (
    <Pressable
      onPress={() => toggle(product)}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityState={{ selected: saved }}
      accessibilityLabel={saved ? `Remove ${product.name} from saved` : `Save ${product.name} for later`}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={[styles.icon, { fontSize: size, color: saved ? '#D7263D' : '#222' }]}>
        {saved ? '♥' : '♡'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 4 },
  pressed: { opacity: 0.5 },
  icon: { fontWeight: '600' },
});
