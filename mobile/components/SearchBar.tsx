import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  // Extra styling from the screen using the bar, like spacing
  containerStyle?: StyleProp<ViewStyle>;
};

// Search box with a clear button
// The screen keeps track of the text
export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search clothing, brands, or styles',
  containerStyle,
}: SearchBarProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Search"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={8}
        >
          <Text style={styles.clearText}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111',
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  clearText: {
    fontSize: 16,
    color: '#666',
  },
});
