import React, { useState } from "react";

const BoardForm = ({ isVisible, onClose, addBoard }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setTitle('');
        // send title back to app.js level for api call
        addBoard({ title });
        onClose();
    }

    return isVisible ?
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

            <button type="submit">Add Board</button>
            <button type="button" onClick={onClose}>Cancel</button>
        </form> : null;
}

export default BoardForm;