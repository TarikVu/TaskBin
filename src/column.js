import React, { useState } from 'react';
import CardForm from './forms/card-form';
import Card from './card';

const Column = ({ column, delColumn, addCard, delCard, editCard }) => {
    const [isCardFormVisible, setIsCardFormVisible] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const handleCardClick = (card) => {
        setSelectedCard(card);
        setIsCardFormVisible(true);
    };

    const handleCardUpdate = async (updatedCardData) => {
        const updatedCard = await editCard(updatedCardData);
        if (updatedCard) {
            // Update the column with the new card data
            const updatedCards = column.cards.map(card =>
                card._id === updatedCard._id ? updatedCard : card
            );
            column.cards = updatedCards;
            setSelectedCard(null);
            setIsCardFormVisible(false);
        }
    };

    return (
        <div className="column">
            {!column ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {/* Hidden UI until add card is pressed */}
                    <CardForm
                        card={selectedCard}
                        isVisible={isCardFormVisible}
                        onClose={() => {
                            setIsCardFormVisible(false);
                            setSelectedCard(null);
                        }}
                        addCard={addCard}
                        editCard={handleCardUpdate}
                        columnId={column._id}
                    />
                    <div className="column_header">
                        <button onClick={() => delColumn({ columnId: column._id })}>
                            X
                        </button>
                        <h1>{column.title}</h1>
                        <button onClick={() => setIsCardFormVisible(true)}>
                            + Add Card
                        </button>
                    </div>
                    {column.cards.length > 0 ? (
                        column.cards.map(card => (
                            <Card
                                key={card._id}
                                card={card}
                                columnId={column._id}
                                delCard={delCard}
                                onCardClick={handleCardClick} // Pass callback function
                            />
                        ))
                    ) : (
                        <div>No cards available</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Column;
