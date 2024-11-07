import { render, screen, fireEvent } from '@testing-library/react';
import ControlBar from '../controlBar';
import '@testing-library/jest-dom';


const mockProps = {
    allBoards: [
        { _id: '1', title: 'Board 1' },
        { _id: '2', title: 'Board 2' }
    ],
    selectedBoard: { _id: '1', title: 'Board 1', description: 'Description' },
    boardTitle: 'Board 1',
    boardDesc: 'Description',
    onBoardSelect: jest.fn(),
    addBoard: jest.fn(),
    addColumn: jest.fn(),
    delBoard: jest.fn(),
    editBoard: jest.fn()
};

describe('ControlBar', () => {
    test('renders the control bar with board selection dropdown and buttons', () => {
        render(<ControlBar {...mockProps} />);

        // Check if the board selection dropdown is rendered
        expect(screen.getByText('Select a Board')).toBeInTheDocument();

        // Check if the the buttons exist
        expect(screen.getByText('New Board')).toBeInTheDocument();
        expect(screen.getByText('New Column')).toBeInTheDocument();
        expect(screen.getByText('Delete Board')).toBeInTheDocument();
    });

    test('handles board selection change', () => {
        render(<ControlBar {...mockProps} />);

        // Simulate selecting a different board
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });

        // Ensure the onBoardSelect function is called with the correct parameters
        expect(mockProps.onBoardSelect).toHaveBeenCalledWith({ boardId: '2' });
    });

    test('shows "New Board" and "New Column" forms when buttons are clicked', () => {
        render(<ControlBar {...mockProps} />);

        // Click "New Board" button and check if the BoardForm is visible
        fireEvent.click(screen.getByText('New Board'));
        expect(screen.getByLabelText('New Board Title')).toBeInTheDocument();

        // Click "New Column" button and check if the ColumnForm is visible
        fireEvent.click(screen.getByText('New Column'));
        expect(screen.getByLabelText('New Column Title')).toBeInTheDocument();
    });

    test('shows delete confirmation popup when "Delete Board" button is clicked', () => {
        render(<ControlBar {...mockProps} />);

        // Click the "Delete Board" button
        fireEvent.click(screen.getByText('Delete Board'));

        // Ensure the confirmation popup appears
        expect(screen.getByText('Delete this Board?')).toBeInTheDocument();

        // Click cancel and verify the popup disappears
        fireEvent.click(screen.getByText('Cancel'));
        expect(screen.queryByText('Delete this Board?')).not.toBeInTheDocument();

        // Click confirm and verify the delete function is called
        fireEvent.click(screen.getByText('Delete Board'));
        fireEvent.click(screen.getByText('Confirm'));
        expect(mockProps.delBoard).toHaveBeenCalledWith({ boardId: '1' });
    });
});
