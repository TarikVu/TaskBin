import '../css/board.css';
import React, { useState } from 'react';
import Column from './column';
import { useDraggable, DndContext, DragOverlay } from '@dnd-kit/core';

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

    // Propagate changes made w/in a col to the board for rendering w/ dnd.
    const propagateBoard = ({ columnId, updatedCards, newTitle }) => {
        const updatedColumns = columns.map(col => {
            if (col._id === columnId) {
                return { ...col, cards: updatedCards, title: newTitle }; // Update title and cards
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
        setActiveColumn(column);

    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveColumn(null);

        if (over && active.id !== over.id) {
            const oldIndex = columns.findIndex((column) => column._id === active.id);
            const newIndex = columns.findIndex((column) => column._id === over.id);

            const newColumns = columns;
            const [movedColumn] = newColumns.splice(oldIndex, 1);
            newColumns.splice(newIndex, 0, movedColumn);

            editBoard({ columns: newColumns });
        }
    };


    const DraggableColumn = ({ column }) => {
        return (
            <div className="dcolumn">
                <DragHandle columnId={column._id} />
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

    // Separate DragHandle component - Only this is draggable so the column's UI is usable.
    const DragHandle = ({ columnId }) => {
        const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
            id: columnId,
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

                {/* Drag Overlay to show a transparent copy of the dragged column */}
                <DragOverlay>
                    {activeColumn ? (
                        <div className="drag-overlay">
                            <div className="column">
                                <Column
                                    column={activeColumn}
                                    delColumn={delColumn}
                                    editColumn={editColumn}
                                    addCard={addCard}
                                    delCard={delCard}
                                    editCard={editCard}

                                />
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </main>
        </DndContext>
    );
};

export default Board;
