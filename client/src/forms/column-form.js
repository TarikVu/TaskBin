import React, { useState } from "react";

const ColumnForm = ({ isVisible, onClose, addColumn }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setTitle('');
        addColumn({ title });
        onClose();
    }
    const handleCancel = () => {
        setTitle('');
        onClose();
    }
    return isVisible ?
        <div className="overlay">
            <form className="column-form" onSubmit={handleSubmit}>
                <label>
                    New Column Title
                    <input
                        autoFocus={true}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={20}
                    />
                </label>
                <div className="button-group">
                    <button type="submit">Add Column</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div> : null;
}

export default ColumnForm;