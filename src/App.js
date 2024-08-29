import React, { useEffect, useState } from 'react';

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

  return (
    <div>
      <h1>Kanban Board</h1>

      <div>
        <h2>Create Board</h2>
        <input
          type="text"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          placeholder="Board Name"
        />
        <button onClick={createBoard}>Create Board</button>
      </div>

      <div>
        <h2>Create Column</h2>
        <input
          type="text"
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          placeholder="Column Name"
        />
        <button onClick={createColumn}>Create Column</button>
      </div>

      <div>
        <h2>Create Card</h2>
        <input
          type="text"
          value={cardData.title}
          onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
          placeholder="Card Title"
        />
        <input
          type="text"
          value={cardData.text}
          onChange={(e) => setCardData({ ...cardData, text: e.target.value })}
          placeholder="Card Text"
        />
        <select
          value={cardData.priority}
          onChange={(e) => setCardData({ ...cardData, priority: e.target.value })}
        >
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <button onClick={createCard}>Create Card</button>
      </div>
    </div>
  );
}

export default App;
