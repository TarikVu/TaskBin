import React, { useState, useEffect } from 'react';
import ColumnForm from './forms/column-form';
import Column from './column';

const ControlBar = ({ addColumn }) => {
    const [isColumnFormVisible, setIsColumnFormVisible] = useState(false);

    return (
        <div className="control-bar">
            <ColumnForm
                isVisible={isColumnFormVisible}
                onClose={() => setIsColumnFormVisible(false)}
                addColumn={addColumn} />

            <button onClick={() => setIsColumnFormVisible(true)}>
                Add New Column
            </button>
            {/*Add more buttons or controls here */}
        </div>
    );
};

export default ControlBar;

