# Phase 9: Android KeyStore Native Storage Bridge & Cryptographic Report
**Document ID:** `PHASE-9-KEYSTORE-011`  
**Execution Timestamp:** 2026-11-16T15:12:00+05:00  
**Application ID:** `com.skyrasoft.ecodrive`  
**Application Name:** AJ EcoDrive ERP  
**Bridge Implementation:** `frontend/android/app/src/main/java/com/skyrasoft/ecodrive/SecureKeyStorePlugin.java`  
**Client Abstraction:** `frontend/src/offline/storage/SecureStorage.js`  

---

## 1. Executive Summary

This report provides the technical and cryptographic documentation for the native Android KeyStore secure storage bridge implemented for the **AJ EcoDrive ERP** mobile application.

The implementation replaces standard, unencrypted `SharedPreferences` with authenticated `AES/GCM/NoPadding` encryption driven by a non-exportable 256-bit AES master key generated and held inside the `AndroidKeyStore`.

---

## 2. Cryptographic Specifications

```
+-----------------------------------------------------------------------------------+
|                        ANDROID KEYSTORE CRYPTOGRAPHIC BRIDGE                      |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  1. KeyStore Provider:      "AndroidKeyStore"                                     |
|  2. Key Alias:              "ecodrive_master_key"                                 |
|  3. Key Algorithm:          AES (Advanced Encryption Standard)                    |
|  4. Key Size:               256 bits (KeyProperties.KEY_ALGORITHM_AES)            |
|  5. Cipher Transformation:  "AES/GCM/NoPadding" (Galois/Counter Mode)              |
|  6. Authentication Tag:     128 bits (GCMParameterSpec)                           |
|  7. Initialization Vector:  96 bits (12 bytes, cryptographically random per write)|
|  8. Key Protection:         PURPOSE_ENCRYPT | PURPOSE_DECRYPT                     |
|  9. Non-Exportable:         Private key material never leaves KeyStore boundary   |
| 10. Persistence:            Base64(IV || Ciphertext) stored in sandboxed Prefs    |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 3. Detailed Cryptographic Workflow

### 3.1 Key Generation (`getOrCreateKey()`)
- KeyStore initialized with `KeyStore.getInstance("AndroidKeyStore")`.
- If the alias `"ecodrive_master_key"` does not exist, `KeyGenerator` initializes with `KeyGenParameterSpec`:
  - `setBlockModes(KeyProperties.BLOCK_MODE_GCM)`
  - `setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)`
  - `setKeySize(256)`
  - `setRandomizedEncryptionRequired(true)`
- The generated key is stored within the Android OS KeyStore provider. The key material is non-exportable and cannot be extracted via software APIs.

### 3.2 Authenticated Encryption (`set`)
- Cipher initialized in `Cipher.ENCRYPT_MODE` using the KeyStore `SecretKey`.
- A fresh, cryptographically random 12-byte IV is generated automatically by the platform (`cipher.getIV()`).
- Data is encrypted producing an authenticated ciphertext with an embedded 128-bit authentication tag.
- Combined payload `[12-byte IV] + [Ciphertext + Tag]` is encoded as a Base64 string and written to `ecodrive_secure_vault` SharedPreferences.
- Plaintext token values are never written to disk.
- Zero logging of plaintexts, ciphertexts, or keys is enforced.

### 3.3 Authenticated Decryption (`get`)
- The Base64 string is retrieved and decoded.
- The 12-byte IV is extracted, and the remainder is supplied as ciphertext.
- Cipher initialized in `Cipher.DECRYPT_MODE` with `GCMParameterSpec(128, iv)`.
- If decryption fails (due to tampering, payload corruption, or key invalidation), the method fails safely, returns `null`, and purges the invalid entry to prevent persistent crash loops.

### 3.4 Logout Purge (`clear` / `remove`)
- Explicit logout triggers `SecureStorage.clear()`.
- Calls native plugin `clear()` which executes `.edit().clear().apply()` on `ecodrive_secure_vault`.
- All session tokens, cached refresh credentials, and authorization headers are immediately removed from device storage.

---

## 4. Hardware-Backed Keystore Availability Assessment

### 4.1 Diagnostic Query Mechanism
The native bridge exposes the `getStatus()` method which queries the underlying key attributes via `SecretKeyFactory` and `KeyInfo`:
```java
SecretKeyFactory factory = SecretKeyFactory.getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEY_STORE);
KeyInfo keyInfo = (KeyInfo) factory.getKeySpec(secretKey, KeyInfo.class);
boolean isHardware = keyInfo.isInsideSecureHardware();
```

### 4.2 Realistic Assessment on Target Hardware
| Environment | Hardware-Backed Status (`isInsideSecureHardware()`) | Protection Tier |
| :--- | :---: | :--- |
| **Physical Flagship/Midrange Android 9+ Devices** (e.g. Samsung Knox, Google Pixel Titan M, Qualcomm TEE) | **TRUE** | Protected by Hardware Security Module (HSM), Trusted Execution Environment (TEE), or StrongBox Keymaster. |
| **Budget / Older Android Devices** (without dedicated secure hardware chip) | **FALSE** | Protected by Android OS software keystore daemon (`keystored`) with Linux user sandbox permissions. |
| **Android Virtual Devices / Emulators** | **FALSE** | Software emulation in user-space or kernel emulation. |
| **Current Build Host Assessment** | **NOT CONNECTED** | No physical Android device is currently attached via USB (`adb devices` returned 0 devices). |

> [!IMPORTANT]
> AJ EcoDrive ERP strictly differentiates between software-backed KeyStore protection and hardware-backed (TEE/StrongBox) protection. The application operates securely across both tiers, utilizing hardware isolation whenever the physical device silicon provides it, and falling back safely to the OS keystore daemon on devices lacking dedicated hardware chips.

---

## 5. App Reinstall & Key Invalidation Recovery

- **Reinstall Behavior:** On Android 6.0+, when an application is uninstalled and reinstalled, the AndroidKeyStore alias is automatically removed by the OS.
- Because `android:allowBackup="false"` is active, old encrypted preferences will not be restored by Google Cloud Backup, preventing "un-decryptable orphan payload" scenarios.
- If corrupted data is ever encountered, the native bridge detects `AEADBadTagException` or invalid payload lengths, cleans the invalid entry, and prompts the user to log in cleanly.

---

## 6. Conclusion

The native `SecureKeyStorePlugin` provides enterprise-grade, authenticated token protection that satisfies all security requirements for mobile showroom ERP operations.
