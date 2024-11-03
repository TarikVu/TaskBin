import '../css/board.css';
import '../css/column.css';
import '../css/card.css';
import Column from './column';
import Card from './card';
import React, { useState } from 'react';
import { DndContext, DragOverlay, useDroppable } from '@dnd-kit/core';

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
                return { ...col, cards: updatedCards, title: newTitle }; 
            }
            return col;
        });

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
                const oldIndex = columns.findIndex((column) => column._id === active.id);
                const newIndex = columns.findIndex((column) => column._id === over.id);
                const newColumns = columns.slice();
                const [movedColumn] = newColumns.splice(oldIndex, 1);
                newColumns.splice(newIndex, 0, movedColumn);
                editBoard({ columns: newColumns });

            } else if (isCard) { 
                const newColumnId = over.id;
                const oldColumnId = activeCard.columnId;
                if (oldColumnId !== newColumnId) {
                    const updatedColumns = columns.map(column => {

                        if (column._id === oldColumnId) {
                            return {
                                ...column,
                                cards: column.cards.filter(card => card._id !== activeCard._id)
                            };
                        }
                        else if (column._id === newColumnId) {


                            return {
                                ...column,
                                cards: [...column.cards, { ...activeCard, columnId: newColumnId }]
                            };
                        }
                        return column;

                    });
                    // Update DB
                    moveCard({
                        cardId: activeCard._id,
                        columnId: oldColumnId,
                        targetColumnId: newColumnId
                    });

                    // Update Client
                    setBoard(prevBoard => ({
                        ...prevBoard,
                        columns: updatedColumns,
                    }));
                }

            }
            setActiveCard(null);
            setActiveColumn(null);

        }
    };


    const ColumnDropArea = ({ column }) => {
        const { setNodeRef } = useDroppable({ id: column._id }); // Make the column a droppable area

        return (

            <div className="column" ref={setNodeRef}>
                <Column
                    column={column}
                    delColumn={delColumn}
                    editColumn={editColumn}
                    addCard={addCard}
                    delCard={delCard}
                    editCard={editCard}
                    propagateBoard={propagateBoard}
                />
            </div>
        );
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <main className="board">
                <div className="columns_container"> 
                        {columns.length > 0 ? (
                            columns.map((column) => (
                                <ColumnDropArea key={column._id} column={column} />
                            ))
                        ) : (
                            <div></div>
                        )} 
                </div>

                <DragOverlay>
                    <div className="drag-overlay">
                        {activeColumn ? (
                            <div className='column-overlay'>
                                <Column
                                    column={activeColumn}
                                    delColumn={() => { }}
                                    editColumn={() => { }}
                                    addCard={() => { }}
                                    delCard={() => { }}
                                    editCard={() => { }}
                                />
                            </div>
                        ) : activeCard ? (
                            <div className='card-overlay'>
                                <Card
                                    card={activeCard}
                                    columnId={() => { }}
                                    delCard={() => { }}
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
