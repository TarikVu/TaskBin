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


// API //

// Route to get all boards with their columns and cards
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


// Route to get all cards
app.get('/cards', async (req, res) => {
    try {
        const cards = await Card.find(); // Fetch all cards from the database
        console.log(cards);
        res.json(cards); // Send the cards as a JSON response
    } catch (error) {
        res.status(500).send('Error retrieving cards');
    }
});

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
        console.log('Column Post request');

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

app.listen(5000, () => console.log('Server running on port 5000'));
