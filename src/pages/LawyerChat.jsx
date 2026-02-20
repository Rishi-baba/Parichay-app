import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Upload, FileText, X, Check, CreditCard, ShieldCheck, Link } from 'lucide-react';
import { generateFileHash } from '../utils/cryptoUtils';
import { saveDocumentProof, updateTransactionId, getDocumentProofById, storeEncryptedDocument, getEncryptedDocument } from '../utils/documentProof';
import { storeHashOnAlgorand, connectWallet } from '../utils/algorandService';
import { verifyDocument } from '../utils/documentVerification';
import { encryptFile, decryptFile, arrayBufferToBase64, base64ToArrayBuffer } from '../utils/fileEncryption';
import ConnectWalletButton from '../components/ConnectWalletButton';
import BlockchainProofPanel from '../components/BlockchainProofPanel';
import AnchoringProgress from '../components/AnchoringProgress';
import '../styles/LawyerChat.css';

const LawyerChat = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const verifyInputRef = useRef(null);
    const [verifyingDocId, setVerifyingDocId] = useState(null);
    const [selectedProof, setSelectedProof] = useState(null);
    const [verificationResults, setVerificationResults] = useState({});

    const lawyer = location.state?.lawyer || {
        name: "Adv. Meera Sharma",
        specialization: ["Family Law"],
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
    };

    // Initial state
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'lawyer',
            text: `Hello! I am ${lawyer.name}. I've reviewed your case summary. How can I assist you further today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [documents, setDocuments] = useState([
        { id: 1, name: 'EmploymentContract.pdf', date: 'Jan 10' },
        { id: 2, name: 'NoticeDraft_v1.docx', date: 'Jan 12' }
    ]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    const [isAnchoring, setIsAnchoring] = useState(false);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: 'user',
            text: inputText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        setIsTyping(true);

        // Simulate Lawyer Response
        setTimeout(() => {
            const responseMsg = {
                id: Date.now() + 1,
                sender: 'lawyer',
                text: "Thank you for sharing that. Based on the documents, we have a strong case for unfair termination. I suggest we proceed with a formal legal notice.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, responseMsg]);
            setIsTyping(false);
        }, 2000);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // 1. Generate hash
                const hash = await generateFileHash(file);

                // 2. Encrypt file client-side
                const { encryptedData, iv, key } = await encryptFile(file);

                // 3. Save local proof
                const proof = saveDocumentProof(file, hash);

                // 4. Store encrypted payload (simulated secure storage)
                storeEncryptedDocument(proof.id, {
                    data: arrayBufferToBase64(encryptedData),
                    iv: arrayBufferToBase64(iv),
                    key: arrayBufferToBase64(key),
                    type: file.type
                });

                console.log('Document Encrypted & Proof Stored:', proof.id);

                // 5. Update UI instantly
                const newDocInput = {
                    id: proof.id,
                    name: file.name,
                    date: 'Just now',
                    hash: hash
                };
                setDocuments(prev => [newDocInput, ...prev]);

                // 4. Anchor to Algorand if wallet connected
                if (walletAddress) {
                    setIsAnchoring(true);

                    // Show "Securing..." message with progress
                    const tempMsgId = Date.now();
                    setMessages(prev => [...prev, {
                        id: tempMsgId,
                        type: 'system-anchoring',
                        step: 'hashing',
                        text: `Anchoring ${file.name} to Algorand...`
                    }]);

                    try {
                        const txId = await storeHashOnAlgorand(hash, walletAddress, (progress) => {
                            setMessages(prev => prev.map(msg =>
                                msg.id === tempMsgId
                                    ? { ...msg, step: progress.step, txId: progress.txId }
                                    : msg
                            ));
                        });

                        // Update proof with txId
                        updateTransactionId(proof.id, txId);

                    } catch (err) {
                        console.error("Anchoring failed:", err);
                        setMessages(prev => prev.map(msg =>
                            msg.id === tempMsgId
                                ? { ...msg, type: 'system-error', text: `Upload successful, but anchoring failed. (Local proof saved)` }
                                : msg
                        ));
                    } finally {
                        setIsAnchoring(false);
                    }
                } else {
                    // Standard upload message if no wallet
                    setMessages(prev => [...prev, {
                        id: Date.now(),
                        type: 'system-upload',
                        text: `Uploaded document: ${file.name} (Hash: ${hash.substring(0, 8)}...)`
                    }]);
                }
            } catch (error) {
                console.error("Error processing file:", error);
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'system-error',
                    text: "Error uploading file."
                }]);
            }
        }
    };

    const handlePayment = () => {
        setShowPaymentModal(true);
    };

    const confirmPayment = (e) => {
        e.preventDefault();
        // Simulate payment processing
        setShowPaymentModal(false);
        setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'system-payment',
            text: "Payment of ₹1500 Successful. Consultation confirmed."
        }]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleVerifyClick = (docId) => {
        setVerifyingDocId(docId);
        verifyInputRef.current?.click();
    };

    const handleVerifyFile = async (e) => {
        const file = e.target.files[0];
        if (!file || !verifyingDocId) return;

        const proof = getDocumentProofById(verifyingDocId);
        if (!proof) {
            alert("No proof found for this document.");
            return;
        }

        if (!proof.transactionId) {
            alert("This document has not been anchored to the blockchain yet.");
            return;
        }

        // Show verifying message
        const tempId = Date.now();
        setMessages(prev => [...prev, {
            id: tempId,
            type: 'system-upload',
            text: `Verifying document integrity against Algorand Blockchain...`
        }]);

        try {
            const result = await verifyDocument(file, proof);

            if (result.isTampered) {
                setVerificationResults(prev => ({ ...prev, [verifyingDocId]: 'tampered' }));
                setMessages(prev => prev.map(msg =>
                    msg.id === tempId
                        ? { ...msg, type: 'system-error', text: `⚠️ WARNING: Document Has Been Modified! Blockchain hash does not match.` }
                        : msg
                ));
            } else {
                setVerificationResults(prev => ({ ...prev, [verifyingDocId]: 'verified' }));
                setMessages(prev => prev.map(msg =>
                    msg.id === tempId
                        ? { ...msg, text: `✅ Document Verified — No Tampering Detected.` }
                        : msg
                ));
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => prev.map(msg =>
                msg.id === tempId
                    ? { ...msg, type: 'system-error', text: `Verification failed: ${error.message}` }
                    : msg
            ));
        } finally {
            setVerifyingDocId(null);
            e.target.value = null; // Reset input
        }
    };

    const handleViewDocument = async (docId) => {
        const encryptedPkg = getEncryptedDocument(docId);
        if (!encryptedPkg) {
            alert("This document is not stored locally or is a legacy file.");
            return;
        }

        try {
            const decryptedBlob = await decryptFile(
                base64ToArrayBuffer(encryptedPkg.data),
                base64ToArrayBuffer(encryptedPkg.key),
                base64ToArrayBuffer(encryptedPkg.iv),
                encryptedPkg.type
            );

            const url = URL.createObjectURL(decryptedBlob);
            const newWindow = window.open(url, '_blank');
            if (newWindow) {
                // Attempt to prevent naive downloading/context menu in the new window (best effort for blob)
                newWindow.onload = () => {
                    // This is limited for PDF blobs in browser viewers, but script injection works if it's HTML
                    // For Blob URLs, browsers handle UI. We can't easily inject scripts into PDF viewer.
                    // As fallback, we revoke quickly.
                };
            }
            // Revoke after a delay to allow loading
            setTimeout(() => URL.revokeObjectURL(url), 60000);

        } catch (e) {
            console.error(e);
            alert("Decryption failed. Invalid key or corrupted data.");
        }
    };

    return (
        <div className="lawyer-chat-layout">
            <input
                type="file"
                ref={verifyInputRef}
                className="hidden"
                style={{ display: 'none' }}
                onChange={handleVerifyFile}
            />
            {/* Sidebar - Document Library */}
            <aside className="lawyer-chat-sidebar">
                {selectedProof && (
                    <BlockchainProofPanel
                        proof={selectedProof}
                        verificationStatus={verificationResults[selectedProof.id]}
                        onClose={() => setSelectedProof(null)}
                    />
                )}
                <div className="lawyer-profile-mini">
                    <img
                        src={lawyer.photo}
                        alt={lawyer.name}
                        className="lawyer-avatar-sm"
                    />
                    <div className="lawyer-info-mini">
                        <h3>{lawyer.name}</h3>
                        <p>{lawyer.specialization ? lawyer.specialization[0] : 'Legal Expert'}</p>
                    </div>
                </div>

                <div className="doc-library-section">
                    <div className="doc-section-header">
                        <h4>Document Library</h4>
                        <button className="upload-btn-sm" onClick={() => fileInputRef.current?.click()}>
                            <Upload size={14} /> Upload
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                        />
                    </div>

                    <div className="documents-list">
                        {documents.length === 0 ? (
                            <p className="empty-docs">No documents uploaded yet.</p>
                        ) : (
                            documents.map(doc => (
                                <div key={doc.id} className="document-item">
                                    <FileText size={20} className="doc-icon" />
                                    <div className="doc-info">
                                        <div className="flex justify-between items-start">
                                            <button
                                                className="doc-name hover:text-blue-600 text-left"
                                                title={`View ${doc.name}`}
                                                onClick={() => doc.id && typeof doc.id === 'string' ? handleViewDocument(doc.id) : null}
                                            >
                                                {doc.name}
                                            </button>
                                        </div>
                                        <div className="doc-meta">{doc.date}</div>
                                        {/* Only show verify buttons if it's a new upload with an ID (from our proof system) */}
                                        {typeof doc.id === 'string' && (
                                            <div className="flex gap-3 mt-1.5 items-center">
                                                <button
                                                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                                    onClick={() => handleVerifyClick(doc.id)}
                                                    title="Verify Document Integrity"
                                                >
                                                    <ShieldCheck size={12} /> Verify
                                                </button>
                                                <span className="text-gray-300">|</span>
                                                <button
                                                    className="text-[11px] text-slate-500 hover:text-slate-800 font-medium"
                                                    onClick={() => setSelectedProof(getDocumentProofById(doc.id))}
                                                    title="View Blockchain Verification Proof"
                                                >
                                                    View Proof
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="sidebar-footer">
                    <button className="pay-btn-large" onClick={handlePayment}>
                        <CreditCard size={18} /> Pay Application Fee
                    </button>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="lawyer-chat-main">
                <header className="lawyer-chat-topbar">
                    <div className="topbar-case-info">
                        <span className="topbar-case-title">Consultation Session</span>
                        <span className="topbar-case-id">Case #2024-001 • In Progress</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ConnectWalletButton onConnect={setWalletAddress} />
                        <div className="session-timer">⏱️ 14:30 remaining</div>
                        <button className="text-gray-500 hover:text-red-500" onClick={() => navigate(-1)}>
                            <X size={20} />
                        </button>
                    </div>
                </header>

                <div className="messages-container">
                    {messages.map((msg) => {
                        if (msg.type === 'system-payment') {
                            return (
                                <div key={msg.id} className="payment-success-msg">
                                    <Check size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                    {msg.text}
                                </div>
                            );
                        }
                        if (msg.type === 'system-upload') {
                            return (
                                <div key={msg.id} className="upload-success-msg">
                                    <Upload size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                    {msg.text}
                                </div>
                            );
                        }
                        if (msg.type === 'system-anchoring') {
                            return (
                                <div key={msg.id} className="message-row system">
                                    <AnchoringProgress currentStep={msg.step} txId={msg.txId} />
                                </div>
                            );
                        }
                        return (
                            <div key={msg.id} className={`message-row ${msg.sender}`}>
                                <div className="message-bubble">
                                    {msg.text}
                                    <span className="message-timestamp">{msg.timestamp}</span>
                                </div>
                            </div>
                        );
                    })}
                    {isTyping && (
                        <div className="message-row lawyer">
                            <div className="message-bubble" style={{ color: '#666', fontStyle: 'italic' }}>
                                Typing...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
                    <button
                        className="text-gray-400 hover:text-blue-600"
                        title="Upload Document"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload size={20} />
                    </button>
                    <textarea
                        className="chat-input-field"
                        placeholder="Type your message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />
                    <button
                        className={`bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition ${!inputText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleSendMessage}
                        disabled={!inputText.trim()}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </main>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="modal-overlay">
                    <div className="payment-modal">
                        <div className="modal-header">
                            <h2>Secure Payment</h2>
                            <button className="close-btn" onClick={() => setShowPaymentModal(false)}><X size={24} /></button>
                        </div>

                        <div className="payment-summary">
                            <div className="summary-row">
                                <span>Legal Consultation Fee</span>
                                <span>₹1200.00</span>
                            </div>
                            <div className="summary-row">
                                <span>Platform Fee</span>
                                <span>₹300.00</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total Payable</span>
                                <span>₹1500.00</span>
                            </div>
                        </div>

                        <form onSubmit={confirmPayment} className="payment-form">
                            <div className="form-group">
                                <label>Card Number</label>
                                <input type="text" placeholder="xxxx xxxx xxxx xxxx" required />
                            </div>
                            <div className="flex gap-4">
                                <div className="form-group flex-1">
                                    <label>Expiry</label>
                                    <input type="text" placeholder="MM/YY" required />
                                </div>
                                <div className="form-group flex-1">
                                    <label>CVV</label>
                                    <input type="password" placeholder="123" required />
                                </div>
                            </div>

                            <button type="submit" className="pay-confirm-btn">
                                Pay ₹1500.00 Securely
                            </button>
                        </form>

                        <div className="text-center mt-4 text-xs text-gray-400 flex items-center justify-center gap-1">
                            <ShieldCheck size={12} /> Encrypted & Secure Payment Gateway
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LawyerChat;
