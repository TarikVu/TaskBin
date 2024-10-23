import '../css/card.css';
import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const Card = ({ card, columnId, delCard, onCardClick }) => {
    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent triggering card click event
        delCard({ columnId, cardId: card._id });
    };

    const handleEdit = () => {
        console.log("Edit clicked");
        // Add your edit logic here
    };

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: card._id, // Use card ID for the draggable element
    });

    return (
        <div className={`card ${isDragging ? 'dragging' : ''}`} onClick={onCardClick}>
            <h3>{card.title}</h3>
            <div className="icon-container">
                <span className="icon edit-icon" onClick={handleEdit}>
                    &#9998;
                </span>

                <span className="icon delete-icon" onClick={handleDelete}>
                    &#128465;
                </span>

                {/* Make the drag icon the draggable element */}
                <span
                    ref={setNodeRef} // Attach the draggable ref to the hamburger icon
                    className="icon drag-icon"
                    onClick={(e) => e.stopPropagation()} // Prevent card click event when dragging
                    {...listeners} // Add drag listeners here
                    {...attributes} // Add drag attributes here
                >
                    &#x2630;
                </span>
            </div>
        </div>
    );
};

export default Card;
