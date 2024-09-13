import React, { useEffect, useState } from 'react';
import NavBar from './navbar';
import ControlBar from './controlbar';
import Board from './board';

// API Calling
import {
  signOut,
  reqFetchBoard,
  reqAddBoard,
  reqAddColumn,
  reqAddCard,
  reqDeleteBoard,
  reqDeleteColumn,
  reqDeleteCard
} from './services';

const App = () => {
  const [allBoards, setAllBoards] = useState([]);
  const [board, setBoard] = useState({ columns: [] });
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({ visible: false, message: '' });

  const userId = 1; // Temporary

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/boards/${userId}`);
        const result = await response.json();
        setAllBoards(result);
        if (result.length > 0) {
          setSelectedBoardId(result[0]._id);
        }
      } catch (error) {
        setPopup({ visible: true, message: `Error Loading Boards: ${error}` });
      }
    };

    fetchData();
  }, [userId]);

  // If selectedBoardId changes, update the board
  useEffect(() => {
    const fetchSelectedBoard = async () => {
      if (selectedBoardId) {
        try {
          const result = await reqFetchBoard({ selectedBoardId, userId });
          setBoard(result);
        } catch (error) {
          setPopup({ visible: true, message: `Error Loading Board: ${error}` });
        }
      }
    };

    fetchSelectedBoard();
  }, [selectedBoardId]);

  // Invokes useEffect => fetchSelectedBoard
  const selectBoard = ({ boardId }) => {
    if (boardId) {
      setSelectedBoardId(boardId);
    } else {
      setSelectedBoardId('');
    }
  };

  // --- API calls w/ services.js ---
  const addBoard = async ({ title }) => {
    try {
      const result = await reqAddBoard({ title, userId });
      const newBoard = result.board;
      setAllBoards((prevBoards) => [...prevBoards, newBoard]);
      setSelectedBoardId(newBoard._id);
      setBoard(await reqFetchBoard(newBoard._id, userId));
    } catch (error) {
      setPopup({ visible: true, message: `Failed to add new Board: ${error}` });
    }
  };

  const addColumn = async ({ title }) => {
    if (allBoards.length === 0) {
      setPopup({ visible: true, message: `No chosen board to add column to.` });
      return;
    }

    const result = await reqAddColumn({ title, selectedBoardId });
    if (result.ok) {
      setBoard(await reqFetchBoard({ selectedBoardId, userId }));
    }
    else {
      setPopup({ visible: true, message: "Server Encountered an error adding a new Column." });
    }
  };

  const addCard = async ({ title, text, priority, columnId }) => {
    if (allBoards.length === 0) { return; }
    const result = await reqAddCard({ title, text, priority, columnId });
    if (result.ok) {
      setBoard(await reqFetchBoard({ selectedBoardId, userId }));
    }
    else {
      setPopup({ visible: true, message: "Server Encountered an error adding a new Card." });
    }
  };

  const delBoard = async ({ boardId }) => {
    if (!boardId) {
      setPopup({ visible: true, message: "No selected Board to Delete." });
      return;
    }
    setIsLoading(true);
    try {
      const result = await reqDeleteBoard({ boardId });
      if (result.ok) {
        setAllBoards((prevBoards) => {
          const updatedBoards = prevBoards.filter(board => board._id !== boardId);
          // Set selected board to first board or empty if none exist.
          if (updatedBoards.length > 0) {
            setSelectedBoardId(updatedBoards[0]._id);
            reqFetchBoard(updatedBoards[0]._id, userId).then(setBoard);
          } else {
            setSelectedBoardId('');
            setBoard({ columns: [] });
          }
          return updatedBoards;
        });
      } else {
        setPopup({ visible: true, message: `Server encountered an error Deleting Board.` });
      }
    }
    finally {
      setIsLoading(false);
    }
  };

  const delColumn = async ({ columnId }) => {
    if (!columnId) { return; }
    setIsLoading(true);
    try {
      const result = await reqDeleteColumn({ columnId, selectedBoardId });
      if (result.ok) {
        setBoard(await reqFetchBoard({ selectedBoardId, userId }));
      } else {
        console.error("Failed to delete column");
        setPopup({ visible: true, message: `Server encountered an error deleting Column.` });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const delCard = async ({ columnId, cardId }) => {
    if (!cardId || !columnId) { return; }
    setIsLoading(true);
    try {
      const result = await reqDeleteCard({ columnId, cardId });
      if (result.ok) {
        setBoard(await reqFetchBoard({ selectedBoardId, userId }));
      } else {
        console.error("Failed to delete card");
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Lightweight component to disable UI while loading operations
  const LoadingIndicator = () => {
    return (
      <div className="overlay">
        <div className="spinner"></div>
      </div>
    );
  };

  // Popup component that handles message display and closing the popup
  const Popup = ({ message, onClose }) => {
    return (
      <div className='overlay'>
        <div className="popup">
          <div className='header'>
            Error</div>
          <div className="message-container">
            {message}
          </div>
          <button onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <NavBar onButtonClick={signOut} />
      <ControlBar
        allBoards={allBoards}
        selectedBoard={board}
        onBoardSelect={selectBoard}
        addBoard={addBoard}
        addColumn={addColumn}
        delBoard={delBoard}
      />
      <Board
        board={board}
        delColumn={delColumn}
        addCard={addCard}
        delCard={delCard}
      />
      {isLoading && <LoadingIndicator />}
      {popup.visible && (
        <Popup
          message={popup.message}
          onClose={() => setPopup({ visible: false, message: '' })}
        />
      )}
    </div>
  );
};

export default App;
