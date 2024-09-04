import React, { useEffect, useState } from 'react';
import { signOut, reqAddBoard, reqAddColumn, reqAddCard } from './services'; // API Calling
import NavBar from './navbar';
import ControlBar from './controlbar';
import Board from './board';

const App = () => {
  const [allBoards, setAllBoards] = useState([]);
  const [board, setBoard] = useState({ columns: [] });
  const [selectedBoardId, setSelectedBoardId] = useState('');

  const userId = 1;

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

  // If selectedBoardId changes, update the page
  useEffect(() => {
    if (selectedBoardId) {
      fetchBoard(selectedBoardId);
    }
  }, [selectedBoardId]);

  const fetchBoard = async (boardId) => {
    try {
      // Fetch the selected board
      const boardResponse = await fetch(`http://localhost:5000/boards/${boardId}?userId=${userId}`);
      const boardData = await boardResponse.json();

      // Fetch the columns using their IDs
      const columnIds = boardData.columns || [];
      console.log(columnIds);
      const columns = await Promise.all(columnIds.map(async (columnId) => {
        const columnResponse = await fetch(`http://localhost:5000/columns/${columnId}`);
        return await columnResponse.json();
      }));

      // Set the board with full column data
      setBoard({ ...boardData, columns });
    } catch (error) {
      console.error('Error fetching board:', error);
    }
  };

  const selectBoard = (boardId) => {
    setSelectedBoardId(boardId);
  };

  const addBoard = async (data) => {
    const result = await reqAddBoard({ ...data, userId });
    if (result.success) {
      // Fetch only the newly added board using its ID from the result
      const newBoardResponse =
        await fetch(`http://localhost:5000/boards/${result.board._id}?userId=${userId}`);
      const newBoard = await newBoardResponse.json();
      console.log(newBoard);
      // Append the newly added board to the existing list of boards
      setAllBoards((prevBoards) => [...prevBoards, newBoard]);

      // Set the newly added board as selected
      setSelectedBoardId(newBoard._id);
      fetchBoard(newBoard._id); // Fetch the new board's data to update the UI
    }
  };

  const addColumn = async (title) => {
    console.log('Adding column with selectedBoardId:', selectedBoardId); // Debug log
    const result = await reqAddColumn({ title, selectedBoardId });
    if (result.success) {
      fetchBoard(selectedBoardId); // Fetch updated board data after adding a column
    }
  };

  const addCard = async ({ title, text, priority, columnId }) => {
    console.log('Adding Card with selectedBoardId:', selectedBoardId); // Debug log
    const result = await reqAddCard({ title, text, priority, columnId });
    if (result.success) {
      fetchBoard(selectedBoardId); // Fetch updated board data after adding a column
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
