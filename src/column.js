import React, { useEffect, useState } from 'react';
import CardForm from './card-form';
import Card from './card';

const Column = ({ column }) => {
    const [cards, setCards] = useState(column.cards || []); // empty case
    const [isCardFormVisible, setIsCardFormVisible] = useState(false);

    const addCard = ({ title, text, priority }) => {
        setCards([...cards, { title, text, id: Date.now() }]); // Add the new card to the bottom

    };

    useEffect(() => {

    }, [cards]);



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
                        onAddCard={addCard}
                    />
                    <div className="column_header">
                        <h1>{column.title}</h1>
                        <button onClick={() => setIsCardFormVisible(true)}>
                            + Add Card
                        </button>
                    </div>

                    {cards && cards.length > 0 ?
                        cards.map(card => (
                            <Card key={card.id} title={card.title} text={card.text} />
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