import algosdk from 'algosdk';
import { PeraWalletConnect } from '@perawallet/connect';

// Initialize PeraWalletConnect outside to maintain state across calls
const peraWallet = new PeraWalletConnect({
    shouldShowSignTxnToast: true // Shows Pera's default toast on mobile
});

// Algod Client configuration (Testnet by default)
const algodClient = new algosdk.Algodv2(
    '',
    'https://testnet-api.algonode.cloud',
    443
);

// Indexer Client configuration (Testnet)
const indexerClient = new algosdk.Indexer(
    '',
    'https://testnet-idx.algonode.cloud',
    443
);

/**
 * Connects to Pera Wallet, forcing a new session every time.
 * 
 * @returns {Promise<string>} The connected wallet address
 */
export const connectWallet = async () => {
    try {
        // Force disconnect any existing session to ensure modal always shows
        await peraWallet.disconnect();

        // New connection request
        const newAccounts = await peraWallet.connect();
        peraWallet.connector?.on("disconnect", handleDisconnect);
        return newAccounts[0];
    } catch (error) {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
            console.error('Error connecting to Pera Wallet:', error);
        }
        throw new Error('Failed to connect wallet.');
    }
};

/**
 * Handles wallet disconnection.
 */
export const handleDisconnect = () => {
    peraWallet.disconnect();
};

/**
 * Anchors a document hash on Algorand Testnet.
 * 
 * @param {string} hash - The SHA-256 hash of the document
 * @param {string} senderAddress - The wallet address sending the transaction
 * @param {function} onProgress - Optional callback for progress updates
 * @returns {Promise<string>} The transaction ID
 */
export const storeHashOnAlgorand = async (hash, senderAddress, onProgress) => {
    try {
        if (!senderAddress) throw new Error('Wallet not connected.');

        // Get suggested transaction parameters
        const suggestedParams = await algodClient.getTransactionParams().do();

        // Create a 0 ALGO payment transaction to self
        // Note: The document hash is stored in the 'note' field
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: senderAddress,
            to: senderAddress,
            amount: 0,
            note: new TextEncoder().encode(hash),
            suggestedParams,
        });

        if (onProgress) onProgress({ step: 'hashing' });

        // Group the transaction for signing (Pera requires grouped txns format)
        const singleTxnGroups = [{ txn: txn, signers: [senderAddress] }];

        if (onProgress) onProgress({ step: 'signing' });

        // Request signature from Pera Wallet
        const signedTxn = await peraWallet.signTransaction([singleTxnGroups]);

        if (onProgress) onProgress({ step: 'sending' });

        // Send the signed transaction to the network
        const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

        if (onProgress) onProgress({ step: 'confirming' });

        // Wait for confirmation (4 rounds)
        await algosdk.waitForConfirmation(algodClient, txId, 4);

        if (onProgress) onProgress({ step: 'complete', txId });

        return txId;
    } catch (error) {
        console.error('Error storing hash on Algorand:', error);
        throw new Error('Failed to anchor document on blockchain.');
    }
};

/**
 * Checks a specific transaction on Algorand to retrieve the original document hash.
 * 
 * @param {string} txId - The blockchain transaction ID
 * @returns {Promise<string>} The hash stored in the transaction note
 */
export const verifyHashOnAlgorand = async (txId) => {
    try {
        if (!txId) throw new Error('Invalid transaction ID.');

        // Use Indexer to find the transaction
        const response = await indexerClient.lookupTransactionByID(txId).do();
        const transaction = response['transaction'];

        if (!transaction) throw new Error('Transaction not found on Algorand.');

        // Extract and decode the note field
        const noteBase64 = transaction['note'];
        if (!noteBase64) throw new Error('No note found in transaction.');

        const noteBuffer = Buffer.from(noteBase64, 'base64');
        const hash = noteBuffer.toString('utf-8');

        return hash;
    } catch (error) {
        console.error('Error verifying hash on Algorand:', error);
        throw new Error('Failed to verify document on blockchain.');
    }
};
