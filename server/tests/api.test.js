const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');

// Mock data
const mockBoardData = {
    title: 'Test Board',
    description: 'This is a test board',
    userId: 'someUserId'
};
const mockUser = {
    userId: 'someUserId',
    username: 'testuser'
};
const token = jwt.sign({ userId: mockUser.userId }, process.env.JWT_SECRET, {
    expiresIn: '1h',
});

// Run before all tests
let server;
beforeAll(async () => {
    const port = 5000;
    server = app.listen(port, () => console.log(`Test server running on port ${port}`));
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

// Clean up after each test
afterEach(async () => {
    await mongoose.connection.db.collection('boards').deleteMany({});
});

// Run after all tests
afterAll(async () => {
    await mongoose.connection.close();
    if (server) {
        server.close(() => { });
    }
});

describe('Board API Endpoints', () => {

    // Test for creating a board
    it('POST /boards - creates a new board', async () => {
        const response = await request(app)
            .post('/boards')
            .send(mockBoardData);

        expect(response.statusCode).toBe(200);
        expect(response.body.board).toHaveProperty('_id');
        expect(response.body.board.title).toBe(mockBoardData.title);
        expect(response.body.board.description).toBe(mockBoardData.description);
    });

    // Test for retrieving a board by ID
    it('GET /boards/:boardId - retrieves a board by ID', async () => {
        const newBoard = await request(app)
            .post('/boards')
            .send(mockBoardData);

        const boardId = newBoard.body.board._id;

        const response = await request(app)
            .get(`/boards/${boardId}/${mockBoardData.userId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id', boardId);
        expect(response.body.title).toBe(mockBoardData.title);
    });

    // Test for retrieving all boards for a user
    it('GET /boards/:userId - retrieves all boards for a user', async () => {

        // Create a new board for the user
        await request(app)
            .post('/boards')
            .set('Authorization', `Bearer ${token}`)
            .send(mockBoardData);

        // Get boards for the user
        const response = await request(app)
            .get(`/boards/${mockUser.userId}`)
            .set('Authorization', `Bearer ${token}`);

        // Check the response
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    // Test for deleting a board
    it('DELETE /boards/:boardId - deletes a board by ID', async () => {
        // Create a new board
        const newBoard = await request(app)
            .post('/boards')
            .send(mockBoardData);

        const boardId = newBoard.body.board._id;

        // Delete the board
        const response = await request(app)
            .delete(`/boards/${boardId}`);

        // Check the response
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Board, columns, and cards deleted successfully');

        // Ensure the board is deleted by trying to get it
        const getBoardResponse = await request(app)
            .get(`/boards/${boardId}/${mockBoardData.userId}`);
        expect(getBoardResponse.statusCode).toBe(404);  // Not Found
    });

    // Column Tests
    it('POST /columns - creates a new column and adds it to the board', async () => {
        const newBoard = await request(app)
            .post('/boards')
            .send(mockBoardData);
        const boardId = newBoard.body.board._id;

        const columnData = { title: 'Test Column', boardId };
        const response = await request(app)
            .post('/columns')
            .send(columnData);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Column added to board successfully');
    });

    // Test for updating a column title
    it('PATCH /columns/:columnId - returns OK status when editing a column title', async () => {

        // Create a new board
        const newBoard = await request(app)
            .post('/boards')
            .send(mockBoardData);
        const boardId = newBoard.body.board._id;

        // Add a column to the board
        const columnData = { title: 'Old Column Title', boardId };
        await request(app)
            .post('/columns')
            .send(columnData);

        // Fetch the board to get the columnId & parse the response
        const boardResponse = await request(app)
            .get(`/boards/${boardId}/${mockBoardData.userId}`);
        const responseText = boardResponse.res.text;
        const parsedResponse = JSON.parse(responseText);
        const columnId = parsedResponse.columns[0];

        // Update the column title
        const updatedColumnData = { title: 'New Column Title' };
        const response = await request(app)
            .patch(`/columns/${columnId}`)
            .send(updatedColumnData);

        // Check if the response status is OK (200)
        expect(response.statusCode).toBe(200);
    });

});
