import React, { useEffect, useState } from 'react';
//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './navbar';
import ControlBar from './controlbar';
import Board from './board';
import { useParams, useNavigate } from 'react-router-dom';

// API Calling
import {
    reqFetchAllBoards,
    reqFetchBoard,
    reqAddBoard,
    reqAddColumn,
    reqAddCard,
    reqDeleteBoard,
    reqDeleteColumn,
    reqDeleteCard,
    reqEditCard,
    reqEditColumn
} from './services';

const Home = () => {
    const navigate = useNavigate();

    const { userId } = useParams();
    const [allBoards, setAllBoards] = useState([]);
    const [board, setBoard] = useState({ columns: [] });
    const [selectedBoardId, setSelectedBoardId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [popup, setPopup] = useState({ visible: false, message: '' });


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const result = await reqFetchAllBoards(userId); // Use the new function
                setAllBoards(result);
                if (result.length > 0) {
                    setSelectedBoardId(result[0]._id);
                }
            } catch (error) {
                navigate('/forbidden');
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId, navigate]); // Add userId here

    // If selectedBoardId changes, update the board
    useEffect(() => {
        const fetchSelectedBoard = async () => {
            if (selectedBoardId) {
                try {
                    const result = await reqFetchBoard({ boardId: selectedBoardId, userId });
                    setBoard(result);
                } catch (error) {
                    setPopup({ visible: true, message: `Error Loading Board: ${error}` });
                }
            }
        };

        fetchSelectedBoard();
    }, [selectedBoardId, userId]);

    const signOut = async () => {

        // Handle successful logout (e.g., redirect to login page)
        localStorage.removeItem('jwt'); // Clear JWT
        navigate('/');
        console.log("Logout successful");

    };

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
        setIsLoading(true);
        try {
            const result = await reqAddBoard({ title, userId });
            if (result.ok) {
                const data = await result.json();
                const newBoard = data.board;
                setAllBoards((prevBoards) => [...prevBoards, newBoard]);
                setSelectedBoardId(newBoard._id);
                setBoard(
                    await reqFetchBoard({ boardId: newBoard._id, userId }));
            }
            else {
                setPopup({ visible: true, message: `Unable to create new board` });
            }
        } catch (error) {
            setPopup({ visible: true, message: `Error connecting to server` });
        } finally {
            setIsLoading(false);
        }
    };

    const addColumn = async ({ title }) => {
        if (allBoards.length === 0) {
            setPopup({ visible: true, message: `No chosen board to add column to.` });
            return;
        }

        try {
            const result = await reqAddColumn({ boardId: selectedBoardId, title });
            if (result.ok) {
                setBoard(
                    await reqFetchBoard({ boardId: selectedBoardId, userId }));
            }
            else {
                setPopup({ visible: true, message: "Server Encountered an error adding a new Column." });
            }
        } catch {
            setPopup({ visible: true, message: `Error connecting to server` });
        }
    };

    const addCard = async ({ title, text, priority, columnId }) => {
        if (allBoards.length === 0) { return; }
        try {
            const result = await reqAddCard({ title, text, priority, columnId });
            if (result.ok) {
                const data = await result.json();
                return data;
            }
            else {
                setPopup({ visible: true, message: "Server Encountered an error adding a new Card." });
            }
        }
        catch {
            setPopup({ visible: true, message: `Error connecting to server` });
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
                        reqFetchBoard({ boardId: updatedBoards[0]._id, userId }).then(setBoard);
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
        catch {
            setPopup({ visible: true, message: `Error connecting to server` });
        } finally {
            setIsLoading(false);
        }
    };

    const delColumn = async ({ columnId }) => {
        if (!columnId) { return; }

        try {
            const result = await reqDeleteColumn({ columnId, selectedBoardId });
            if (result.ok) {
                setBoard(
                    await reqFetchBoard({ boardId: selectedBoardId, userId }));
            } else {
                setPopup({ visible: true, message: `Server encountered an error deleting Column.` });
            }
        } catch {
            setPopup({ visible: true, message: `Error connecting to server` });
        }
    };

    const delCard = async ({ columnId, cardId }) => {
        try {
            const result = await reqDeleteCard({ columnId, cardId });
            if (result.ok) {
                return true;
            } else {
                setPopup({ visible: true, message: `Server encountered an error deleting card` });
            }
        } catch {
            setPopup({ visible: true, message: `Error connecting to server` });
        }
    };

    const editCard = async ({ title, text, priority, cardId, columnId }) => {
        try {
            const result = await reqEditCard({ title, text, priority, cardId, columnId });
            if (result.ok) {
                const updatedCard = await result.json();
                return updatedCard;  // Return the updated card
            } else {
                setPopup({ visible: true, message: `Server encountered an error updating card ${result.message}` });
            }
        } catch (error) {
            setPopup({ visible: true, message: `Error connecting to the server ${error}` });
        }
    };

    const editColumn = async ({ columnId, title }) => {
        try {
            const result = await reqEditColumn({ columnId, title });
            if (result.ok) {
                const updatedColumn = await result.json();
                return updatedColumn;  // Return the updated card
            } else {
                setPopup({ visible: true, message: `Server encountered an error updating column ${result.message}` });
            }
        } catch (error) {
            setPopup({ visible: true, message: `Error connecting to the server ${error}` });
        }
    }

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
        <><NavBar onButtonClick={signOut} />
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
                editColumn={editColumn}
                addCard={addCard}
                delCard={delCard}
                editCard={editCard}
            />
            {isLoading && <LoadingIndicator />}
            {popup.visible && (
                <Popup
                    message={popup.message}
                    onClose={() => setPopup({ visible: false, message: '' })}
                />
            )}
        </>
    );
};

export default Home;