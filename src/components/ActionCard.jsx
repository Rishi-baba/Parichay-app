import React from 'react';
import { ChevronRight } from 'lucide-react';
import '../styles/ActionCard.css';

const ActionCard = ({ title, description, onClick }) => {
    return (
        <div className="action-card" onClick={onClick}>
            <div className="action-card-content">
                <h3 className="action-card-title">{title}</h3>
                <p className="action-card-desc">{description}</p>
            </div>
            <div className="action-card-icon">
                <ChevronRight color="#ff5722" size={24} />
            </div>
        </div>
    );
};

export default ActionCard;
