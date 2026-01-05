import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, Sparkles } from 'lucide-react';
import LawyerCard from '../components/LawyerCard';
import '../styles/FindLawyer.css';

// Mock Data
const MOCK_LAWYERS = [
    {
        id: 1,
        name: "Adv. Meera Sharma",
        location: "New Delhi",
        specialization: ["Family Law", "Women Safety"],
        experience: "12+ Years",
        rating: 4.9,
        reviewCount: 128,
        languages: ["Hindi", "English", "Punjabi"],
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        id: 2,
        name: "Adv. Pramod Bharadkar",
        location: "Mumbai",
        specialization: ["Corporate Law", "Property Law"],
        experience: "15+ Years",
        rating: 4.8,
        reviewCount: 215,
        languages: ["Marathi", "English", "Hindi"],
        photo: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        id: 3,
        name: "Adv. Savita Deshmukh",
        location: "Pune",
        specialization: ["Criminal Law", "Civil Litigation"],
        experience: "8+ Years",
        rating: 4.7,
        reviewCount: 84,
        languages: ["Marathi", "English", "Hindi"],
        photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        id: 4,
        name: "Adv. Amit Verma",
        location: "Bangalore",
        specialization: ["Labour Law", "Consumer Rights"],
        experience: "10+ Years",
        rating: 4.6,
        reviewCount: 92,
        languages: ["Kannada", "English", "Hindi"],
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        id: 5,
        name: "Adv. Sanya Kapoor",
        location: "Gurgaon",
        specialization: ["Women Safety", "Family Law"],
        experience: "6+ Years",
        rating: 4.9,
        reviewCount: 56,
        languages: ["English", "Hindi"],
        photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=200&h=200"
    }
];

const categories = ["Family Law", "Criminal Law", "Corporate Law", "Property Law", "Labour Law"];

const FindLawyer = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lawyers, setLawyers] = useState(MOCK_LAWYERS);

    const handleMatchMe = () => {
        setLoading(true);
        setTimeout(() => {
            // Simulate filtering
            let filtered = MOCK_LAWYERS;
            if (selectedCategory) {
                filtered = filtered.filter(l => l.specialization.some(s => s.includes(selectedCategory)));
            }
            if (searchTerm) {
                filtered = filtered.filter(l =>
                    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    l.specialization.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }
            setLawyers(filtered);
            setLoading(false);
        }, 600);
    };

    const toggleCategory = (cat) => {
        setSelectedCategory(prev => prev === cat ? null : cat);
    };

    const handleCardClick = (lawyer) => {
        navigate('/lawyer-profile', { state: lawyer });
    };

    return (
        <div className="find-lawyer-page">
            <div className="search-header container">
                <div className="search-bar-container">
                    <div className="input-group-search">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Describe your issue (e.g. My employer didn't pay salary)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="divider-vertical"></div>
                    <div className="input-group-location">
                        <MapPin size={20} className="location-icon" />
                        <input
                            type="text"
                            placeholder="City or State"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <button className="match-btn" onClick={handleMatchMe}>
                        <Sparkles size={18} /> Match Me
                    </button>
                </div>

                <div className="quick-categories">
                    <span>Quick categories:</span>
                    <div className="chips-wrapper">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => toggleCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="results-section container">
                <div className="results-header">
                    <h2>{loading ? 'Finding matches...' : `${lawyers.length} Verified Professionals`}</h2>
                    <button className="filter-btn-text">
                        <SlidersHorizontal size={16} /> More Filters
                    </button>
                </div>

                {loading ? (
                    <div className="skeleton-grid">
                        {[1, 2, 3].map(n => <div key={n} className="skeleton-card"></div>)}
                    </div>
                ) : (
                    <div className="lawyer-grid">
                        {lawyers.map((lawyer) => (
                            <LawyerCard
                                key={lawyer.id}
                                {...lawyer}
                                onClick={() => handleCardClick(lawyer)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindLawyer;
