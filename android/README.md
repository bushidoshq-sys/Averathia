# Averathia Android shell

This directory is a native Android shell around the existing Averathia web game.

## Locked project rule
Existing Averathia image assets are not copied, regenerated, resized, compressed, cropped, or otherwise modified by the Android shell. The live game remains the source of the existing visual assets.

## Architecture
- The current GitHub Pages/PWA game remains intact.
- Android WebView opens the live Averathia build, preserving the existing rapid GitHub update flow.
- `AverathiaAndroid` is a deliberately small JavaScript bridge for native-only capabilities.
- Activity Recognition permission is prepared for Journey movement integration.
- Actual movement-to-Journey progression is intentionally kept separate from the shell bootstrap so it can be balanced and tested without changing existing Journey rewards.

The Android directory is additive: deleting it leaves the current PWA unchanged.
