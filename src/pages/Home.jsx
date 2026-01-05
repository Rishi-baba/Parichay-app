import React from 'react';
import TriageInput from '../components/TriageInput';
import '../styles/Home.css';

const Home = () => {
    return (
        <div className="home-page">
            <div className="hero-section container">
                <div className="used-for-badge">
                    <span>🏛️ USED FOR REAL-LIFE LEGAL ISSUES ACROSS INDIA</span>
                </div>

                <h1 className="hero-title">
                    The law can be confusing<br />
                    Parichay makes it <span className="text-orange">simple.</span>
                </h1>

                <p className="hero-subtitle">
                    Get safe, anonymous legal guidance in simple language — anytime, anywhere in India.
                </p>

                <div className="triage-container">
                    <TriageInput />
                </div>
            </div>
        </div>
    );
};

export default Home;
