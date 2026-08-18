import React, { useRef, useState, useEffect, memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  StatusBar,
  Platform,
  Vibration,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function FullscreenAppView({
  url,
  injectedScript,
  onExitApp,
  onTickSecond,
}) {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [secondsSpent, setSecondsSpent] = useState(0);

  // Seamless Session Timer + 15-Minute Gentle Haptic Pulse
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSpent((prev) => {
        const next = prev + 1;

        // Gentle Haptic Pulse at every 15 minutes (900s, 1800s, etc.)
        if (next > 0 && next % 900 === 0) {
          Vibration.vibrate(400); // 400ms gentle pulse
        }

        return next;
      });

      if (onTickSecond) {
        onTickSecond();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onTickSecond]);

  // Format seconds into MM:SS
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const formattedMins = mins < 10 ? `0${mins}` : `${mins}`;
    const formattedSecs = secs < 10 ? `0${secs}` : `${secs}`;
    return `${formattedMins}:${formattedSecs}`;
  };

  // Hardware Android Back button handler
  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      onExitApp();
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [canGoBack, onExitApp]);

  const topOffset = Math.max(insets.top, Platform.OS === 'android' ? 28 : 16);
  const isOver15Min = secondsSpent >= 900;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121214" />

      {/* Floating Center Exit Pill with Monospace Session Timer & Amber Overtime Alert */}
      <View
        style={[styles.topCenterContainer, { top: topOffset + 6 }]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          style={[
            styles.floatingExitBtn,
            isOver15Min && styles.floatingExitBtnAmber,
          ]}
          onPress={onExitApp}
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 14, right: 14 }}
        >
          <Ionicons
            name="arrow-back-sharp"
            size={12}
            color={isOver15Min ? '#F59E0B' : '#FFFFFF'}
          />
          <Text style={[styles.exitText, isOver15Min && { color: '#F59E0B' }]}>
            PORTAL
          </Text>
          <View
            style={[
              styles.dividerDot,
              isOver15Min && { backgroundColor: '#F59E0B' },
            ]}
          />
          <Text
            style={[
              styles.timerText,
              isOver15Min && { color: '#F59E0B', fontWeight: '800' },
            ]}
          >
            {formatTime(secondsSpent)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* High-Performance Hardware Accelerated WebView */}
      <View
        style={[
          styles.webViewContainer,
          {
            paddingTop: topOffset,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          databaseEnabled={true}
          cacheEnabled={true}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          injectedJavaScriptBeforeContentLoaded={injectedScript}
          injectedJavaScript={injectedScript}
          androidHardwareAccelerationDisabled={false}
          androidLayerType="hardware"
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          overScrollMode="never"
        />
      </View>
    </View>
  );
}

export default memo(FullscreenAppView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
  },
  topCenterContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999999,
    elevation: 50,
  },
  floatingExitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181BF5',
    borderWidth: 1,
    borderColor: '#3F3F46',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 50,
  },
  floatingExitBtnAmber: {
    borderColor: '#F59E0B80',
    backgroundColor: '#1F1A12F5',
  },
  exitText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  dividerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#71717A',
  },
  timerText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.8,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webView: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
