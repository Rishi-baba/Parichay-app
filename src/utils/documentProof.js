/**
 * Utility functions for managing document proofs.
 * Simulates a database using localStorage.
 */

const STORAGE_KEY = 'parichay_document_proofs';
const ENCRYPTED_DOCS_KEY = 'parichay_encrypted_docs';

/**
 * Saves a document proof to localStorage.
 * 
 * @param {File} file - The file object
 * @param {string} hash - The SHA-256 hash of the file
 * @returns {object} The saved proof object
 */
export const saveDocumentProof = (file, hash) => {
    try {
        const proofs = getAllDocumentProofs();

        const newProof = {
            id: crypto.randomUUID(), // distinct from file.lastModified or Date.now()
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            fullHash: hash,
            shortHash: hash.substring(0, 8),
            uploadedAt: new Date().toISOString(),
            transactionId: null
        };

        proofs.push(newProof);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(proofs));

        return newProof;
    } catch (error) {
        console.error('Error saving document proof:', error);
        throw new Error('Failed to save document proof');
    }
};

/**
 * Retrieves all document proofs from localStorage.
 * 
 * @returns {Array} Array of proof objects
 */
export const getAllDocumentProofs = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error retrieving document proofs:', error);
        return [];
    }
};

/**
 * Retrieves a specific document proof by ID.
 * 
 * @param {string} id - The proof ID
 * @returns {object|null} The proof object or null if not found
 */
export const getDocumentProofById = (id) => {
    const proofs = getAllDocumentProofs();
    return proofs.find(p => p.id === id) || null;
};

/**
 * Updates the transaction ID for a specific document proof.
 * This will be used after the hash is committed to the blockchain.
 * 
 * @param {string} id - The proof ID
 * @param {string} txId - The blockchain transaction ID
 * @returns {object|null} The updated proof object or null if not found
 */
export const updateTransactionId = (id, txId) => {
    try {
        const proofs = getAllDocumentProofs();
        const index = proofs.findIndex(p => p.id === id);

        if (index !== -1) {
            proofs[index].transactionId = txId;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(proofs));
            return proofs[index];
        }
        return null;
    } catch (error) {
        console.error('Error updating transaction ID:', error);
        throw new Error('Failed to update transaction ID');
    }
};
/**
 * Stores encrypted file data in localStorage (simulating secure store).
 * 
 * @param {string} proofId 
 * @param {object} encryptedPayload { data, iv, key } - Base64 strings
 */
export const storeEncryptedDocument = (proofId, encryptedPayload) => {
    try {
        const store = JSON.parse(localStorage.getItem(ENCRYPTED_DOCS_KEY) || '{}');
        store[proofId] = encryptedPayload;
        localStorage.setItem(ENCRYPTED_DOCS_KEY, JSON.stringify(store));
    } catch (e) {
        console.error("Storage failed (likely size limit):", e);
        // Fallback or alert logic would go here
    }
};

/**
 * Retrieves encrypted file data by proof ID.
 * @param {string} proofId 
 * @returns {object|null}
 */
export const getEncryptedDocument = (proofId) => {
    try {
        const store = JSON.parse(localStorage.getItem(ENCRYPTED_DOCS_KEY) || '{}');
        return store[proofId] || null;
    } catch (e) {
        console.error("Failed to retrieve encrypted doc:", e);
        return null;
    }
};
