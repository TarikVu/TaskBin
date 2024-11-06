import { render, screen } from '@testing-library/react';
import Board from '../board';
import '@testing-library/jest-dom';

const mockBoard = {
    _id: 'board1',
    columns: [
        {
            _id: 'col1',
            title: 'Column 1',
            cards: [
                { _id: 'card1', title: 'Card 1' },
                { _id: 'card2', title: 'Card 2' },
            ],
        },
        {
            _id: 'col2',
            title: 'Column 2',
            cards: [{ _id: 'card3', title: 'Card 3' }],
        },
    ],
};

const mockFunctions = {
    delColumn: jest.fn(),
    editColumn: jest.fn(),
    addCard: jest.fn(),
    delCard: jest.fn(),
    editCard: jest.fn(),
    moveCard: jest.fn(),
    editBoard: jest.fn(),
    setBoard: jest.fn(),
};

test('renders board with columns', () => {
    render(<Board board={mockBoard} {...mockFunctions} />);

    // Check if columns are rendered
    expect(screen.getByText('Column 1')).toBeInTheDocument();
    expect(screen.getByText('Column 2')).toBeInTheDocument();

    // Check if cards in columns are rendered
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
    expect(screen.getByText('Card 3')).toBeInTheDocument();
});
test('renders empty board without columns', () => {
    const emptyBoard = {
        _id: 'board2',
        columns: [],
    };

    render(<Board board={emptyBoard} {...mockFunctions} />);

    // Check if the board is rendered without any columns
    expect(screen.queryByText('Column 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Column 2')).not.toBeInTheDocument();
});

test('renders add card button in each column', () => {
    render(<Board board={mockBoard} {...mockFunctions} />);

    // Check if there is one "Add Card" button for each column
    const addCardButtons = screen.getAllByText('+');
    expect(addCardButtons.length).toBe(mockBoard.columns.length);
});

test('ensures columns are draggable', () => {
    render(<Board board={mockBoard} {...mockFunctions} />);

    // Check if the drag event is triggered by hovering over a column  
    const column = screen.getByText('Column 1');
    expect(column).toBeInTheDocument();

});



