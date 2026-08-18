import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

export default function SocialWebView({
  url,
  platformName,
  platformColor,
  injectedScript,
  isBlockingEnabled = true,
  isActiveTab = true,
}) {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    if (!isActiveTab) return;

    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
    return () => subscription.remove();
  }, [canGoBack, isActiveTab]);

  const handleRefresh = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const handleGoBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  const handleGoForward = () => {
    if (canGoForward && webViewRef.current) {
      webViewRef.current.goForward();
    }
  };

  const activeScript = isBlockingEnabled ? injectedScript : '';

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.platformDot, { backgroundColor: platformColor }]} />
          <Text style={styles.headerTitle}>{platformName}</Text>
          {isBlockingEnabled && (
            <View style={styles.shieldBadge}>
              <Ionicons name="shield-checkmark" size={11} color="#10B981" />
              <Text style={styles.shieldText}>Shield On</Text>
            </View>
          )}
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerButton, !canGoBack && styles.buttonDisabled]}
            onPress={handleGoBack}
            disabled={!canGoBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color={canGoBack ? '#FFFFFF' : '#555555'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerButton, !canGoForward && styles.buttonDisabled]}
            onPress={handleGoForward}
            disabled={!canGoForward}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={canGoForward ? '#FFFFFF' : '#555555'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleRefresh}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="reload" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Direct Full-Screen WebView with Zero Touch Blocking */}
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={styles.webView}
        containerStyle={styles.webViewWrapper}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        injectedJavaScriptBeforeContentLoaded={activeScript}
        injectedJavaScript={activeScript}
        androidHardwareAccelerationDisabled={false}
        androidLayerType="hardware"
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
          setCanGoForward(navState.canGoForward);
        }}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1115',
  },
  header: {
    height: 42,
    backgroundColor: '#161922',
    borderBottomWidth: 1,
    borderBottomColor: '#2B3142',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  shieldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  shieldText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 6,
    marginLeft: 4,
    borderRadius: 6,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  webViewWrapper: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webView: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
