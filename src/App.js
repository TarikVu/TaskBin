import React, { useEffect, useState } from 'react';
import NavBar from './navbar';
import Board from './board';
import { signOut, reqAddCard, reqAddColumn } from './services';

function App() {
  const [data, setData] = useState([]);
/*   const [boardData, setBoardData] = useState({ title: '', columns: [] });
  const [columnData, setColumnData] = useState({ title: '', cards: [] });
  const [cardData, setCardData] = useState({ title: '', text: '', priority: 'normal' }); */

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
    ],
  });


  useEffect(() => {
    const fetchData = async () => {

      // populate data from DB here
      // move to services later.
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
