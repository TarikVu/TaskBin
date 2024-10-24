import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// CardForm is responsible for creating a new card or editing a card
// Prop defaulting is used to handle AddCard & DeleteCard conditional props.
// addCard is passed a prop when being accessed by the addCard button
// editCard is passed a prop when being accessed by clicking on an existing card.
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

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission
        if (card) {
            // Handled in Column.js for card re-rendering
            editCard({ title, text, priority, cardId: card._id, columnId });
        } else {
            // Goes straight to App.js to be handled
            addCard({ title, text, priority });
            setTitle('');
            setText('');
            setPriority('normal');
        }
        onClose();
    };

    const handleOnClose = () => {
        setTitle('');
        setText('');
        setPriority('normal');
        onClose();
    }

    // Early return if not visible
    if (!isVisible) { return null; }

    // The Card form will be rendered w/ react portal to bypass
    // it's parent container's constraints.
    return ReactDOM.createPortal(
        <div className="overlay">
            <div className="card-form">
                <h2>{card ? 'Edit Task' : 'New Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Title
                        <input
                            className='card-form-input'
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={20}
                        />
                    </label>
                    <label>
                        Description
                        <textarea
                            className='card-form-textarea'
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
                        <button type="button" onClick={handleOnClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>,
        document.body // Render the overlay outside of the parent component, under the body
    );
};

export default CardForm;
