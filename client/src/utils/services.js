// This class handles the intermediary step of interacting with our server.

const API_URL = process.env.REACT_APP_API_URL /* || 'http://localhost:5000' */;

const reqLoginUser = async ({ email, password }) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return response;
};

const reqSignUpUser = async ({ username, email, password }) => {
    const response = await fetch(`${API_URL}/signup`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });
    return response;
};

const reqFetchAllBoards = async (userId) => {
    const token = localStorage.getItem('jwt'); // Get the stored JWT 
    try {
        const response = await fetch(`${API_URL}/boards/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${errorText}`);
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
        const boardResponse = await fetch(`${API_URL}/boards/${boardId}/${userId}`);
        const board = await boardResponse.json();

        const columnIds = board.columns || [];

        // Spread Empty array of columns
        if (columnIds.length === 0) { return { ...board, columns: [] }; }

        // FETCH COLUMNS
        const columns = await Promise.all(columnIds.map(async (columnId) => {
            const columnResponse = await fetch(`${API_URL}/columns/${columnId}`);
            const column = await columnResponse.json();
            const cardIds = column.cards || [];

            // Spread Empty array of cards
            if (cardIds.length === 0) { return { ...column, cards: [] }; }

            // FETCH CARDS
            const cards = await Promise.all(cardIds.map(async (cardId) => {
                const cardResponse = await fetch(`${API_URL}/cards/${cardId}`);
                return await cardResponse.json();
            }));

            return { ...column, cards }; // Spread Column's cards
        }));

        return { ...board, columns }; // Spread Board's Columns
    } catch (error) {
        console.error('Error fetching board:', error);
    }
};


// Return the new board data from the server if 
// POST was successful, otherwise throw an error.
const reqAddBoard = async ({ title, userId }) => {
    const response = await fetch(`${API_URL}/boards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, userId }),
    });
    return response;
};

const reqAddColumn = async ({ boardId, title }) => {
    const response = await fetch(`${API_URL}/columns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId, title }),
    });
    return response;
};

const reqAddCard = async ({ title, text, priority, columnId }) => {
    const response = await fetch(`${API_URL}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, text, priority, columnId }),
    });
    return response;
}

const reqDeleteBoard = async ({ boardId }) => {
    const response = await fetch(`${API_URL}/boards/${boardId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return response;
};

const reqDeleteColumn = async ({ columnId, selectedBoardId: boardId }) => {
    const response = await fetch(`${API_URL}/boards/${boardId}/columns/${columnId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    return response;
}

const reqDeleteCard = async ({ columnId, cardId }) => {
    const response = await fetch(`${API_URL}/columns/${columnId}/cards/${cardId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    return response;
};

const reqEditCard = async ({ title, text, priority, cardId, columnId }) => {
    const response = await fetch(`${API_URL}/columns/${columnId}/cards/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, text, priority })
    });
    return response;
};

const reqEditColumn = async ({ columnId, title }) => {
    const response = await fetch(`${API_URL}/columns/${columnId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });
    return response;
};

const reqEditBoard = async ({ boardId, title, description, columns }) => {
    const response = await fetch(`${API_URL}/boards/${boardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, columns })
    });
    return response;
};

const reqMoveCard = async ({ cardId, columnId, targetColumnId }) => {
    const response = await fetch(`${API_URL}/move `, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, columnId, targetColumnId })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return response;
};


export {
    reqFetchAllBoards,
    reqFetchBoard,
    reqAddBoard,
    reqAddColumn,
    reqAddCard,
    reqDeleteBoard,
    reqDeleteColumn,
    reqDeleteCard,
    reqEditCard,
    reqEditColumn,
    reqSignUpUser,
    reqLoginUser,
    reqEditBoard,
    reqMoveCard
};