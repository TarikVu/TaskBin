import '../css/controlbar.css';
import React, { useEffect, useState } from 'react';
import ColumnForm from '../forms/column-form';
import BoardForm from '../forms/board-form';

const ControlBar = ({
  allBoards,
  selectedBoard,
  boardTitle,
  boardDesc,
  onBoardSelect,
  addBoard,
  addColumn,
  delBoard,
  editBoard
}) => {

  const [isBoardFormVisible, setIsBoardFormVisible] = useState(false);
  const [isColumnFormVisible, setIsColumnFormVisible] = useState(false);
  const [title, setTitle] = useState(boardTitle);
  const [description, setDescription] = useState(boardDesc);

  // Sync title and description with props when the board changes
  useEffect(() => {
    setTitle(boardTitle);
    setDescription(boardDesc);
  }, [boardTitle, boardDesc]);

  const handleBoardChange = (event) => {
    const selectedBoardId = event.target.value;
    onBoardSelect({ boardId: selectedBoardId });
  };

  const handleBlur = () => {
    editBoard({ title, description });
  };

  return (
    <div className="control-bar">
      <div className='title-description'>
        {selectedBoard._id ? (
          <> 
            <input
              value={ title}
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              maxLength={50}
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleBlur}
              maxLength={500}
            />
          </>
        ) : (
          <p> Welcome to TaskBin!<br /> Please begin by creating your first Board! </p>
        )}
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

          <button onClick={() => setIsBoardFormVisible(true)}>
            New Board
          </button>
          {allBoards.length > 0 && (
            <button onClick={() => setIsColumnFormVisible(true)}>
              New Column
            </button>
          )}
          {allBoards.length > 0 && (
            <button className='delButton' onClick={() => delBoard({ boardId: selectedBoard._id })}>
              Delete Board
            </button>
            
          )}
        </div>
      </div>
    </div >
  );
};

export default ControlBar;
