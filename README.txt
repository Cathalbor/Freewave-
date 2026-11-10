FREEWAVE — iPhone music-player starter
=====================================

What it does
- Searches Jamendo's independent music catalogue (free API account/client ID required).
- Plays available streams, supports a queue, next/previous, likes, genre search.
- Lets you play audio files you select from your device.
- Saves likes and API key in this browser.

Important limitations
- This is not Spotify Premium and does not contain Spotify's commercial catalogue.
- Jamendo tracks are independently published and licences vary by track. Use each track only within its stated licence.
- No ads or subscription are added by this app.
- An iPhone web app cannot guarantee native-app-quality background/lock-screen playback. For reliable background audio, a native iOS app with Apple's audio background mode is the proper route.
- Offline downloads of catalogue tracks are not implemented. Your own selected local files can be played while available to the browser.

SETUP
1. Create a free developer account at https://developer.jamendo.com/
2. Create an app/client ID in the developer dashboard.
3. Host this folder over HTTPS (GitHub Pages is free; see https://pages.github.com/).
4. Open the hosted site in Safari on iPhone.
5. Tap the gear icon, paste your client ID, and save.
6. Safari Share → Add to Home Screen.

This is a front-end prototype. The Jamendo API key is stored in local browser storage. For a public app, use a small server-side proxy so the key is not exposed.
