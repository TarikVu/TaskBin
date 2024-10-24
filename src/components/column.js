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
    moveCard
}) => {
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
            const updatedCards = [...cards, newCard];
            setCards(updatedCards);
            propagateBoard({ columnId: column._id, updatedCards, newTitle });
        }
    };

    const handleDelCard = async ({ cardId }) => {
        const response = await delCard({ columnId: column._id, cardId });
        if (response) {
            const updatedCards = cards.filter(card => card._id !== cardId);
            setCards(updatedCards);
            propagateBoard({ columnId: column._id, updatedCards, newTitle });
        }
    };

    const handleEditCard = async (updatedCardData) => {
        const updatedCard = await editCard(updatedCardData);
        if (updatedCard) {
            const updatedCards = cards.map(card =>
                card._id === updatedCard._id ? updatedCard : card
            );
            setCards(updatedCards);
            propagateBoard({ columnId: column._id, updatedCards, newTitle });
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
                propagateBoard({ columnId: column._id, updatedCards: column.cards, newTitle: updatedColumn.title });
            }
        }
        setIsEditing(false);
    };

    const { setNodeRef } = useDroppable({ id: column._id });

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        console.log(active);
        // Check if a card is dropped over another column
        if (over && active.id !== over.id) {
            // Check if the dropped card is in a different column
            const targetColumnId = over.id; // Assume the target column has the ID of its respective droppable
            if (targetColumnId !== column._id) {

                const response = await moveCard({ cardId: active.id, columnId: column._id, targetColumnId });
                console.log(response);
                if (response) {
                    // Handle successful move (e.g., update state)
                    propagateBoard({ columnId: targetColumnId, updatedCards: response.updatedCards, newTitle });
                }
            } else {
                // Move within the same column
                const oldIndex = cards.findIndex(card => card._id === active.id);
                const newIndex = cards.findIndex(card => card._id === over.id);

                const reorderedCards = Array.from(cards);
                const [movedCard] = reorderedCards.splice(oldIndex, 1);
                reorderedCards.splice(newIndex, 0, movedCard);

                setCards(reorderedCards);
                propagateBoard({ columnId: column._id, updatedCards: reorderedCards, newTitle });
            }
        }
    };




    return (
        <div ref={setNodeRef} >
            {!column ? (<div>Loading...</div>) : (
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
                                    onDragEnd={handleDragEnd} // Pass the drag end handler
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
