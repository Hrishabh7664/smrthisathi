# Build the Android APK

From PowerShell:

```powershell
cd mobile
npm.cmd install --legacy-peer-deps
npx.cmd eas-cli@latest login
npx.cmd eas-cli@latest build:configure
npx.cmd eas-cli@latest build --platform android --profile preview
```

When the build finishes, Expo prints a download URL. Open it on the Android phone, allow installation from that source if Android asks, and install the APK.

The `preview` profile is deliberately configured as an APK (`mobile/eas.json`). The `production` profile creates an Android App Bundle for Play Store submission.

EAS CLI is separate from the Expo SDK. If you prefer a permanent command, install it globally with `npm.cmd install --global eas-cli`, then use `eas login` and `eas build`. EAS requires an Expo account and internet access; it builds the APK in the cloud and does not require Android Studio.
