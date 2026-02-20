/**
 * Utility functions for cryptographic operations using Web Crypto API.
 */

/**
 * Generates a SHA-256 hash of a file.
 * 
 * This function reads the file as an ArrayBuffer, computes the SHA-256 hash
 * using the browser's native Web Crypto API, and returns the hex string representation.
 * 
 * @param {File} file - The file object to hash
 * @returns {Promise<string>} - A promise that resolves to the SHA-256 hex string
 * @throws {Error} If the file is invalid or the operation fails
 */
export async function generateFileHash(file) {
    if (!file || !(file instanceof File || file instanceof Blob)) {
        throw new Error('Invalid file provided. Expected a File or Blob object.');
    }

    try {
        // Read the file as an ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Generate SHA-256 hash using Web Crypto API
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);

        // Convert ArrayBuffer to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        return hashHex;
    } catch (error) {
        console.error('Error generating file hash:', error);
        throw new Error('Failed to generate file hash.');
    }
}
