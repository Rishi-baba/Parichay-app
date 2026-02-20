import { generateFileHash } from './cryptoUtils';
import { verifyHashOnAlgorand } from './algorandService';

/**
 * Verifies a document's integrity by comparing its hash against the blockchain record.
 * 
 * @param {File} file - The file to verify (usually re-uploaded by user)
 * @param {object} proof - The document proof object containing the transaction ID
 * @returns {Promise<object>} Result containing tampering status and hashes
 */
export const verifyDocument = async (file, proof) => {
    try {
        if (!proof?.transactionId) {
            throw new Error('No blockchain transaction ID found for this document.');
        }

        // 1. Generate current file hash
        const newHash = await generateFileHash(file);

        // 2. Fetch original hash from blockchain
        const blockchainHash = await verifyHashOnAlgorand(proof.transactionId);

        // 3. Compare hashes
        const isTampered = newHash !== blockchainHash;

        return {
            isTampered,
            newHash,
            blockchainHash,
            fileName: file.name
        };
    } catch (error) {
        console.error('Document verification failed:', error);
        throw error;
    }
};
