import '../css/card.css';
import React from 'react';

const Card = ({ card, columnId, delCard, onCardClick }) => {
    // Priority CSS class logic
    const getPriorityClass = (priority) => {
        if (priority === 'urgent') return 'urgent-priority';
        if (priority === 'high') return 'high-priority';
        if (priority === 'normal') return 'normal-priority';
        return '';
    };

    return (
        <div className="card" onClick={() => onCardClick(card)}> {/* Trigger CardForm visibility and pass card data */}
            <button
                className="delete-button"
                onClick={(e) => {
                    e.stopPropagation();
                    delCard({ columnId, cardId: card._id });
                }}
            >
                X
            </button>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
            <span className={`card-priority ${getPriorityClass(card.priority)}`}>
                {card.priority}
            </span>
        </div>
    );
};

export default Card;
