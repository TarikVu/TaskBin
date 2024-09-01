import React from 'react';
import Column from './column';

function Board({ board }) {

    if (!board || !board.columns) {
        return <div>Loading...</div>; // Render a loading state or message
    }
    return (
        <main className="main-content">
            {board.columns.map((column) => (
                <Column key={column.id} column={column} />
            ))}
            <Column></Column>
        </main>
    );
}

export default Board;
