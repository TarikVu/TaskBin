// This class is responsible for interacting with the Taskbin backend API.

const signOut = () => {
    console.log("Logout pressed");
};

const reqFetchAllBoards = async (userId) => {
    try {
        const response = await fetch(`http://localhost:5000/boards/${userId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Error fetching boards: ${error.message}`);
    }
};

// Fetches and returns the Board of boardId
const reqFetchBoard = async ({ boardId, userId }) => {
    try {
        // FETCH BOARD
        const boardResponse = await fetch(`http://localhost:5000/boards/${boardId}/${userId}`);
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
// Return the new board data from the server if 
// POST was successful, otherwise throw an error.
const reqAddBoard = async ({ title, userId }) => {
    console.log("Attempting to add Board...");
    const response = await fetch('http://localhost:5000/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, userId }),
    });

    return response;

};

const reqAddColumn = async ({ boardId, title }) => {
    console.log("Attempting to add Column...");
    const response = await fetch('http://localhost:5000/columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId, title }),
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

const reqDeleteBoard = async ({ boardId }) => {
    const response = await fetch(`http://localhost:5000/boards/${boardId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return response;
};

const reqDeleteColumn = async ({ columnId, selectedBoardId: boardId }) => {
    console.log("delete from: ", boardId);
    const response = await fetch(`http://localhost:5000/boards/${boardId}/columns/${columnId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    return response;
}

const reqDeleteCard = async ({ columnId, cardId }) => {
    const response = await fetch(`http://localhost:5000/columns/${columnId}/cards/${cardId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    return response;
};

const reqEditCard = async ({ title, text, priority, cardId, columnId }) => {
    const response = await fetch(`http://localhost:5000/columns/${columnId}/cards/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, text, priority })
    });
    return response;

};



export {
    signOut,
    reqFetchAllBoards,
    reqFetchBoard,
    reqAddBoard,
    reqAddColumn,
    reqAddCard,
    reqDeleteBoard,
    reqDeleteColumn,
    reqDeleteCard,
    reqEditCard
};