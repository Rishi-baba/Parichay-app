import React from 'react';
import { Star, MapPin, MessageCircle, ArrowRight } from 'lucide-react';
import '../styles/LawyerCard.css';

const LawyerCard = ({
    name,
    location,
    specialization,
    experience,
    rating,
    reviewCount,
    languages,
    photo,
    onClick
}) => {
    return (
        <div className="lawyer-card" onClick={onClick}>
            <div className="lawyer-card-header">
                <div className="lawyer-photo-wrapper">
                    <img src={photo} alt={name} className="lawyer-photo" />
                    <div className="verified-badge" title="Verified Professional">
                        <span className="shield-icon">🛡️</span>
                    </div>
                </div>
                <div className="lawyer-info-primary">
                    <div className="lawyer-name-row">
                        <h3>{name}</h3>
                        <div className="rating-pill">
                            <Star size={12} fill="#ff9800" stroke="#ff9800" />
                            <span>{rating}</span>
                        </div>
                    </div>
                    <div className="location-row">
                        <MapPin size={14} color="#777" />
                        <span>{location}</span>
                    </div>
                    <div className="tags-row">
                        {specialization.slice(0, 2).map((tag, i) => (
                            <span key={i} className="lawyer-tag">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lawyer-bio-snippet">
                <p>Specializing in {specialization.join(', ').toLowerCase()} with a compassionate approach.</p>
            </div>

            <div className="lawyer-stats-row">
                <div className="stat-box">
                    <label>EXPERIENCE</label>
                    <span>{experience}</span>
                </div>
                <div className="stat-box">
                    <label>REVIEWS</label>
                    <span>{reviewCount} verified</span>
                </div>
            </div>

            <div className="languages-row">
                <span>文A</span> {languages.join(', ')}
            </div>

            <div className="lawyer-card-actions">
                <button className="book-btn">
                    Book Appointment
                </button>
                <button className="chat-btn-icon" title="Quick question">
                    <MessageCircle size={20} />
                </button>
            </div>
        </div>
    );
};

export default LawyerCard;
