import React from 'react';
import { ChevronRight } from 'lucide-react';
import '../styles/DocCard.css';

const DocCard = ({ icon: Icon, title, description, cta, color = "#ff5722", onClick }) => {
    return (
        <div className="doc-card">
            <div className="doc-card-header">
                <div className="doc-icon-wrapper">
                    <Icon size={24} color="#333" />
                </div>
                <div className="doc-accent-dot" style={{ backgroundColor: color }}></div>
            </div>

            <div className="doc-card-body">
                <h3 className="doc-title">{title}</h3>
                <p className="doc-desc">{description}</p>
            </div>

            <button className="doc-cta-btn" onClick={onClick}>
                <span>{cta}</span>
                <div className="cta-icon">
                    <ChevronRight size={16} color="#fff" />
                </div>
            </button>
        </div>
    );
};

export default DocCard;
