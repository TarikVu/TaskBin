import React, { useEffect, useState } from 'react';
import NavBar from './navbar';
import Board from './board';
import Column from './column';

function App() {
  const [data, setData] = useState([]);
  const [boardData, setBoardData] = useState({ title: '', columns: [] });
  const [columnData, setColumnData] = useState({ title: '', cards: [] });
  const [cardData, setCardData] = useState({ title: '', text: '', priority: 'normal' });

  // Testing purposes
  const [exampleData, setExampleBoardData] = useState({
    id: 1,
    title: 'Board 1',
    columns: [
      {
        id: 1,
        title: 'Column 1',
        cards: [
          {
            id: 1,
            title: 'Card 1',
            text: 'This is the only card in this column.',
            priority: 'normal',
          },
        ],
      },
      /* {
        id: 2,
        title: 'Column 2',
        cards: [
          {
            id: 1,
            title: 'Card 1',
            text: 'This is the only card in this column2.',
            priority: 'normal',
          },
        ],
      },
      {
        id: 3,
        title: 'Column 1',
        cards: [
          {
            id: 1,
            title: 'Card 1',
            text: 'This is the only card in this column.',
            priority: 'normal',
          },
        ],
      },
      {
        id: 4,
        title: 'Column 1',
        cards: [
          {
            id: 1,
            title: 'Card 1',
            text: 'This is the only card in this column.',
            priority: 'normal',
          },
        ],
      },
      {
        id: 5,
        title: 'Column 1',
        cards: [
          {
            id: 1,
            title: 'Card 1',
            text: 'This is the only card in this column.',
            priority: 'normal',
          },
        ],
      }, */
    ],
  });


  useEffect(() => {
    const fetchData = async () => {

      // populate data from DB here
      try {
        const response = await fetch('http://localhost:5000/cards');
        const result = await response.json();
        setData(result);

        // Data has been pulled from DB, Set
        // The Boards,Cols,Cards here

        //...


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, []);


  // Testing purposes to log data
  useEffect(() => {
    console.log(exampleData);
  }, [exampleData]); // This will log data when it changes


  // CRUD API CALLS
  const createBoard = async () => {
    try {
      const response = await fetch('http://localhost:5000/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: boardData }),
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
        body: JSON.stringify({ name: columnData }),
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

  // send a req to add a col
  const reqAddColumn = async ({ title }) => {

    console.log("Attempting to add Column...");
    try {
      const response = await fetch('http://localhost:5000/columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }), // Assuming the server expects a title field
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Column created:', result);
        return { success: true, column: result };  // Return true on success
      } else {
        console.error('Failed to create column:', response.statusText);
        return false;  // Return false on failure
      }
    } catch (error) {
      console.error('Error creating column:', error);
      return false;  // Return false on error
    }

  };

  const reqAddCard = async ({ title, text, priority, columnId }) => {

    console.log("Attempting to add Card...");
    try {
      // Send a POST request to create the card
      const response = await fetch('http://localhost:5000/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, text, priority, columnId }),
      });

      if (response.ok) {
        const newCard = await response.json();
        console.log('Card created:', newCard);
        console.log('for Column: ', columnId);


        // Update the parent column's cards array with the new card's ID
        const updateColumnResponse = await fetch(`http://localhost:5000/columns/${columnId}/cards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardId: newCard._id }), // Assuming your backend expects the card ID
        });

        if (updateColumnResponse.ok) {
          console.log('Column updated with new card');
          return true; // Return true on success
        } else {
          console.error('Failed to update column:', updateColumnResponse.statusText);
          return false; // Return false if column update fails
        }
      } else {
        console.error('Failed to create card:', response.statusText);
        return false; // Return false if card creation fails
      }
    } catch (error) {
      console.error('Error creating card:', error);
      return false; // Return false on error
    }
  }



  return (
    <div>
      <NavBar onButtonClick={signOut} />
      <Board
        board={exampleData}
        reqAddColumn={reqAddColumn}
        reqAddCard={reqAddCard} />

    </div>
  );
}

export default App;
