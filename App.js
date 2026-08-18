import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/components/HomeScreen';
import FullscreenAppView from './src/components/FullscreenAppView';
import {
  YOUTUBE_BLOCK_SCRIPT,
  INSTAGRAM_BLOCK_SCRIPT,
  FACEBOOK_BLOCK_SCRIPT,
} from './src/constants/blockScripts';

export default function App() {
  const [activeApp, setActiveApp] = useState(null);
  const [totalDailySeconds, setTotalDailySeconds] = useState(0);

  const handleSelectApp = (appId) => {
    setActiveApp(appId);
  };

  const handleExitApp = () => {
    setActiveApp(null);
  };

  const handleTickSecond = () => {
    setTotalDailySeconds((prev) => prev + 1);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar style="light" backgroundColor="#121214" />

        {/* 1. Minimal Home Launcher with Daily Focus Stat */}
        {activeApp === null && (
          <HomeScreen
            onSelectApp={handleSelectApp}
            totalDailySeconds={totalDailySeconds}
          />
        )}

        {/* 2. YouTube Fullscreen */}
        {activeApp === 'youtube' && (
          <FullscreenAppView
            url="https://m.youtube.com"
            injectedScript={YOUTUBE_BLOCK_SCRIPT}
            onExitApp={handleExitApp}
            onTickSecond={handleTickSecond}
          />
        )}

        {/* 3. Instagram Fullscreen */}
        {activeApp === 'instagram' && (
          <FullscreenAppView
            url="https://www.instagram.com"
            injectedScript={INSTAGRAM_BLOCK_SCRIPT}
            onExitApp={handleExitApp}
            onTickSecond={handleTickSecond}
          />
        )}

        {/* 4. Facebook Fullscreen */}
        {activeApp === 'facebook' && (
          <FullscreenAppView
            url="https://m.facebook.com"
            injectedScript={FACEBOOK_BLOCK_SCRIPT}
            onExitApp={handleExitApp}
            onTickSecond={handleTickSecond}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#121214',
  },
});
