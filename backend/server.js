const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


const uri = 'mongodb+srv://taskBin:oDN1d6gcSCNyIpfE@taskbinfree.p0skw.mongodb.net/TaskBin?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(uri);

// SCHEMAS //

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: ['normal', 'high', 'urgent'],
        default: 'normal',
    },
}, { timestamps: true });

const columnSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
    }],
}, { timestamps: true });

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    columns: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column',
    }],
    userId: { type: Number, default: 1 } // Default to userId 1
}, { timestamps: true });

// Create the models
const Card = mongoose.model('Card', cardSchema);
const Column = mongoose.model('Column', columnSchema);
const Board = mongoose.model('Board', boardSchema);

// FetchData 
app.get('/boards/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const boards = await Board.find({ userId });
        res.status(200).json(boards);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/boards/:boardId/:userId', async (req, res) => {
    try {
        const boardId = req.params.boardId;
        const userId = req.params.userId || '1'; // Default userId if not provided
        const board = await Board.findOne({ _id: boardId, userId }); // Find board by ID and userId
        if (!board) {
            return res.status(404).json({ error: 'Board not found' });
        }
        res.status(200).json(board);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/columns/:id', async (req, res) => {
    try {
        const columnId = req.params.id;
        const column = await Column.findById(columnId);

        if (!column) {
            return res.status(404).json({ error: 'Column not found' });
        }

        res.status(200).json(column);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/cards/:id', async (req, res) => {
    try {
        const cardId = req.params.id;
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }
        res.status(200).json(card);
    } catch (error) {
        console.error('Error retrieving card:', error);
        res.status(500).send('Error retrieving card');
    }
});


// POST /boards - Create a new board
app.post('/boards', async (req, res) => {
    try {
        const newBoard = new Board({
            title: req.body.title,
            userId: req.body.userId || 1 // Default to userId 1
        });
        await newBoard.save();
        return res.status(200).json({ board: newBoard });

    } catch (error) {
        console.error('Error creating board:', error);
        return res.status(400).json({ error: error.message });
    }
});

// Upload a Column and add a reference to the board 
app.post('/columns', async (req, res) => {
    console.log("Column Post Request pending...");
    const { title, boardId } = req.body;

    try {
        const newColumn = new Column({ title });
        await newColumn.save();
        console.log('Column Post request success', newColumn);

        // Add reference of the new column to the board
        const result = await Board.updateOne(
            { _id: boardId },
            { $push: { columns: newColumn._id } }
        );

        if (result.modifiedCount > 0) {
            return res.status(200).json({ message: 'Column added to board successfully' });
        } else {
            return res.status(500).json({ message: 'Failed to update board' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(400).json({ error: error.message });
    }
});

// Upload a card and adds a reference to the parent column
app.post('/cards', async (req, res) => {
    const { title, text, priority, columnId } = req.body;
    try {
        const newCard = new Card({ title, text, priority });
        await newCard.save();
        console.log('Card Post request success', newCard);

        // Add reference of the new card to it's column
        const result = await Column.updateOne(
            { _id: columnId },
            { $push: { cards: newCard._id } }
        );

        if (result.modifiedCount > 0) {
            return res.status(200).json({ message: 'Card added to column successfully' });
        } else {
            return res.status(500).json({ message: 'Failed to update Column' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE endpoint to handle board deletion
app.delete('/boards/:boardId', async (req, res) => {
    const { boardId } = req.params;
    try {
        const board = await Board.findById(boardId).populate('columns');
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        // Loop through each column to delete cards & self
        for (const column of board.columns) {
            await Card.deleteMany({ _id: { $in: column.cards } });
            await Column.findByIdAndDelete(column._id);
        }
        await Board.findByIdAndDelete(boardId);
        res.status(200).json({ message: 'Board, columns, and cards deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a Column from a Board
app.delete('/boards/:boardId/columns/:columnId', async (req, res) => {
    const { boardId, columnId } = req.params;
    //const { boardId } = req.body;
    try {
        // Find the column and populate its cards
        const column = await Column.findById(columnId).populate('cards');
        if (!column) {
            return res.status(404).json({ message: 'Column not found' });
        }

        // Delete all cards, the Column
        await Card.deleteMany({ _id: { $in: column.cards.map(card => card._id) } });
        await Column.findByIdAndDelete(columnId);

        // Remove reference from the parent board
        const board = await Board.findById(boardId);
        if (board) {
            board.columns = board.columns.filter(colId => colId.toString() !== columnId);
            await board.save();
        }

        res.status(200).json({ message: 'Column and associated cards deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/columns/:columnId/cards/:cardId', async (req, res) => {
    console.log("req del card");
    const { columnId, cardId } = req.params;
    console.log(columnId, cardId);
    //const { columnId } = req.body;

    try {
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        await Card.findByIdAndDelete(cardId);

        // Remove reference from Colun
        if (columnId) {
            const column = await Column.findById(columnId);
            if (column) {
                column.cards = column.cards.filter(cId => cId.toString() !== cardId);
                await column.save();
            }
        }

        res.status(200).json({ message: 'Card deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




