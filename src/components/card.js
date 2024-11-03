import '../css/card.css';
import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const Card = ({ card, columnId, delCard, editCard }) => {
    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent triggering card click event
        delCard({ columnId, cardId: card._id });
    };

    const handleEdit = () => {
        console.log("Edit clicked");
        editCard();
    };

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: card._id, // Use card ID for the draggable element
    });

    return (
        <div
            ref={setNodeRef}
            className={`card ${isDragging ? 'dragging' : ''}`}
        /* onClick={handleClick} */
        >
            <h3>{card.title}</h3>
            <div className="icon-container">




                {/* Make the drag icon the draggable element */}
                <button
                    className="drag-icon"
                    onClick={(e) => e.stopPropagation()} // Prevent card click event when dragging
                    {...listeners} // Add drag listeners here
                    {...attributes} // Add drag attributes here
                    aria-label="Drag Card"
                >
                    &#x2630;
                </button>
                <button className="icon" onClick={editCard} aria-label="Edit Card">
                    &#9998;
                </button>
                <button className="icon-del" onClick={handleDelete} aria-label="Delete Card">
                    &#128465;
                </button>
            </div>
        </div>
    );

};

export default Card;
