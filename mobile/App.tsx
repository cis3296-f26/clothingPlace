
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

import SavedItemsScreen from './src/screens/SavedItemsScreen';
import { SavedItemsProvider } from './src/saved/SavedItemsContext';

type Screen = 'Home' | 'Wishlist';

export default function App() {
  return (
    <SavedItemsProvider userId="demo-user">
      <ClothingPlaceApp />
    </SavedItemsProvider>
  );
}

function ClothingPlaceApp() {
  const [screen, setScreen] = useState<Screen>('Home');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {screen === 'Home' ? (
          <View style={styles.home}>
            <Text style={styles.title}>ClothingPlace</Text>
            <Text style={styles.subtitle}>
              Discover your next favorite outfit.
            </Text>

            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeTitle}>
                Discover Your Style
              </Text>
              <Text style={styles.welcomeText}>
                Explore unique clothing from independent brands.
              </Text>

              <Pressable
                style={styles.button}
                onPress={() => setScreen('Wishlist')}
              >
                <Text style={styles.buttonText}>
                  View My Wishlist ♡
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <SavedItemsScreen
            onBrowse={() => setScreen('Home')}
          />
        )}
      </View>

      <View style={styles.navbar}>
        <Pressable
          style={styles.navItem}
          onPress={() => setScreen('Home')}
        >
          <Text style={styles.navIcon}>⌂</Text>
          <Text
            style={[
              styles.navText,
              screen === 'Home' && styles.activeText,
            ]}
          >
            Home
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => setScreen('Wishlist')}
        >
          <Text style={styles.navIcon}>
            {screen === 'Wishlist' ? '♥' : '♡'}
          </Text>
          <Text
            style={[
              styles.navText,
              screen === 'Wishlist' && styles.activeText,
            ]}
          >
            Wishlist
          </Text>
        </Pressable>
      </View>

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 55,
  },
  content: {
    flex: 1,
  },
  home: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111',
  },
  subtitle: {
    fontSize: 15,
    color: '#777',
    marginTop: 8,
  },
  welcomeCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 18,
    padding: 24,
    marginTop: 35,
  },
  welcomeTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#111',
  },
  welcomeText: {
    fontSize: 15,
    color: '#666',
    marginTop: 10,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 15,
    marginTop: 22,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    paddingBottom: 30,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 28,
    color: '#111',
  },
  navText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  activeText: {
    color: '#111',
    fontWeight: '700',
  },
});
