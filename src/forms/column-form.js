import React, { useState } from "react";

const ColumnForm = ({ isVisible, onClose, addColumn }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setTitle('');
        addColumn({ title });
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

            <button type="submit">Add Column</button>
            <button type="button" onClick={onClose}>Cancel</button>
        </form> : null;
}

export default ColumnForm;