import '../css/board.css';
import '../css/column.css';
import '../css/card.css';
import React, { useState } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';

const Board = ({
    board,
    delColumn,
    editColumn,
    addCard,
    delCard,
    editCard,
    moveCard,
    editBoard,
    setBoard,
}) => {
    const columns = board.columns || [];
    const [activeColumn, setActiveColumn] = useState(null);
    const [activeCard, setActiveCard] = useState(null);

    // Propagate changes made within a column to the board for rendering with DnD
    const propagateBoard = ({ columnId, updatedCards, newTitle }) => {
        const updatedColumns = columns.map(col => {
            if (col._id === columnId) {
                return { ...col, cards: updatedCards, title: newTitle }; // Update title and cards
            }
            return col;
        });

        console.log("propagate board with ", updatedColumns);

        setBoard(prevBoard => ({
            ...prevBoard,
            columns: updatedColumns,
        }));
    };

    const handleDragStart = (event) => {
        const { active } = event;
        const column = columns.find((column) => column._id === active.id);
        const card = columns.flatMap(col => col.cards).find((card) => card._id === active.id);

        if (column) {
            setActiveColumn(column);
        } else if (card) {
            // Add columnId to activeCard state for removal, Card model does not include col id
            const cardColumn = columns.find((col) => col.cards.some((c) => c._id === card._id));
            setActiveCard({ ...card, columnId: cardColumn?._id });
        }
    };


    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over) {
            const isColumn = columns.find((column) => column._id === over.id);
            const isCard = columns.flatMap(col => col.cards).find((card) => card._id === active.id);

            if (isColumn && !isCard) {
                // Handle column reordering
                const oldIndex = columns.findIndex((column) => column._id === active.id);
                const newIndex = columns.findIndex((column) => column._id === over.id);

                const newColumns = columns.slice();
                const [movedColumn] = newColumns.splice(oldIndex, 1);
                newColumns.splice(newIndex, 0, movedColumn);

                editBoard({ columns: newColumns });  // Update columns
            } else if (isCard) {
                // Handle card moving logic
                const newColumnId = over.id;
                const oldColumnId = activeCard.columnId; // NULL CARD dOESNT HOLD COLUMN ID
                console.log("Active card", activeCard);
                console.log("old id", oldColumnId);

                if (oldColumnId !== newColumnId) {
                    // Create a new copy of the columns array
                    const updatedColumns = columns.map(column => {

                        if (column._id === oldColumnId) {
                            // Remove the card from the old column
                            console.log("removing ");
                            return {
                                ...column,
                                cards: column.cards.filter(card => card._id !== activeCard._id)
                            };
                        }
                        else if (column._id === newColumnId) {
                            // Add the card to the new column
                            console.log("Adding ");

                            return {
                                ...column,
                                cards: [...column.cards, { ...activeCard, columnId: newColumnId }]
                            };
                        }
                        return column;

                    });
                    console.log(updatedColumns);

                    // Update the board with the modified columns array
                    editBoard({ columns: updatedColumns });
                }
            }
        }
        setActiveCard(null);
        setActiveColumn(null);
    };


    const DraggableColumn = ({ column }) => {
        const { setNodeRef } = useDroppable({ id: column._id }); // Make the column a droppable area

        return (
            <div className="dcolumn" ref={setNodeRef}>
                <DragHandle id={column._id} />
                <div className="column">
                    <Column
                        column={column}
                        delColumn={delColumn}
                        editColumn={editColumn}
                        addCard={addCard}
                        delCard={delCard}
                        editCard={editCard}
                        moveCard={moveCard}
                        propagateBoard={propagateBoard}
                    />
                </div>
            </div>
        );
    };

    const DragHandle = ({ id }) => {
        const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
            id: id,
        });

        return (
            <div
                ref={setNodeRef}
                className={`drag-handle ${isDragging ? 'dragging' : ''}`}
                {...listeners}
                {...attributes}
            >
                &#x2630;
            </div>
        );
    };

    const Column = ({ column, delColumn, editColumn, addCard, delCard, editCard, moveCard }) => {
        const cards = column.cards || [];
        return (
            <div className="column-container">
                <h2>{column.title}</h2>
                <div className="cards">
                    {cards.map(card => (
                        <Card
                            key={card._id}
                            card={card}
                            columnId={column._id}
                            delCard={delCard}
                            onCardClick={() => { }}
                        />
                    ))}
                </div>
                {/* Add more column functionality like adding a card here */}
            </div>
        );
    };

    const Card = ({ card, columnId, delCard, onCardClick }) => {
        const handleDelete = (e) => {
            e.stopPropagation(); // Prevent triggering card click event
            delCard({ columnId, cardId: card._id });
        };

        const handleClick = () => {
            onCardClick(card);
        };

        const handleEdit = () => {
            console.log("Edit clicked");
            // Add your edit logic here
        };

        const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
            id: card._id, // Use card ID for the draggable element
        });

        return (
            <div
                ref={setNodeRef}
                className={`card ${isDragging ? 'dragging' : ''}`}
                onClick={handleClick}>
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

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <main className="board">
                <div className="columns_container">
                    <div className="columns_table">
                        {columns.length > 0 ? (
                            columns.map((column) => (
                                <DraggableColumn key={column._id} column={column} />
                            ))
                        ) : (
                            <div>No columns</div>
                        )}
                    </div>
                </div>

                {/* Drag Overlay to show a transparent copy of the dragged column or card */}
                <DragOverlay>
                    <div className="drag-overlay">
                        {activeColumn ? (
                            <div className='column'>
                                <Column
                                    column={activeColumn}
                                    delColumn={delColumn}
                                    editColumn={editColumn}
                                    addCard={addCard}
                                    delCard={delCard}
                                    editCard={editCard}
                                />
                            </div>
                        ) : activeCard ? (
                            <div className='card'>
                                <Card
                                    card={activeCard}
                                    columnId={activeCard.columnId}
                                    delCard={delCard}
                                    onCardClick={() => { }}
                                />
                            </div>
                        ) : null}
                    </div>
                </DragOverlay>
            </main>
        </DndContext>
    );
};

export default Board;
