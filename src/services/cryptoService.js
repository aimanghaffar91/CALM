/**
 * Zero-Knowledge Client-Side Encryption Service
 * Uses standard Web Crypto API (SubtleCrypto) with AES-GCM 256-bit.
 * Data is encrypted locally in memory before it ever touches localStorage or any cloud database.
 */

// Helper to convert ArrayBuffer to Base64
function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Helper to convert Base64 to ArrayBuffer
function base64ToBuffer(base64) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function deriveKeyFromPassphrase(passphrase, saltStr = 'calm_secure_salt_v1') {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(saltStr),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptText(plainText, key) {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    enc.encode(plainText)
  );

  return {
    iv: bufferToBase64(iv),
    cipher: bufferToBase64(ciphertext),
    timestamp: new Date().toISOString(),
  };
}

export async function decryptText(encryptedObj, key) {
  const dec = new TextDecoder();
  const iv = new Uint8Array(base64ToBuffer(encryptedObj.iv));
  const cipherBuffer = base64ToBuffer(encryptedObj.cipher);

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    cipherBuffer
  );

  return dec.decode(decrypted);
}

// Simulated Zero-Knowledge Database Synchronizer
export const DatabaseSyncSimulation = {
  async simulateCloudSync(encryptedPayload) {
    // In production, this payload is sent to:
    // supabase.from('user_vault').insert({ payload: encryptedPayload, user_id: auth.uid() })
    // The server/database only sees encrypted ciphertext like: "U2FsdGVkX187...".
    // Even database administrators, hackers, or cloud providers CANNOT read your private journal!
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'synced_encrypted',
          recordsStored: 1,
          zeroKnowledgeGuaranteed: true,
          syncedAt: new Date().toLocaleTimeString(),
        });
      }, 600);
    });
  },
};
