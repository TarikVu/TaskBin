import React, { useState } from 'react';

const CardForm = ({ isVisible, onClose, onAddCard }) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddCard(title, text);
        setTitle('');
        setText('');
        onClose();
    };

    return isVisible ? (
        <div className="cardform-overlay">
            <div className="cardform">
                <h2>Add New Card</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Text:
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Add Card</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    ) : null;
};

export default CardForm; // Export the CardForm component