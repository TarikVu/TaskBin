import { useState } from "react";
import CardForm from "./forms/card-form";
const Card = ({ card, columnId, delCard, editCard }) => {

    const [isCardFormVisible, setIsCardFormVisible] = useState(false);

    const getPriorityClass = (priority) => {
        if (priority === 'urgent') return 'urgent-priority';
        if (priority === 'high') return 'high-priority';
        if (priority === 'normal') return 'normal-priority';
        return '';
    }
    return (
        <>
            <div className="card" onClick={() => setIsCardFormVisible(true)}>
                <button
                    className="delete-button"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevents the card click from triggering
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


            <CardForm
                card={card}
                isVisible={isCardFormVisible}
                onClose={() => setIsCardFormVisible(false)}
                editCard={editCard}
                columnId={columnId}
            />

        </>
    );
};

export default Card;

