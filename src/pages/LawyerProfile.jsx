import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Star, Calendar, MessageSquare, ArrowLeft, ShieldCheck } from 'lucide-react';
import '../styles/LawyerProfile.css';

const LawyerProfile = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Fallback if accessed directly without state
    const lawyer = state || {
        name: "Adv. Meera Sharma",
        location: "New Delhi",
        specialization: ["Family Law", "Women Safety"],
        experience: "12+ Years",
        rating: 4.9,
        reviewCount: 128,
        languages: ["Hindi", "English", "Punjabi"],
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
    };

    return (
        <div className="lawyer-profile-page container">
            <button className="back-link-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} /> Back to Search
            </button>

            <div className="profile-header-card">
                <div className="profile-main-info">
                    <img src={lawyer.photo} alt={lawyer.name} className="profile-photo-lg" />
                    <div className="profile-text">
                        <div className="profile-name-row">
                            <h1>{lawyer.name}</h1>
                            <div className="profile-badge-verified">
                                <ShieldCheck size={16} /> Verified
                            </div>
                        </div>
                        <div className="profile-meta">
                            <span className="flex-center gap-1"><MapPin size={16} /> {lawyer.location}</span>
                            <span className="dot-sep">•</span>
                            <span className="flex-center gap-1"><Star size={16} fill="#ff9800" stroke="#ff9800" /> {lawyer.rating} ({lawyer.reviewCount} Reviews)</span>
                            <span className="dot-sep">•</span>
                            <span>{lawyer.experience} Experience</span>
                        </div>
                        <div className="profile-tags">
                            {lawyer.specialization.map((tag, i) => (
                                <span key={i} className="lawyer-tag-lg">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="profile-actions-sidebar">
                    <div className="action-box">
                        <button className="btn-primary-lg full-width">Request Consultation</button>
                        <button className="btn-secondary-lg full-width mt-2">
                            <MessageSquare size={18} /> Start Anonymous Chat
                        </button>
                        <p className="availability-text">
                            <span className="green-dot"></span> Available Today, 4:00 PM
                        </p>
                    </div>
                </div>
            </div>

            <div className="profile-content-grid">
                <div className="profile-section">
                    <h2>About</h2>
                    <p>
                        With over {lawyer.experience} of experience in high-stakes litigation, {lawyer.name} is dedicated to providing
                        compassionate and effective legal representation. Specializing in {lawyer.specialization.join(' and ')},
                        she has successfully handled over {lawyer.reviewCount * 2} cases across various district and high courts.
                    </p>
                    <p className="mt-4">
                        "My goal is to make the legal process as transparent and stress-free as possible for my clients,
                        especially in sensitive matters related to family and women's safety."
                    </p>
                </div>

                <div className="profile-section">
                    <h2>Practice Areas</h2>
                    <ul className="practice-list">
                        {lawyer.specialization.map(s => <li key={s}>{s}</li>)}
                        <li>Legal Consultation</li>
                        <li>Document Review</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LawyerProfile;
