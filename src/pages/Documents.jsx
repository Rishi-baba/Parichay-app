import React from 'react';
import { useNavigate } from 'react-router-dom';
import DocCard from '../components/DocCard';
import { Shield, Key, Briefcase, FileText, Home, DollarSign, ArrowRight } from 'lucide-react';
import '../styles/Documents.css';

const documentsList = [
    {
        icon: Shield,
        title: "Police Complaint Draft",
        description: "Write a formal complaint you can submit to the police.",
        cta: "Create draft",
        color: "#ff5722"
    },
    {
        icon: Key,
        title: "Tenant-Landlord Notice",
        description: "Generate a legal notice for eviction, deposit, or rental disputes.",
        cta: "Create notice",
        color: "#ff5722"
    },
    {
        icon: Briefcase,
        title: "Workplace Complaint Letter",
        description: "Create a written complaint for salary, harassment, or work issues.",
        cta: "Create letter",
        color: "#ff5722"
    },
    {
        icon: FileText,
        title: "Legal Notice",
        description: "Draft a formal notice before taking legal action.",
        cta: "Create notice",
        color: "#ff5722"
    },
    {
        icon: Home,
        title: "Rent / Property Agreement",
        description: "Create a simple rental or property agreement draft.",
        cta: "Create agreement",
        color: "#ff5722"
    },
    {
        icon: DollarSign,
        title: "Payment Demand Letter",
        description: "Write a formal letter to recover pending payments.",
        cta: "Create letter",
        color: "#ff5722"
    }
];

const Documents = () => {
    const navigate = useNavigate();

    const handleCreate = (docType) => {
        navigate('/document-flow', { state: { docType } });
    };

    return (
        <div className="documents-page">
            <div className="docs-header container">
                <div className="docs-badge">
                    <span className="dot"></span> DOCUMENTATION
                </div>
                <h1>Create Legal documentation<br />without confusion.</h1>
                <p className="docs-subtitle">
                    No legal Language needed. Answer a few questions and download our documents.
                </p>
            </div>

            <div className="docs-grid container">
                {documentsList.map((doc, index) => (
                    <DocCard
                        key={index}
                        {...doc}
                        onClick={() => handleCreate(doc.title)}
                    />
                ))}
            </div>

            <div className="how-it-works-section container">
                <h3>How it works?</h3>
                <div className="steps-row">
                    <div className="step-item">
                        <span>Answer a few questions</span>
                    </div>
                    <ArrowRight className="step-arrow" size={20} />
                    <div className="step-item">
                        <span>We format the document</span>
                    </div>
                    <ArrowRight className="step-arrow" size={20} />
                    <div className="step-item">
                        <span>Download & decide next steps</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Documents;
