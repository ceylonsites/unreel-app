import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen({ onSelectApp, totalDailySeconds = 0 }) {
  const insets = useSafeAreaInsets();

  const apps = [
    { id: 'youtube', name: 'YOUTUBE' },
    { id: 'instagram', name: 'INSTAGRAM' },
    { id: 'facebook', name: 'FACEBOOK' },
  ];

  const formatDailyTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;

    if (hours > 0) {
      return `${hours}h ${remMins}m`;
    }
    return `${mins}m`;
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top + 40, 60),
          paddingBottom: Math.max(insets.bottom + 40, 50),
        },
      ]}
    >
      {/* Minimal Header with Total Daily Focus Stat */}
      <View style={styles.header}>
        <Text style={styles.title}>UNREEL</Text>
        <View style={styles.statPill}>
          <Text style={styles.statText}>
            TODAY • {formatDailyTime(totalDailySeconds)}
          </Text>
        </View>
      </View>

      {/* 3 Pure Minimalist Buttons */}
      <View style={styles.buttonGroup}>
        {apps.map((app) => (
          <TouchableOpacity
            key={app.id}
            style={styles.button}
            onPress={() => onSelectApp(app.id)}
            activeOpacity={0.75}
          >
            <Text style={styles.buttonText}>{app.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 44,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 8,
    marginBottom: 10,
  },
  statPill: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    fontVariant: ['tabular-nums'],
  },
  buttonGroup: {
    gap: 18,
  },
  button: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 4,
  },
});
