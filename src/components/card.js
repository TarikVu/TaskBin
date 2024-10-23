import '../css/card.css';
import React from 'react';

const Card = ({ card, columnId, delCard, onCardClick }) => {
    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent triggering card click event
        delCard({ columnId, cardId: card._id });
    };

    return (
        <div className="card" onClick={() => onCardClick(card)}>
            <h3>{card.title}</h3>
            <div className="icon-container">
                <span className="icon edit-icon" onClick={() => console.log("Edit clicked")}>
                    &#9998; {/* Edit icon (pencil) */}
                </span>
                <span className="icon delete-icon" onClick={handleDelete}>
                    &#128465; {/* Trash can icon */}
                </span>
                <span className="icon drag-icon" onClick={() => console.log("Drag clicked")}>
                    &#x2630; {/* Drag handle icon (hamburger) */}
                </span>
            </div>
        </div>
    );
};

export default Card;
