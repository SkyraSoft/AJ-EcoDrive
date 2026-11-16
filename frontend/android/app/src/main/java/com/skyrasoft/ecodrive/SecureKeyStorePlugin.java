package com.skyrasoft.ecodrive;

import android.content.Context;
import android.content.SharedPreferences;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyInfo;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import java.util.Arrays;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.GCMParameterSpec;

/**
 * AJ ECODRIVE ERP — NATIVE ANDROID KEYSTORE SECURE STORAGE BRIDGE
 *
 * Implements authenticated hardware/OS-backed token encryption:
 * - Master 256-bit AES key created inside AndroidKeyStore (non-exportable)
 * - Authenticated AES/GCM/NoPadding encryption with unique random IV per write
 * - IV and ciphertext stored in sandboxed SharedPreferences
 * - Plaintext tokens never written to disk or logged
 * - Decryption executed strictly inside the native JVM bridge
 * - Graceful fallback and auto-eviction on decryption failure or key invalidation
 */
@CapacitorPlugin(name = "SecureKeyStore")
public class SecureKeyStorePlugin extends Plugin {
    private static final String ANDROID_KEY_STORE = "AndroidKeyStore";
    private static final String KEY_ALIAS = "ecodrive_master_key";
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final String PREF_NAME = "ecodrive_secure_vault";
    private static final int GCM_IV_LENGTH = 12; // 96 bits recommended for AES-GCM
    private static final int GCM_TAG_LENGTH = 128; // 128 bits authentication tag

    private synchronized SecretKey getOrCreateKey() throws Exception {
        KeyStore keyStore = KeyStore.getInstance(ANDROID_KEY_STORE);
        keyStore.load(null);

        if (!keyStore.containsAlias(KEY_ALIAS)) {
            KeyGenerator keyGenerator = KeyGenerator.getInstance(
                KeyProperties.KEY_ALGORITHM_AES,
                ANDROID_KEY_STORE
            );

            KeyGenParameterSpec spec = new KeyGenParameterSpec.Builder(
                KEY_ALIAS,
                KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT
            )
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .setRandomizedEncryptionRequired(true)
                .build();

            keyGenerator.init(spec);
            return keyGenerator.generateKey();
        }

        KeyStore.Entry entry = keyStore.getEntry(KEY_ALIAS, null);
        if (!(entry instanceof KeyStore.SecretKeyEntry)) {
            // Re-create key if alias exists but is not a SecretKey
            keyStore.deleteEntry(KEY_ALIAS);
            return getOrCreateKey();
        }

        return ((KeyStore.SecretKeyEntry) entry).getSecretKey();
    }

    private SharedPreferences getVaultPrefs() {
        return getContext().getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    @PluginMethod
    public void set(PluginCall call) {
        String key = call.getString("key");
        String value = call.getString("value");

        if (key == null || key.isEmpty()) {
            call.reject("Key must be provided");
            return;
        }

        if (value == null) {
            remove(call);
            return;
        }

        try {
            SecretKey secretKey = getOrCreateKey();
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);

            byte[] iv = cipher.getIV();
            byte[] ciphertext = cipher.doFinal(value.getBytes(StandardCharsets.UTF_8));

            byte[] combined = new byte[iv.length + ciphertext.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(ciphertext, 0, combined, iv.length, ciphertext.length);

            String encoded = Base64.encodeToString(combined, Base64.NO_WRAP);
            getVaultPrefs().edit().putString(key, encoded).apply();

            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to securely encrypt and store value: " + e.getMessage());
        }
    }

    @PluginMethod
    public void get(PluginCall call) {
        String key = call.getString("key");
        if (key == null || key.isEmpty()) {
            call.reject("Key must be provided");
            return;
        }

        try {
            String encoded = getVaultPrefs().getString(key, null);
            if (encoded == null || encoded.isEmpty()) {
                JSObject ret = new JSObject();
                ret.put("value", null);
                call.resolve(ret);
                return;
            }

            byte[] combined = Base64.decode(encoded, Base64.NO_WRAP);
            if (combined.length <= GCM_IV_LENGTH) {
                // Invalid / corrupted payload: clear entry
                getVaultPrefs().edit().remove(key).apply();
                JSObject ret = new JSObject();
                ret.put("value", null);
                call.resolve(ret);
                return;
            }

            byte[] iv = Arrays.copyOfRange(combined, 0, GCM_IV_LENGTH);
            byte[] ciphertext = Arrays.copyOfRange(combined, GCM_IV_LENGTH, combined.length);

            SecretKey secretKey = getOrCreateKey();
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, spec);

            byte[] decrypted = cipher.doFinal(ciphertext);
            String plaintext = new String(decrypted, StandardCharsets.UTF_8);

            JSObject ret = new JSObject();
            ret.put("value", plaintext);
            call.resolve(ret);
        } catch (Exception e) {
            // Fail safely on decryption or tampering errors, auto-evict, do not crash
            try {
                getVaultPrefs().edit().remove(key).apply();
            } catch (Exception ignored) {}
            JSObject ret = new JSObject();
            ret.put("value", null);
            call.resolve(ret);
        }
    }

    @PluginMethod
    public void remove(PluginCall call) {
        String key = call.getString("key");
        if (key == null || key.isEmpty()) {
            call.reject("Key must be provided");
            return;
        }

        try {
            getVaultPrefs().edit().remove(key).apply();
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to remove key: " + e.getMessage());
        }
    }

    @PluginMethod
    public void clear(PluginCall call) {
        try {
            getVaultPrefs().edit().clear().apply();
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to clear vault: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        JSObject ret = new JSObject();
        try {
            SecretKey secretKey = getOrCreateKey();
            ret.put("isKeyStoreAvailable", true);
            ret.put("keyAlias", KEY_ALIAS);
            ret.put("algorithm", TRANSFORMATION);

            boolean isHardware = false;
            try {
                SecretKeyFactory factory = SecretKeyFactory.getInstance(
                    KeyProperties.KEY_ALGORITHM_AES,
                    ANDROID_KEY_STORE
                );
                KeyInfo keyInfo = (KeyInfo) factory.getKeySpec(secretKey, KeyInfo.class);
                isHardware = keyInfo.isInsideSecureHardware();
            } catch (Exception ignored) {}

            ret.put("isHardwareBacked", isHardware);
            call.resolve(ret);
        } catch (Exception e) {
            ret.put("isKeyStoreAvailable", false);
            ret.put("error", e.getMessage());
            call.resolve(ret);
        }
    }
}
