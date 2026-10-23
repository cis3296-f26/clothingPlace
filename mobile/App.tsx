
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <View style={styles.container}>
      {/* title and text wrap in a view */}
      <Text style={styles.title}>ClothingPlace</Text>
      <Text style={styles.subtitle}>Find your next outfit</Text>

      <View style={styles.skeleton}/>
      <View style={styles.skeletonSmall}/>
      <Navbar />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    color: '#666',
  },
  skeleton: {
    height: 180,
    marginTop: 32,
    borderRadius: 12,
    backgroundColor: '#e5e5e5',
  },
  skeletonSmall: {
    width: '60%',
    height: 20,
    marginTop: 16,
    borderRadius: 6,
    backgroundColor: '#e5e5e5',
  },
});
