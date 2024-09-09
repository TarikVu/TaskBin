// This class is responsible for interacting with the Taskbin backend API.

const signOut = () => {
    console.log("Logout pressed");
};

// Fetched and returns the Board of boardId
const fetchBoard = async (boardId, userId) => {
    try {
        // Fetch the selected board
        const boardResponse = await fetch(`http://localhost:5000/boards/${boardId}?userId=${userId}`);
        const board = await boardResponse.json();
        console.log("Board", board);
        // Check if the board has columns
        const columnIds = board.columns || [];
        if (columnIds.length === 0) {
            console.log('No columns found for this board');
            return { ...board, columns: [] };
        }

        // Fetch the columns and cards
        const columns = await Promise.all(columnIds.map(async (columnId) => {

            // Fetch each column
            const columnResponse = await fetch(`http://localhost:5000/columns/${columnId}`);
            const column = await columnResponse.json();
            console.log("Column", column);

            // Check if the column has cards
            const cardIds = column.cards || [];
            if (cardIds.length === 0) {
                console.log(`No cards found for column ${columnId}`);
                return { ...column, cards: [] };
            }

            // Fetch the cards for this column using card IDs
            const cards = await Promise.all(cardIds.map(async (cardId) => {
                const cardResponse = await fetch(`http://localhost:5000/cards/${cardId}`);
                console.log("card res", cardResponse);
                return await cardResponse.json();
            }));

            return { ...column, cards }; // Spread Col's cards
        }));

        return { ...board, columns }; // Spread Board's Columns
    } catch (error) {
        console.error('Error fetching board:', error);
    }
};

// POST API REQUESTS
const reqAddBoard = async ({ title, userId = 1 }) => {
    console.log("Attempting to add Board...");
    const response = await fetch('http://localhost:5000/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, userId }),
    });
    return response;
};
const reqAddColumn = async ({ title, selectedBoardId }) => {
    console.log("Attempting to add Column...");
    const response = await fetch('http://localhost:5000/columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, boardId: selectedBoardId }),
    });
    return response;

};
const reqAddCard = async ({ title, text, priority, columnId }) => {
    console.log("Attempting to add Card...");
    const response = await fetch('http://localhost:5000/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, text, priority, columnId }),
    });
    return response;

}

export {
    signOut,
    fetchBoard,
    reqAddBoard,
    reqAddColumn,
    reqAddCard,
};