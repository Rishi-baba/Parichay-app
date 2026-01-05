import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Circle, FileText, ArrowRight } from 'lucide-react';
import '../styles/HowItWorks.css';

const steps = [
    {
        id: 1,
        title: "User Problem Intake",
        description: "You describe your legal issue in simple words. We ask only the questions that are necessary."
    },
    {
        id: 2,
        title: "Issue Classification",
        description: "The system understands the type of issue and flags urgent or safety-related situations."
    },
    {
        id: 3,
        title: "Legal Path Identification",
        description: "We map your problem to the correct legal route — complaint, notice, mediation, or court."
    },
    {
        id: 4,
        title: "Document & Evidence Check",
        description: "We identify what documents or proof may be required and help you prepare."
    },
    {
        id: 5,
        title: "Action Recommendation",
        description: "You are shown the safest and most appropriate next steps, based on your comfort."
    },
    {
        id: 6,
        title: "Automated Preparation",
        description: "Drafts, records, and checklists are prepared so you don't start from scratch."
    },
    {
        id: 7,
        title: "Outcome",
        description: "You receive a clear legal roadmap, and lawyers get structured information if you choose to proceed."
    }
];

const HowItWorks = () => {
    const navigate = useNavigate();
    const timelineRef = useRef(null);

    // Simple intersection observer for fade-in animation on scroll
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        const nodes = document.querySelectorAll('.timeline-node');
        nodes.forEach(node => observer.observe(node));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="how-it-works-page">
            <div className="hiw-intro container">
                <h1>How Parichay Works</h1>
                <p>A simple step-by-step process that guides you through legal problems.</p>
            </div>

            <div className="timeline-container container" ref={timelineRef}>
                <div className="timeline-line"></div>

                {steps.map((step, index) => (
                    <div key={step.id} className={`timeline-node ${index % 2 === 0 ? 'left' : 'right'}`}>
                        <div className="node-dot">
                            <span>{step.id}</span>
                        </div>
                        <div className="node-content">
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="hiw-cta container">
                <button className="btn-primary-lg" onClick={() => navigate('/')}>
                    Start Anonymous Legal Guidance
                </button>
                <button className="btn-secondary-text" onClick={() => navigate('/documents')}>
                    Explore Legal Documents <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default HowItWorks;
