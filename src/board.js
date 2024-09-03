import React, { useState } from 'react';
import Column from './column';
import ControlBar from './controlbar';

function Board({ board, reqAddColumn, reqAddCard }) {

    const [columns, setColumns] = useState(board.columns || []);

    const addColumn = async ({ title }) => {


        const result = await reqAddColumn({ title });
        console.log(result);
        const newColumn = result.column;
        if (result.success) {
            setColumns(
                [...columns,
                {
                    key: Date().now, // used for react rendering & mapping
                    id: newColumn._id,  // Use the ID from the database
                    title: newColumn.title,
                    cards: newColumn.cards || []
                }
                ]);
        }
        else {
            console.error('failed to add column to Database');
        }


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
                                key={column.key}
                                column={column}
                                reqAddCard={reqAddCard} />
                        ))
                        : <div>no cols</div>)}

            </div>
        </main>
    );
}

export default Board;
