/**
 * Utility functions for client-side file encryption/decryption using Web Crypto API.
 */

/**
 * Generates an AES-GCM key for encryption.
 * @returns {Promise<CryptoKey>}
 */
const generateKey = async () => {
    return window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
};

/**
 * Exports a crypto key to raw format for storage.
 * @param {CryptoKey} key 
 * @returns {Promise<ArrayBuffer>}
 */
const exportKey = async (key) => {
    return window.crypto.subtle.exportKey("raw", key);
};

/**
 * Imports a raw crypto key.
 * @param {ArrayBuffer} rawKey 
 * @returns {Promise<CryptoKey>}
 */
const importKey = async (rawKey) => {
    return window.crypto.subtle.importKey(
        "raw",
        rawKey,
        "AES-GCM",
        true,
        ["encrypt", "decrypt"]
    );
};

/**
 * Encrypts a file using AES-GCM.
 * 
 * @param {File} file - The file to encrypt
 * @returns {Promise<{encryptedData: ArrayBuffer, iv: Uint8Array, key: ArrayBuffer}>}
 */
export const encryptFile = async (file) => {
    try {
        const key = await generateKey();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const fileData = await file.arrayBuffer();

        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            fileData
        );

        const exportedKey = await exportKey(key);

        return {
            encryptedData,
            iv,
            key: exportedKey
        };
    } catch (error) {
        console.error("Encryption failed:", error);
        throw new Error("Failed to encrypt file.");
    }
};

/**
 * Decrypts file data using AES-GCM.
 * 
 * @param {ArrayBuffer} encryptedData 
 * @param {ArrayBuffer} rawKey 
 * @param {Uint8Array} iv 
 * @param {string} fileType 
 * @returns {Promise<Blob>}
 */
export const decryptFile = async (encryptedData, rawKey, iv, fileType) => {
    try {
        const key = await importKey(rawKey);

        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            encryptedData
        );

        return new Blob([decryptedData], { type: fileType });
    } catch (error) {
        console.error("Decryption failed:", error);
        throw new Error("Failed to decrypt file.");
    }
};

/**
 * Helper to convert buffers to base64 for storage (localStorage).
 * @param {ArrayBuffer} buffer 
 * @returns {string}
 */
export const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

/**
 * Helper to convert base64 to buffer.
 * @param {string} base64 
 * @returns {ArrayBuffer}
 */
export const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};
