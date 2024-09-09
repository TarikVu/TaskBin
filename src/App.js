import React, { useEffect, useState } from 'react';
import { signOut, fetchBoard, reqAddBoard, reqAddColumn, reqAddCard } from './services'; // API Calling
import NavBar from './navbar';
import ControlBar from './controlbar';
import Board from './board';

const App = () => {
  const [allBoards, setAllBoards] = useState([]);
  const [board, setBoard] = useState({ columns: [] });
  const [selectedBoardId, setSelectedBoardId] = useState('');

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
    };

    fetchSelectedBoard();
  }, [selectedBoardId]);

  // Invokes useEffect => fetchSelectedBoard
  const selectBoard = (boardId) => {
    setSelectedBoardId(boardId);
  };

  const addBoard = async (data) => {
    try {
      const result = await reqAddBoard({ ...data, userId });
      if (result.ok) {
        const newBoard = await result.json();

        // Append the newly added board to the existing list of boards
        setAllBoards((prevBoards) => [...prevBoards, newBoard]);
        setSelectedBoardId(newBoard._id);
        setBoard(await fetchBoard(newBoard._id, userId));
      } else {
        const errorData = await result.json();
        console.error('Failed to add board:', errorData.error);
      }
    } catch (error) {
      console.error('Error adding board:', error);
    }
  };

  const addColumn = async (title) => {
    const result = await reqAddColumn({ title, selectedBoardId });
    if (result.ok) {
      setBoard(await fetchBoard(selectedBoardId, userId));
    }
  };

  const addCard = async ({ title, text, priority, columnId }) => {
    const result = await reqAddCard({ title, text, priority, columnId });
    if (result.ok) {
      setBoard(await fetchBoard(selectedBoardId, userId));
    }
  };

  return (
    <div className="app">
      <NavBar onButtonClick={signOut} />
      <ControlBar
        allBoards={allBoards}
        selectedBoard={board}
        onBoardSelect={selectBoard}
        reqAddBoard={addBoard}
        reqAddColumn={addColumn}
      />
      <Board
        board={board}
        addCard={addCard}
      />
    </div>
  );
};

export default App;
