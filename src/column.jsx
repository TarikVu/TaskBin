import React, { useState } from 'react';
import CardForm from './card-form'; // Import the Modal component

const Column = () => {
    const [cards, setCards] = useState([]);
    const [isCardFormVisible, setIsCardFormVisible] = useState(false);

    const addCard = (title, text) => {
        setCards([...cards, { title, text, id: Date.now() }]); // Add the new card to the bottom
    };

    return (
        <div className="column">

            {/* index.css centers and focuses the form */}
            <CardForm
                isVisible={isCardFormVisible}
                onClose={() => setIsCardFormVisible(false)}
                onAddCard={addCard}
            />

            <button onClick={() => setIsCardFormVisible(true)}>
                Add Card
            </button>

            {
                cards.map(card => (
                    <Card key={card.id} title={card.title} text={card.text} />
                ))
            }

        </div>
    );
};

const Card = ({ title, text }) => (
    <div className="card">
        <h3>{title}</h3>
        <p>{text}</p>
    </div>
);

export default Column;