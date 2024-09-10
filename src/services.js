// This class is responsible for interacting with the Taskbin backend API.

const signOut = () => {
    console.log("Logout pressed");
};

// Fetches and returns the Board of boardId
const reqFetchBoard = async (boardId, userId) => {
    try {
        // FETCH BOARD
        const boardResponse = await fetch(`http://localhost:5000/boards/${boardId}?userId=${userId}`);
        const board = await boardResponse.json();
        const columnIds = board.columns || [];

        // Spread Empty array of columns
        if (columnIds.length === 0) { return { ...board, columns: [] }; }

        // FETCH COLUMNS
        const columns = await Promise.all(columnIds.map(async (columnId) => {
            const columnResponse = await fetch(`http://localhost:5000/columns/${columnId}`);
            const column = await columnResponse.json();
            const cardIds = column.cards || [];

            // Spread Empty array of cards
            if (cardIds.length === 0) { return { ...column, cards: [] }; }

            // FETCH CARDS
            const cards = await Promise.all(cardIds.map(async (cardId) => {
                const cardResponse = await fetch(`http://localhost:5000/cards/${cardId}`);
                console.log("card res", cardResponse);
                return await cardResponse.json();
            }));

            return { ...column, cards }; // Spread Column's cards
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

    // Parse response to JSON
    if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);  // This should contain the new board
        return data; // Return parsed JSON containing the new board
    } else {
        const errorData = await response.json();
        console.error("Failed to add board:", errorData.error);
        throw new Error(errorData.error);
    }
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

const reqDeleteBoard = async (boardId) => {
    const response = await fetch(`http://localhost:5000/boards/${boardId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return response;
};

const reqDeleteColumn = async (columnId, boardId) => {
    console.log("delete from: ", boardId);
    const response = await fetch(`http://localhost:5000/columns/${columnId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId })
    })
    return response;
}

export {
    signOut,
    reqFetchBoard,
    reqAddBoard,
    reqAddColumn,
    reqAddCard,
    reqDeleteBoard,
    reqDeleteColumn
};