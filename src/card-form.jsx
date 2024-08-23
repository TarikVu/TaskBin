import React, { useState } from 'react';

const Modal = ({ isVisible, onClose, onAddCard }) => {
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
        <div className="modal-overlay">
            <div className="modal">
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

export default Modal; // Export the Modal component
