import React from 'react';
import Column from './column';

const Board = ({ board, delColumn, addCard, delCard, editCard }) => {
    const columns = board.columns || [];

    return (
        <main className="board">
            <div className='columns-container'>
                {columns.length > 0 ? (
                    columns.map(column => (
                        <Column
                            key={column._id}
                            column={column}
                            delColumn={delColumn}
                            addCard={addCard}
                            delCard={delCard}
                            editCard={editCard}
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
