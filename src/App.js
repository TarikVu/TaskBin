import React, { useEffect, useState } from 'react';
import NavBar from './navbar';
import ControlBar from './controlbar';
import Board from './board';

// API Calling
import {
  signOut,
  fetchBoard,
  reqAddBoard,
  reqAddColumn,
  reqAddCard,
  reqDeleteBoard
} from './services';

const App = () => {
  const [allBoards, setAllBoards] = useState([]);
  const [board, setBoard] = useState({ columns: [] });
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userId = 1; // Temporary

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/boards?userId=${userId}`);
        const result = await response.json();
        setAllBoards(result);
        console.log(result);
        if (result.length > 0) {
          setSelectedBoardId(result[0]._id); // Set initial selected board ID
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  // If selectedBoardId changes, update the board
  useEffect(() => {
    const fetchSelectedBoard = async () => {
      if (selectedBoardId) {
        try {
          const result = await fetchBoard(selectedBoardId, userId);
          setBoard(result);
        } catch (error) {
          console.error('Error fetching board data:', error);
        }
      }
      // Else: no board id, empty board loaded.
    };

    fetchSelectedBoard();
  }, [selectedBoardId]);

  // Invokes useEffect => fetchSelectedBoard
  const selectBoard = (boardId) => {
    if (boardId) {
      setSelectedBoardId(boardId);
    }
    else {
      setSelectedBoardId('');
    }
  };

  // --- Service.js calls ---
  const addBoard = async (data) => {
    try {
      const result = await reqAddBoard({ ...data, userId });
      const newBoard = result.board;
      setAllBoards((prevBoards) => [...prevBoards, newBoard]);
      setSelectedBoardId(newBoard._id);
      setBoard(await fetchBoard(newBoard._id, userId));
    } catch (error) {
      console.error('Error adding board:', error);
    }
  };

  const addColumn = async (title) => {
    if (allBoards.length === 0) { return; }
    const result = await reqAddColumn({ title, selectedBoardId });
    if (result.ok) {
      setBoard(await fetchBoard(selectedBoardId, userId));
    }
  };

  const addCard = async ({ title, text, priority, columnId }) => {
    if (allBoards.length === 0) { return; }
    const result = await reqAddCard({ title, text, priority, columnId });
    if (result.ok) {
      setBoard(await fetchBoard(selectedBoardId, userId));
    }
  };

  const deleteBoard = async (boardId) => {
    if (!boardId) { return; }
    setIsLoading(true); // Show loading indicator
    try {
      const result = await reqDeleteBoard(boardId);
      if (result.ok) {
        setAllBoards((prevBoards) => { // Update Local boards
          const updatedBoards = prevBoards.filter(board => board._id !== boardId);
          // Set selected board to first board or empty if none exist.
          if (updatedBoards.length > 0) {
            setSelectedBoardId(updatedBoards[0]._id);
            fetchBoard(updatedBoards[0]._id, userId).then(setBoard);
          } else {
            setSelectedBoardId('');
            setBoard({ columns: [] });
          }
          return updatedBoards;
        });

      } else {
        console.error("Failed to delete board");
      }
    } catch (error) {
      console.error('Error deleting board:', error);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  // Lightweight component to disable UI while loading operations
  const LoadingIndicator = () => {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
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
        deleteBoard={deleteBoard}
      />
      <Board
        board={board}
        addCard={addCard}
      />

      {isLoading && <LoadingIndicator />} {/* Conditionally render loading indicator */}

    </div>
  );
};

export default App;
