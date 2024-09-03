import React, { useEffect, useState } from 'react';
import CardForm from './forms/card-form';
import Card from './card';

const Column = ({ column, reqAddCard }) => {

    const [cards, setCards] = useState(column.cards || []); // empty case
    const [isCardFormVisible, setIsCardFormVisible] = useState(false);

    const addCard = async ({ title, text, priority }) => {


        // send a req add card back to app.js and wait on a approve or deny
        // IF 
        const success = await reqAddCard({ title, text, priority, columnId: column.id });
        if (success) {
            setCards(
                [...cards,
                {
                    title,
                    text,
                    id: Date.now() // Add the new card to the bottom
                }
                ]);

        }
        else {
            console.error('failed to add card to Database');
        }
        // ELSE dont update ui 

    };

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