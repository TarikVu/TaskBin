import React, { useEffect, useState } from 'react';
import NavBar from './navbar';
import Board from './board';
import Column from './column';

function App() {
  const [data, setData] = useState([]);
  const [boardName, setBoardName] = useState('');
  const [columnName, setColumnName] = useState('');
  const [cardData, setCardData] = useState({ title: '', text: '', priority: 'normal' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/cards');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, []);


  // Testing purposes to log data
  useEffect(() => {
    console.log(data);
  }, [data]); // This will log data when it changes


  const createBoard = async () => {
    try {
      const response = await fetch('http://localhost:5000/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: boardName }),
      });
      const result = await response.json();
      console.log('Board created:', result);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const createColumn = async () => {
    try {
      const response = await fetch('http://localhost:5000/columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: columnName }),
      });
      const result = await response.json();
      console.log('Column created:', result);
    } catch (error) {
      console.error('Error creating column:', error);
    }
  };

  const createCard = async () => {
    try {
      const response = await fetch('http://localhost:5000/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData),
      });
      const result = await response.json();
      console.log('Card created:', result);
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };


  const signOut = () => {
    console.log("Logout pressed");
  };

  return (
    <div>
      <NavBar onButtonClick={signOut} />
      <Board>
        <Column>
        </Column>
      </Board>

    </div>
  );
}

export default App;
