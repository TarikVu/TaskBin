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
}, { timestamps: true });

// Create the models
const Card = mongoose.model('Card', cardSchema);
const Column = mongoose.model('Column', columnSchema);
const Board = mongoose.model('Board', boardSchema);


/// API ///

// GET //
app.get('/boards', async (req, res) => {
    try {
        const boards = await Board.find()
            .populate({
                path: 'columns',
                populate: {
                    path: 'cards'
                }
            });

        res.json(boards);
    } catch (error) {
        res.status(500).send('Error retrieving boards');
    }
});


app.get('/cards', async (req, res) => {
    try {
        const cards = await Card.find(); // Fetch all cards from the database
        console.log(cards);
        res.json(cards); // Send the cards as a JSON response
    } catch (error) {
        res.status(500).send('Error retrieving cards');
    }
});

// POST //
app.post('/cards', async (req, res) => {
    try {
        const newCard = new Card(req.body);
        await newCard.save();
        res.status(201).json(newCard);
        console.log('Card Post request');

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.post('/columns', async (req, res) => {
    try {
        const newColumn = new Column(req.body);
        await newColumn.save();
        res.status(201).json(newColumn);
        console.log('Column Post request success');

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.post('/boards', async (req, res) => {
    try {
        const newBoard = Board(req.body);
        await newBoard.save();
        res.status(201).json(newBoard);
        console.log('Board Post request');

    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }

});

app.post('/columns/:columnId/cards', async (req, res) => {
    const { columnId } = req.params;  // Extract columnId from req.params
    const { cardId } = req.body;  // Extract cardId from req.body

    console.log("insert card: ", cardId);
    console.log("for ", columnId);

    // Logic to update the column in the database
    const updatedColumn = await addCardToColumnInDB(columnId, cardId);

    if (updatedColumn) {
        res.status(200).json({ message: 'Card added to column successfully' });
    } else {
        res.status(500).json({ message: 'Failed to update column' });
    }
});

// Example of what the addCardToColumnInDB function might look like
const addCardToColumnInDB = async (columnId, cardId) => {
    try {
        // Assuming you have a MongoDB collection named 'columns'
        const result = await Column.updateOne(
            { _id: columnId }, // Find the column by its ID
            { $push: { cards: cardId } } // Add the cardId to the cards array
        );

        return result.modifiedCount > 0; // Return true if the update was successful
    } catch (error) {
        console.error('Error updating column:${columnId}', error);
        return false; // Return false if there was an error
    }
};


app.listen(5000, () => console.log('Server running on port 5000'));
