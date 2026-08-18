import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ settings, onToggleSetting }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Header */}
        <View style={styles.header}>
          <View style={styles.shieldIconWrapper}>
            <Ionicons name="shield-checkmark" size={36} color="#10B981" />
          </View>
          <Text style={styles.headerTitle}>Focus Shield Active</Text>
          <Text style={styles.headerSubtitle}>
            Protecting your attention by stripping away addictive short-form video loops.
          </Text>
        </View>

        {/* Impact Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Reels Blocked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>~2.5 hrs</Text>
            <Text style={styles.statLabel}>Avg Time Saved/Day</Text>
          </View>
        </View>

        {/* Section: Platform Toggles */}
        <Text style={styles.sectionTitle}>PLATFORM CONTROLS</Text>
        <View style={styles.card}>
          {/* YouTube Toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <View style={[styles.platformIcon, { backgroundColor: '#FF003320' }]}>
                <Ionicons name="logo-youtube" size={20} color="#FF0033" />
              </View>
              <View style={styles.toggleTextWrapper}>
                <Text style={styles.toggleTitle}>Block YouTube Shorts</Text>
                <Text style={styles.toggleDescription}>
                  Hides bottom Shorts button, shelves, and search shorts.
                </Text>
              </View>
            </View>
            <Switch
              value={settings.blockYoutubeShorts}
              onValueChange={() => onToggleSetting('blockYoutubeShorts')}
              trackColor={{ false: '#374151', true: '#059669' }}
              thumbColor={settings.blockYoutubeShorts ? '#10B981' : '#9CA3AF'}
            />
          </View>

          <View style={styles.separator} />

          {/* Instagram Toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <View style={[styles.platformIcon, { backgroundColor: '#E1306C20' }]}>
                <Ionicons name="logo-instagram" size={20} color="#E1306C" />
              </View>
              <View style={styles.toggleTextWrapper}>
                <Text style={styles.toggleTitle}>Block Instagram Reels</Text>
                <Text style={styles.toggleDescription}>
                  Hides Reels tab, feed reel cards, and explore video grids.
                </Text>
              </View>
            </View>
            <Switch
              value={settings.blockInstagramReels}
              onValueChange={() => onToggleSetting('blockInstagramReels')}
              trackColor={{ false: '#374151', true: '#059669' }}
              thumbColor={settings.blockInstagramReels ? '#10B981' : '#9CA3AF'}
            />
          </View>

          <View style={styles.separator} />

          {/* Facebook Toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <View style={[styles.platformIcon, { backgroundColor: '#1877F220' }]}>
                <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              </View>
              <View style={styles.toggleTextWrapper}>
                <Text style={styles.toggleTitle}>Block Facebook Reels</Text>
                <Text style={styles.toggleDescription}>
                  Hides Reels trays, short video feeds, and watch reels.
                </Text>
              </View>
            </View>
            <Switch
              value={settings.blockFacebookReels}
              onValueChange={() => onToggleSetting('blockFacebookReels')}
              trackColor={{ false: '#374151', true: '#059669' }}
              thumbColor={settings.blockFacebookReels ? '#10B981' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Section: Features That Still Work */}
        <Text style={styles.sectionTitle}>WHAT YOU CAN STILL USE</Text>
        <View style={styles.card}>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.featureText}>Normal Long-Form Videos & Playlists</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.featureText}>Direct Messages (DMs) & Chats</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.featureText}>Photo Posts, Feeds & Friend Updates</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.featureText}>Search, Channels & Group Pages</Text>
          </View>
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Unreel Focus Hub v1.0.0 • Clean & Distraction-Free
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1115',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  shieldIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#064E3B40',
    borderWidth: 1,
    borderColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#161922',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#232836',
    padding: 14,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#161922',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#232836',
    padding: 14,
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  platformIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toggleTextWrapper: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  toggleDescription: {
    fontSize: 11,
    color: '#8B949E',
    lineHeight: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#232836',
    marginVertical: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  featureText: {
    color: '#E5E7EB',
    fontSize: 13,
    marginLeft: 10,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    color: '#4B5563',
    fontSize: 11,
  },
});
