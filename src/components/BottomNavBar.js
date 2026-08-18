import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomNavBar({ activeTab, onTabChange }) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 12);

  const tabs = [
    {
      id: 'youtube',
      label: 'YouTube',
      icon: 'logo-youtube',
      activeColor: '#FF0033',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: 'logo-instagram',
      activeColor: '#E1306C',
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: 'logo-facebook',
      activeColor: '#1877F2',
    },
    {
      id: 'settings',
      label: 'Focus Shield',
      icon: 'shield-checkmark',
      activeColor: '#10B981',
    },
  ];

  return (
    <View
      style={[
        styles.navBar,
        {
          paddingBottom: bottomPadding,
          height: 56 + bottomPadding,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabButton}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.6}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View
              style={[
                styles.iconContainer,
                isActive && { backgroundColor: `${tab.activeColor}25` },
              ]}
            >
              <Ionicons
                name={tab.icon}
                size={22}
                color={isActive ? tab.activeColor : '#8E95A5'}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? '#FFFFFF' : '#8E95A5' },
                isActive && styles.activeTabLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#161922',
    borderTopWidth: 1,
    borderTopColor: '#2B3142',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 6,
    zIndex: 99999,
    elevation: 25, // Critical for Android to receive touch over native WebView
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconContainer: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  activeTabLabel: {
    fontWeight: '700',
  },
});
