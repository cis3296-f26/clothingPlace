
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('Home');

  const tabs = [
    { name: 'Home', icon: '🏠' },
    { name: 'Discover', icon: '🔍' },
    { name: 'Profile', icon: '👤' },
  ];

  return (
    <View style={styles.navbar}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.name}
          style={[
            styles.navButton,
            activeTab === tab.name && styles.activeButton,
          ]}
          onPress={() => setActiveTab(tab.name)}
        >
          <Text style={styles.icon}>{tab.icon}</Text>
          <Text
            style={[
              styles.navText,
              activeTab === tab.name && styles.activeText,
            ]}
          >
            {tab.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eeeeee',
    marginTop: 'auto',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  activeButton: {
    backgroundColor: '#f0f0f0',
  },
  icon: {
    fontSize: 22,
    marginBottom: 5,
  },
  navText: {
    fontSize: 12,
    color: '#777777',
  },
  activeText: {
    color: '#111111',
    fontWeight: 'bold',
  },
});
