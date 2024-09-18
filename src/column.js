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
    const [cards, setCards] = useState(column.cards);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(column.title);

    const handleCardSelect = (card) => {
        setSelectedCard(card);
        setIsCardFormVisible(true);
    };

    const handleAddCard = async ({ title, text, priority }) => {
        const newCard = await addCard({ title, text, priority, columnId: column._id });
        if (newCard) {
            setCards(prevCards => [...prevCards, newCard]);
        }
    };

    const handleDelCard = ({ cardId }) => {
        if (delCard({ columnId: column._id, cardId })) {
            setCards((card) => cards.filter(card => card._id !== cardId));
        }
    }

    const handleEditCard = async (updatedCardData) => {
        const updatedCard = await editCard(updatedCardData);

        if (updatedCard) {
            setCards(prevCards =>
                prevCards.map(card =>
                    card._id === updatedCard._id ? updatedCard : card
                )
            );
            setSelectedCard(null);
            setIsCardFormVisible(false);
        }
    };


    const handleSetTitle = async (event) => {
        event.preventDefault();
        if (newTitle === '') {
            setNewTitle(column.title);
            setIsEditing(false);
            return;
        }
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
                            addCard={handleAddCard}
                            editCard={handleEditCard}
                            columnId={column._id}
                        />

                        <div className="column_header">
                            {/* Delete Column Button */}
                            {!isEditing && (
                                <button
                                    className='column_header_button'
                                    onClick={() => delColumn({ columnId: column._id })}>
                                    X
                                </button>
                            )}

                            {/* Title Box */}
                            {isEditing ? (
                                <form
                                    className="column_form"
                                    onSubmit={handleSetTitle}>
                                    <input
                                        className='column_form_input'
                                        type="text"
                                        maxLength={20}
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
                                <button
                                    className='column_header_button'
                                    onClick={() => setIsCardFormVisible(true)}>
                                    +
                                </button>
                            )
                            }

                        </div>

                        {/* Mapping the cards for the column */}
                        {cards.length > 0 ? (
                            cards.map(card => (
                                <Card
                                    key={card._id}
                                    card={card}
                                    columnId={column._id}
                                    delCard={handleDelCard}
                                    onCardClick={handleCardSelect}
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
