import { useState, useEffect } from "react";
import CardForm from "./forms/card-form";

const Card = ({ card: cardState, columnId, delCard, editCard }) => {

    const [card, setCard] = useState(cardState);
    const [isCardFormVisible, setIsCardFormVisible] = useState(false);

    useEffect(() => {
        setCard(cardState);
    }, [cardState]);

    // Call API to edit the card
    const handleCardUpdate = async (updatedCardData) => {
        const updatedCard = await editCard(updatedCardData);
        if (updatedCard) {
            setCard(updatedCard);
        }
        setIsCardFormVisible(false);
    };

    // Priority CSS class logic
    const getPriorityClass = (priority) => {
        if (priority === 'urgent') return 'urgent-priority';
        if (priority === 'high') return 'high-priority';
        if (priority === 'normal') return 'normal-priority';
        return '';
    };

    return (
        <>
            <div className="card" onClick={() => setIsCardFormVisible(true)}>
                <button
                    className="delete-button"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent form visibility toggle on delete
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

            {/* CardForm is used to edit the card */}
            <CardForm
                card={card}
                isVisible={isCardFormVisible}
                onClose={() => setIsCardFormVisible(false)}
                editCard={handleCardUpdate}
                columnId={columnId}
            />
        </>
    );
};

export default Card;
