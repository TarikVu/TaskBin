import React, { useState, useEffect } from 'react';

// CardForm is responsible for creating a new card or editing a card
// Prop defaulting is used to handle AddCard & DeleteCard conditional props.
const CardForm = ({
    // Conditional props
    card = null,
    addCard = () => { },
    editCard = () => { },

    // Required Props
    columnId,
    isVisible,
    onClose,
}) => {

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [priority, setPriority] = useState('normal');

    // Initialize form fields if card is provided
    useEffect(() => {
        if (card) {
            setTitle(card.title);
            setText(card.text);
            setPriority(card.priority || 'normal');
        } else {
            setTitle('');
            setText('');
            setPriority('normal');
        }
    }, [card]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (card) {
            // Handled in Column.js for card re-rendering
            editCard({ title, text, priority, cardId: card._id, columnId });
        } else {
            // Goes straight to App.js to be handled
            addCard({ title, text, priority, columnId });
            setTitle('');
            setText('');
            setPriority('normal');
        }
        onClose();
    };

    // Early return if not visible
    if (!isVisible) {
        return null;
    }

    return (
        <div className="overlay">
            <div className="card-form">
                <h2>{card ? 'Edit Task' : 'New Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Title
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Text
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Priority
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </label>
                    <div className="button-group">
                        <button type="submit">{card ? 'Save Changes' : 'Add Card'}</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CardForm;
