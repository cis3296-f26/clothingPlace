
import { StyleSheet, Text, View } from 'react-native';

export default function VendorProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vendor Profile</Text>
      <Text style={styles.description}>
        Manage your clothing brand, products, and orders here.
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Vendor Dashboard</Text>
        <Text style={styles.cardText}>
          Vendor registration and management tools are coming next.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },
  description: {
    marginTop: 8,
    color: '#777',
    lineHeight: 20,
  },
  card: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#f7f7f7',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
