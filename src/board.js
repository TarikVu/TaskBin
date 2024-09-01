import React from 'react';
import Column from './column';
import ControlBar from './controlbar';

function Board({ board, onAddColumn }) {
    return (
        <main className="board">

            <ControlBar onAddColumn={onAddColumn} />
            {!board ?
                <div>Loading Board....</div>
                :
                (board.columns.map((column) => (
                    <Column key={column.id} column={column} />
                )))}


        </main>
    );
}

export default Board;
