import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Column from '../column';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

const mockDelColumn = jest.fn();
const mockEditColumn = jest.fn();
const mockAddCard = jest.fn();
const mockDelCard = jest.fn();
const mockEditCard = jest.fn();
const mockPropagateBoard = jest.fn();

const columnData = {
    _id: 'col-1',
    title: 'Column 1',
    cards: [
        { _id: 'card-1', title: 'Card 1', text: 'Some text', priority: 'High' },
    ],
};

describe('Column Component', () => {



    test('deleting a column', () => {
        render(
            <Column
                column={columnData}
                delColumn={mockDelColumn}
                editColumn={mockEditColumn}
                addCard={mockAddCard}
                delCard={mockDelCard}
                editCard={mockEditCard}
                propagateBoard={mockPropagateBoard}
            />
        );

        const deleteButton = screen.getByLabelText(/Delete Column/i);
        userEvent.click(deleteButton);

        const confirmButton = screen.getByText('Confirm');
        userEvent.click(confirmButton);

        expect(mockDelColumn).toHaveBeenCalledWith({ columnId: 'col-1' });
    });

    test('shows and hides the confirmation delete modal', () => {
        render(
            <Column
                column={columnData}
                delColumn={mockDelColumn}
                editColumn={mockEditColumn}
                addCard={mockAddCard}
                delCard={mockDelCard}
                editCard={mockEditCard}
                propagateBoard={mockPropagateBoard}
            />
        );

        const deleteButton = screen.getByLabelText(/Delete Column/i);
        userEvent.click(deleteButton);

        const modal = screen.getByText(/Delete this Column?/i);
        expect(modal).toBeInTheDocument();

        const cancelButton = screen.getByText('Cancel');
        userEvent.click(cancelButton);

        expect(modal).not.toBeInTheDocument();
    });
});
