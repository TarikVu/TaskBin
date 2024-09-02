import React, { useState } from 'react';
import Column from './column';
import ControlBar from './controlbar';

function Board({ board, reqAddColumn, reqAddCard }) {

    const [columns, setColumns] = useState(board.columns || []);

    const addColumn = ({ title }) => {

        // IF 
        reqAddColumn({ title });
        setColumns(
            [...columns,
            {
                id: columns.length + 1,
                title: title,
                cards: []
            }
            ]);
        //ELSE dont update ui

    }

    return (
        <main className="board">
            <ControlBar addColumn={addColumn} />
            <div className='columns-container'>
                {!board ?
                    <div>Loading Board....</div>
                    :
                    (columns && columns.length > 0 ?
                        columns.map((column) => (
                            <Column
                                key={column.id}
                                column={column}
                                reqAddCard={reqAddCard} />
                        ))
                        : <div>no cols</div>)}

            </div>
        </main>
    );
}

export default Board;
