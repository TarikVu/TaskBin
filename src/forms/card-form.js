import React, { useState } from 'react';

const CardForm = ({ isVisible, onClose, addCard, columnId }) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [priority, setPriority] = useState('normal');

    const handleSubmit = (e) => {
        e.preventDefault();
        addCard({ title, text, priority, columnId });
        setTitle('');
        setText('');
        setPriority('normal');

        // return the data via reqAddCard
        onClose();
    };

    return isVisible ? (
        <div className="overlay">
            <div className="cardform">
                <h2>New Task</h2>
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
                        <button type="submit">Add Card</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};

export default CardForm; 