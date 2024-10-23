require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const express = require('express');
const mongoose = require('mongoose');
const Card = require('./models/card');
const Column = require('./models/column');
const Board = require('./models/board');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

// Middleware
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

/* const uri = 'mongodb+srv://taskBin:oDN1d6gcSCNyIpfE@taskbinfree.p0skw.mongodb.net/TaskBin?retryWrites=true&w=majority';
mongoose.connect(uri); */

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user; // Attach user info to request
        next(); // Proceed to the next middleware
    });
};

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists 
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create a JWT
        const token = jwt.sign(
            { userId: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' });

        // Send a success response with the token
        res.status(200).json({ token, userId: existingUser._id });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Signup Route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        // user schema hashes pass for us.
        const newUser = new User({
            username,
            email,
            password
        });

        // Save the user to the database
        await newUser.save();

        // Create a JWT
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send a success response with the token
        res.status(201).json({ token, userId: newUser._id });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/boards/:userId', authenticateToken, async (req, res) => {
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
        const userId = req.params.userId;
        const board = await Board.findOne({ _id: boardId, userId });
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
            description: req.body.description,
            userId: req.body.userId
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
    const { title, boardId } = req.body;
    try {
        const newColumn = new Column({ title });
        await newColumn.save();

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

        // Add reference of the new card to it's column
        const result = await Column.updateOne(
            { _id: columnId },
            { $push: { cards: newCard._id } }
        );

        if (result.modifiedCount > 0) {
            return res.status(200).json(newCard);
        } else {
            return res.status(500).json({ message: 'Failed to update Column' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a Board
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

// Delete a Card from a Column
app.delete('/columns/:columnId/cards/:cardId', async (req, res) => {
    const { columnId, cardId } = req.params;
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

//--- Patch Requests ---
app.patch('/columns/:columnId/cards/:cardId', async (req, res) => {
    const { cardId } = req.params;
    const { title, text, priority } = req.body;

    try {
        const updatedCard = await Card.findByIdAndUpdate(
            cardId,
            { title, text, priority },
            { new: true, runValidators: true }
        );

        if (!updatedCard) {
            return res.status(404).json({ message: 'Card not found' });
        }

        res.status(200).json(updatedCard);
    } catch (error) {
        console.error('Error updating card:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.patch('/columns/:columnId', async (req, res) => {
    const { columnId } = req.params;
    const { title } = req.body;

    try {
        const updatedColumn = await Column.findByIdAndUpdate(
            columnId,
            { title },
            { new: true, runValidators: true }
        );

        if (!updatedColumn) {
            return res.status(404).json({ message: 'Column not found' });
        }

        res.status(200).json(updatedColumn);
    }
    catch (error) {
        console.error('Error updating Column', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.patch('/boards/:boardId', async (req, res) => {
    const { boardId } = req.params;
    const { title, description, columns } = req.body;

    // Create an update object only with the fields that are defined
    const updateFields = {
        ...(title && { title }),
        ...(description && { description }),
        ...(columns && { columns })
    };

    try {
        const updatedBoard = await Board.findByIdAndUpdate(
            boardId,
            updateFields,  // Update with only defined fields
            { new: true, runValidators: true }
        );

        if (!updatedBoard) {
            return res.status(404).json({ message: 'Board not found' });
        }

        res.status(200).json({ message: 'Board updated', board: updatedBoard });
    } catch (error) {
        console.error('Error updating Board', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




