import React, { useState } from 'react';
import CardForm from './forms/card-form';
import Card from './card';

const Column = ({
    column,
    delColumn,
    editColumn,
    addCard,
    delCard,
    editCard }) => {

    const [isCardFormVisible, setIsCardFormVisible] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(column.title);

    const handleCardClick = (card) => {
        setSelectedCard(card);
        setIsCardFormVisible(true);
    };

    const handleCardUpdate = async (updatedCardData) => {
        const updatedCard = await editCard(updatedCardData);
        if (updatedCard) {
            const updatedCards = column.cards.map(card =>
                card._id === updatedCard._id ? updatedCard : card
            );
            column.cards = updatedCards;
            setSelectedCard(null);
            setIsCardFormVisible(false);
        }
    };

    const handleSetTitle = async (event) => {
        event.preventDefault(); // Prevent default form submission


        if (newTitle !== column.title) {
            const updatedColumn = await editColumn({ columnId: column._id, title: newTitle });
            if (updatedColumn) {
                setNewTitle(updatedColumn.title);
            }
        }
        setIsEditing(false);
    };

    return (
        <div className="column">
            {!column ? (<div>Loading...</div>) :
                (
                    <div>
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
                            {/* Delete Column Button */}
                            {!isEditing && (
                                <button
                                    onClick={() => delColumn({ columnId: column._id })}>
                                    X
                                </button>
                            )}

                            {/* Title Box */}
                            {isEditing ? (
                                <form onSubmit={handleSetTitle}>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        onBlur={handleSetTitle}  // Save on blur
                                        autoFocus
                                        required
                                    />
                                </form>
                            ) : (
                                <h1 onClick={() => setIsEditing(true)}>{newTitle}</h1>
                            )}

                            {/* Add card Button */}
                            {!isEditing && (
                                <button onClick={() => setIsCardFormVisible(true)}>
                                    + Add Card
                                </button>
                            )
                            }

                        </div>

                        {/* Mapping the cards for the column */}
                        {column.cards.length > 0 ? (
                            column.cards.map(card => (
                                <Card
                                    key={card._id}
                                    card={card}
                                    columnId={column._id}
                                    delCard={delCard}
                                    onCardClick={handleCardClick}
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
