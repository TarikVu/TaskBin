import React, { useState } from "react";

const BoardForm = ({ isVisible, onClose, addBoard }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setTitle('');
        addBoard({ title });
        onClose();
    }
    const handleCancel = () => {
        setTitle('');
        onClose();
    }
    return isVisible ?
        <div className="overlay">
            <form className="board-form" onSubmit={handleSubmit}>
                <label>
                    New Board Title
                    <input
                        type="text"
                        autoFocus={true}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <div className="button-group">
                    <button type="submit">Add Board</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div> : null;
}

export default BoardForm;