# Android upload signing

Release builds require a local upload keystore. **Do not commit** `.jks`, `.keystore`, or `keystore.properties`.

1. Copy `android/keystore.properties.example` to `android/keystore.properties`.
2. Generate an upload key (example):

```bash
mkdir -p android/keystore
keytool -genkeypair -v \
  -keystore android/keystore/upload-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias upload
```

3. Fill `storeFile`, `storePassword`, `keyAlias`, and `keyPassword` in `keystore.properties`.
4. Enroll **Play App Signing** in Google Play Console using this upload key (or Google’s generated key after first upload). Losing the upload key blocks updates.

This repository never ships a production key. Any keystore created in a cloud agent is **environment-only** and must be replaced before a public Play listing.
