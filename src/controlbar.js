import React from 'react';

function ControlBar({ onAddColumn }) {
    return (
        <div className="control-bar">
            <button onClick={onAddColumn}>Add New Column</button>
            {/* Add more buttons or controls here */}
        </div>
    );
}

export default ControlBar;
