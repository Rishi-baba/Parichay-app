import React from 'react';
import ActionCard from '../components/ActionCard';
import { Shield, Lock } from 'lucide-react';
import '../styles/WomenSafety.css';

const WomenSafety = () => {
    return (
        <div className="safety-page">
            <div className="safety-container container">
                <div className="safety-header">
                    <div className="safety-badge">
                        <span className="dot"></span> WOMEN'S SAFETY & ANONYMITY
                    </div>
                    <h1>A private space to decide<br />what you want to do.</h1>
                    <p className="safety-subtitle">
                        You can explore help, create records, or talk to someone — without sharing your identity or taking any step you're not ready for.
                    </p>
                </div>

                <div className="safety-content-grid">
                    <div className="safety-options">
                        <ActionCard
                            title="Understand your rights"
                            description="Learn what the law says and what options exist"
                            onClick={() => { }}
                        />
                        <ActionCard
                            title="Write a private statement"
                            description="Create a record you can keep or use later"
                            onClick={() => { }}
                        />
                        <ActionCard
                            title="Talk to someone you trust"
                            description="Connect anonymously with verified support groups"
                            onClick={() => { }}
                        />
                    </div>
                    <div className="safety-visual">
                        {/* Placeholder for the moody image */}
                        <div className="visual-placeholder">
                            <img src="https://i.pinimg.com/736x/21/a0/8e/21a08e657c268dce906c2ce414167708.jpg" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WomenSafety;
