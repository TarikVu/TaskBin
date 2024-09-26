import '../css/controlbar.css';
import React, { useState } from 'react';
import ColumnForm from '../forms/column-form';
import BoardForm from '../forms/board-form';

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
    onBoardSelect({ boardId: selectedBoardId });
  };

  return (
    <div className="control-bar">
      <div className='title-description'>
        <h1 className='title'>Title</h1>
        <p className='description'>Description Lorem itsum oppous naDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutous narutoDescription Lorem itsum oppous narutorutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous narutoDescription Lorem itsum oppous naruto</p>
      </div>

      <div className='controls'>
        <div className='controls-select'>
          <p>Select a board</p>
          <select onChange={handleBoardChange} value={selectedBoard?._id || ''}>
            {allBoards.length > 0 ? (
              allBoards.map(board => (
                <option key={board._id} value={board._id}>
                  {board.title}
                </option>
              ))
            ) : (
              <option value="" disabled>No Boards</option>
            )}
          </select>
        </div>

        <div className='controls-buttons'>
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
          <button onClick={() => delBoard({ boardId: selectedBoard._id })}>
            Delete Board
          </button>
          <button onClick={() => setIsBoardFormVisible(true)}>
            New Board
          </button>

          <button onClick={() => setIsColumnFormVisible(true)}>
            New Column
          </button>
        </div>

      </div>
    </div >
  );
};

export default ControlBar;
