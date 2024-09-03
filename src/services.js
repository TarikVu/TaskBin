
// CRUD API CALLS
/* const createBoard = async () => {
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
}; */

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

export {
    /* createBoard,
    createColumn,
    createCard, */
    signOut,
    reqAddColumn,
    reqAddCard,
};