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
    setBoard,
}) => {
    const columns = board.columns || [];
    const [activeColumn, setActiveColumn] = useState(null); // To store the currently dragged column

    const handleDragStart = (event) => {
        const { active } = event;
        const column = columns.find((column) => column._id === active.id);
        setActiveColumn(column); // Set the active dragged column
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveColumn(null); // Reset active column after drag ends

        if (over && active.id !== over.id) {
            const oldIndex = columns.findIndex((column) => column._id === active.id);
            const newIndex = columns.findIndex((column) => column._id === over.id);

            const newColumns = [...columns];
            const [movedColumn] = newColumns.splice(oldIndex, 1);
            newColumns.splice(newIndex, 0, movedColumn);

            setBoard((prevBoard) => ({ ...prevBoard, columns: newColumns }));
        }
    };

      // DraggableColumn component - Only drag handle is draggable
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
                    />
                </div>
            </div>
        );
    };

    // Separate DragHandle component - Only this is draggable
    const DragHandle = ({ columnId }) => {
        const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
            id: columnId,
        });

        return (
            <div
                ref={setNodeRef} // Only the drag handle is draggable
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
