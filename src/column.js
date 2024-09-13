import React, { useState } from 'react';
import CardForm from './forms/card-form';
import Card from './card';

const Column = ({ column, delColumn, addCard, delCard }) => {

    const cards = column.cards || [];
    const [isCardFormVisible, setIsCardFormVisible] = useState(false);

    return (
        <div className="column">
            {!column ?
                <div>Loading...</div>
                :
                <div>
                    {/* Hidden UI until add card is pressed */}
                    <CardForm
                        isVisible={isCardFormVisible}
                        onClose={() => setIsCardFormVisible(false)}
                        addCard={addCard}
                        columnId={column._id}
                    />
                    <div className="column_header">
                        <button onClick={() => delColumn({ columnId: column._id })}>
                            X
                        </button>
                        <h1>{column.title}</h1>
                        <button onClick={() => setIsCardFormVisible(true)}>
                            + Add Card
                        </button>
                    </div>

                    {cards.length > 0 ?
                        cards.map(card => (
                            <Card
                                key={card._id}
                                card={card}
                                columnId={column._id}
                                delCard={delCard} />
                        ))
                        :
                        <div>No cards available</div>
                    }
                </div>
            }
        </div>
    );
};



export default Column;