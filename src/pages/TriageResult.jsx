import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ActionCard from '../components/ActionCard';
import '../styles/TriageResult.css';

const TriageResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const issue = location.state?.issue || "Undefined Issue";

    return (
        <div className="triage-result-page container">
            <div className="result-header fade-in">
                <div className="result-badge">TRIAGE COMPLETE</div>
                <h1>Here's what you can do.</h1>
                <p className="issue-summary">
                    <strong>Based on your issue:</strong>
                </p>
            </div>

            <div className="result-grid fade-in" style={{ animationDelay: '0.2s' }}>
                <ActionCard
                    title="Understand your legal options"
                    description="Read simplified laws related to your issue."
                    onClick={() => { }}
                />
                <ActionCard
                    title="Prepare documents"
                    description="Draft a formal complaint or notice immediately."
                    onClick={() => navigate('/documents')}
                />
                <ActionCard
                    title="Talk to a lawyer"
                    description="Connect with a pro-bono lawyer for advice."
                    onClick={() => navigate('/find-lawyer')}
                />
            </div>
        </div>
    );
};

export default TriageResult;
