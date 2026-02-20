import React, { useState } from 'react';
import { connectWallet } from '../utils/algorandService';
import { ShieldCheck, Check } from 'lucide-react';

const ConnectWalletButton = ({ onConnect }) => {
    const [address, setAddress] = useState(null);
    const [connecting, setConnecting] = useState(false);

    const handleConnect = async () => {
        setConnecting(true);
        try {
            const connectedAddress = await connectWallet();
            setAddress(connectedAddress);
            if (onConnect) onConnect(connectedAddress);
        } catch (error) {
            console.error(error);
        } finally {
            setConnecting(false);
        }
    };

    if (address) {
        return (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm border border-green-200">
                <Check size={14} />
                <span className="font-medium font-mono">{address.substring(0, 4)}...{address.substring(address.length - 4)}</span>
            </div>
        );
    }

    return (
        <button
            onClick={handleConnect}
            disabled={connecting}
            className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
            <ShieldCheck size={16} />
            {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
    );
};

export default ConnectWalletButton;
