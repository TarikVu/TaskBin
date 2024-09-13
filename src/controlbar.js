import React, { useState } from 'react';
import ColumnForm from './forms/column-form';
import BoardForm from './forms/board-form';

const ControlBar = ({
  allBoards,
  selectedBoard,
  onBoardSelect,
  addBoard,
  addColumn,
  delBoard
}) => {

  const [isBoardFormVisible, setIsBoardFormVisible] = useState(false);
  const [isColumnFormVisible, setIsColumnFormVisible] = useState(false);

  const handleBoardChange = (event) => {
    const selectedBoardId = event.target.value;
    onBoardSelect(selectedBoardId);
  };

  return (
    <div className="control-bar">
      <BoardForm
        isVisible={isBoardFormVisible}
        onClose={() => setIsBoardFormVisible(false)}
        addBoard={addBoard}
      />

      <ColumnForm
        isVisible={isColumnFormVisible}
        onClose={() => setIsColumnFormVisible(false)}
        addColumn={addColumn}
      />

      <button onClick={() => setIsBoardFormVisible(true)}>
        Add New Board
      </button>

      <button onClick={() => setIsColumnFormVisible(true)}>
        Add New Column
      </button>

      <button onClick={() => delBoard({ boardId: selectedBoard._id })}>
        Delete Board
      </button>

      <select onChange={handleBoardChange} value={selectedBoard._id || ''}>
        <option value="">Select a Board</option>
        {allBoards.map(board => (
          <option key={board._id} value={board._id}>
            {board.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ControlBar;
