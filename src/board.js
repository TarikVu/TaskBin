import React from 'react';
import Column from './column';

const Board = ({ board, deleteColumn, addCard }) => {
    const columns = board.columns || [];

    return (
        <main className="board">
            <div className='columns-container'>
                {columns.length > 0 ? (
                    columns.map(column => (
                        <Column
                            key={column._id}
                            column={column}
                            deleteColumn={deleteColumn}
                            addCard={addCard}
                        />
                    ))
                ) : (
                    <div>No columns</div>
                )}
            </div>
        </main>
    );
};

export default Board;
