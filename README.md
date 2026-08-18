# 🛡️ Unreel - Focus Social Hub

A distraction-free mobile web wrapper for **YouTube**, **Instagram**, and **Facebook** that removes addictive short-form video loops (**Shorts**, **Reels**) while keeping full functionality for normal videos, direct messages, photos, and searches.

---

## 🚀 How to Run on Your Phone via Expo Go

1. Open your terminal in this directory:
   ```bash
   cd c:\Users\Kavindu\Documents\antigravity\magical-planck
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Expo:
   ```bash
   npx expo start --tunnel
   ```
4. Open the **Expo Go** app on your Android phone, tap **"Scan QR code"**, and scan the QR code displayed in your terminal.
5. The app will open directly on your phone!

---

## 📦 How to Generate a Direct `.apk` File (Installable on any Android phone)

To generate a standalone `.apk` that you can install without Expo Go:

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your free Expo account:
   ```bash
   npx eas login
   ```
3. Configure the build:
   ```bash
   npx eas build:configure
   ```
4. Build the standalone Android `.apk`:
   ```bash
   npx eas build -p android --profile preview
   ```
5. Once the build finishes (takes ~5–8 mins in the cloud), it will print a direct **download link & QR code**.
6. Open the link on your phone to download and install `unreel.apk`!

---

## 🛠️ Features Included

- 📺 **YouTube:** Strips out bottom navigation Shorts button, home feed Shorts carousels, lockup cards, and search shorts.
- 📸 **Instagram:** Strips out Reels navigation tab, suggested reels shelf in home feed, and explore reel videos. Full support for DMs, stories, and feed posts.
- 👥 **Facebook:** Removes Reels and short video sections.
- ⚙️ **Focus Dashboard:** Customizable toggle switches to selectively enable/disable blocking per platform.
- 🔄 **Preserved Session Tabs:** Switching tabs keeps your video playback and scroll position without reloading.
- 🛡️ **Android Hardware Back Button:** Naturally navigates back in browser history.
