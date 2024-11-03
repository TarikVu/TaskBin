import '../css/column.css';
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
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

    const { attributes, listeners, setNodeRef } = useDraggable({
        id: column._id,
    });



    return (
        <div ref={setNodeRef}>
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
                        
                        {isEditing ? (
                            
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onBlur={handleSetTitle}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSetTitle();
                                }}
                                autoFocus
                                className="column_title_input" // Add CSS as needed for styling
                            />
                        ) : 
                        (
                            <h1 onClick={() => setIsEditing(true)}>{newTitle}</h1>
                        )}

                        <div className="header-buttons">
                        <div
                                className="column_header_button_drag"
                                onClick={(e) => e.stopPropagation()}
                                {...listeners}
                                {...attributes}>
                                &#x2630;
                            </div>
                            <button
                                className="column_header_button"
                                onClick={() => setIsCardFormVisible(true)}>
                                +
                            </button>

                            
                           

                            <button
                                className="column_header_delbutton"
                                onClick={() => delColumn({ columnId: column._id })}>
                                &#x1F5D9;
                            </button>

                        </div>
                    </div>

                    <div className="column_content">
                        {cards.length > 0 ? (
                            cards.map(card => (
                                <Card
                                    key={card._id}
                                    card={card}
                                    columnId={column._id}
                                    delCard={handleDelCard}
                                    editCard={() => {
                                        setSelectedCard(card);
                                        setIsCardFormVisible(true);
                                    }}
                                />
                            ))
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Column;
