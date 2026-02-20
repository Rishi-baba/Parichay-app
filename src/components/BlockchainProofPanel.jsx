import React, { useState } from 'react';
import { Copy, ExternalLink, CheckCircle, AlertTriangle, X, Clock, ShieldCheck } from 'lucide-react';

const BlockchainProofPanel = ({ proof, onClose, verificationStatus }) => {
    if (!proof) return null;

    const [copied, setCopied] = useState(null);

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(null), 2000);
    };

    const getStatusBadge = () => {
        if (verificationStatus === 'tampered') {
            return <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded text-xs font-semibold border border-red-200"><AlertTriangle size={14} /> Tampered</div>;
        }
        if (verificationStatus === 'verified') {
            return <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded text-xs font-semibold border border-green-200"><CheckCircle size={14} /> Verified</div>;
        }
        if (proof.transactionId) {
            return <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded text-xs font-semibold border border-blue-200"><ShieldCheck size={14} /> Anchored</div>;
        }
        return <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded text-xs font-semibold border border-amber-200"><Clock size={14} /> Pending</div>;
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <ShieldCheck className="text-blue-600" size={18} />
                        Blockchain Proof
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* File Info */}
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Document File</p>
                            <p className="font-medium text-slate-900 truncate max-w-[200px] text-sm" title={proof.fileName}>{proof.fileName}</p>
                            <p className="text-xs text-slate-500 mt-1">{(proof.fileSize / 1024).toFixed(2)} KB • {proof.fileType || 'PDF'}</p>
                        </div>
                        {getStatusBadge()}
                    </div>

                    {/* Transaction ID */}
                    {proof.transactionId ? (
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1.5">Algorand Transaction ID</p>
                            <div className="flex items-center gap-2">
                                <code className="text-xs bg-slate-50 border border-slate-200 p-2 rounded text-slate-600 font-mono truncate flex-1">
                                    {proof.transactionId}
                                </code>
                                <button
                                    onClick={() => handleCopy(proof.transactionId, 'tx')}
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-100 transition-all"
                                    title="Copy Transaction ID"
                                >
                                    {copied === 'tx' ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 bg-amber-50 text-amber-700 text-sm rounded-lg flex gap-3 items-start border border-amber-100">
                            <Clock size={16} className="mt-0.5 shrink-0" />
                            <p className="text-xs leading-relaxed">Transaction pending. This document hash has not been confirmed on the blockchain yet.</p>
                        </div>
                    )}

                    {/* SHA-256 Hash */}
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1.5">Cryptographic Hash (SHA-256)</p>
                        <div className="bg-slate-900 rounded-lg p-3 group relative border border-slate-800">
                            <code className="text-[11px] text-slate-300 font-mono break-all leading-relaxed block pr-6">
                                {proof.fullHash}
                            </code>
                            <button
                                onClick={() => handleCopy(proof.fullHash, 'hash')}
                                className="absolute top-2 right-2 p-1.5 bg-slate-800 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition opacity-0 group-hover:opacity-100"
                                title="Copy Hash"
                            >
                                {copied === 'hash' ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Timestamp</p>
                            <p className="text-xs text-slate-700 font-medium">{new Date(proof.uploadedAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Proof ID</p>
                            <p className="text-xs text-slate-700 font-mono truncate cursor-help" title={proof.id}>{proof.id.split('-')[0]}...</p>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-slate-50 flex gap-3">
                    {proof.transactionId ? (
                        <a
                            href={`https://testnet.algoexplorer.io/tx/${proof.transactionId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-200"
                        >
                            View on AlgoExplorer <ExternalLink size={14} />
                        </a>
                    ) : (
                        <button disabled className="flex-1 bg-slate-200 text-slate-400 py-2.5 px-4 rounded-lg text-sm font-medium cursor-not-allowed text-center">
                            Proof Not Anchored Yet
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlockchainProofPanel;
