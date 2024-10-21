import '../css/board.css';
import React from 'react';
import Column from './column';
import { useDraggable, DndContext } from '@dnd-kit/core';

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

    const handleDragEnd = (event) => {
        
        const { active, over } = event;

        // Check if over is null or the dragged item and the drop target are the same
        if (over && active.id !== over.id) {
            const oldIndex = columns.findIndex(column => column._id === active.id);
            const newIndex = columns.findIndex(column => column._id === over.id);

            // Rearrange columns based on the new index
            const newColumns = [...columns];
            const [movedColumn] = newColumns.splice(oldIndex, 1);
            newColumns.splice(newIndex, 0, movedColumn);

            // Update the board state with the new columns order
            setBoard(prevBoard => ({ ...prevBoard, columns: newColumns }));
        }
    };

    const DraggableColumn = ({ column }) => {
        const { attributes, listeners, setNodeRef } = useDraggable({
            id: column._id,
        });

        return (

            <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                className='dcolumn' 
            >
                <Column
                    column={column}
                    delColumn={delColumn}
                    editColumn={editColumn}
                    addCard={addCard}
                    delCard={delCard}
                    editCard={editCard}
                />
            </div>
        );
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <main className="board">
                <div className='columns_container'>
                    <div className='columns_table'>
                        {columns.length > 0 ? (
                            columns.map(column => (
                                <DraggableColumn key={column._id} column={column} />
                            ))
                        ) : (
                            <div>No columns</div>
                        )}
                    </div>
                </div>
            </main>
        </DndContext>
    );
};

export default Board;
