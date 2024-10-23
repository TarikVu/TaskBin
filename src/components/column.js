import '../css/column.css';
import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import CardForm from '../forms/card-form';
import Card from './card';

const Column = ({
    column,
    delColumn,
    editColumn,
    addCard,
    delCard,
    editCard,
    propagateBoard,
}) => {
    const [isCardFormVisible, setIsCardFormVisible] = useState(false);
    const [cards, setCards] = useState(column.cards);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(column.title);

    // Drag and Drop
    const { setNodeRef } = useDroppable({ id: column._id });

    const handleCardSelect = (card) => {
        setSelectedCard(card);
        setIsCardFormVisible(true);
    };

    const handleAddCard = async ({ title, text, priority }) => {
        const newCard = await addCard({ title, text, priority, columnId: column._id });
        if (newCard) {
            const updatedCards = [...cards, newCard];
            setCards(updatedCards);

            // Update the board columns by calling the function passed as a prop
            propagateBoard(column._id, updatedCards);
        }
    };

    const handleDelCard = ({ cardId }) => {
        const updatedCards = cards.filter(card => card._id !== cardId);
        setCards(updatedCards);

        // Update the board columns by calling the function passed as a prop
        propagateBoard(column._id, updatedCards);
    };

    const handleEditCard = async (updatedCardData) => {
        const updatedCard = await editCard(updatedCardData);
        if (updatedCard) {
            const updatedCards = cards.map(card =>
                card._id === updatedCard._id ? updatedCard : card
            );
            setCards(updatedCards);

            // Update the board columns by calling the function passed as a prop
            propagateBoard(column._id, updatedCards);
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
        <div ref={setNodeRef}  >
            {!column ? (<div>Loading...</div>) : (
                <div  >
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
                                &#x1F5D9;
                            </button>
                        )}

                        {/* Title Box */}
                        {isEditing ? (
                            <form
                                className="column_title_form"
                                onSubmit={handleSetTitle}>
                                <input
                                    className='column_title_form_input'
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
                                add card
                            </button>
                        )}
                    </div>

                    {/* New content container */}
                    <div className="column_content">
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
                </div>
            )}
        </div>
    );
};

export default Column;
