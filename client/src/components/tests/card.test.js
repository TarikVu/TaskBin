// Card.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../card';
import '@testing-library/jest-dom';

// Mock the functions delCard and editCard
const mockDelCard = jest.fn();
const mockEditCard = jest.fn();

// Sample card data
const mockCard = {
    _id: '1',
    title: 'Test Card',
};

const mockColumnId = '123';

describe('Card Component', () => {
    beforeEach(() => {
        // Clear mock functions before each test
        mockDelCard.mockClear();
        mockEditCard.mockClear();
    });

    test('renders card with title', () => {
        render(
            <Card card={mockCard} columnId={mockColumnId} delCard={mockDelCard} editCard={mockEditCard} />
        );

        const title = screen.getByText(/Test Card/i);
        expect(title).toBeInTheDocument();
    });

    test('displays edit and delete buttons', () => {
        render(
            <Card card={mockCard} columnId={mockColumnId} delCard={mockDelCard} editCard={mockEditCard} />
        );

        const editButton = screen.getByLabelText(/Edit Card/i);
        const deleteButton = screen.getByLabelText(/Delete Card/i);

        expect(editButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();
    });

    test('calls delCard function when delete button is clicked', () => {
        render(
            <Card card={mockCard} columnId={mockColumnId} delCard={mockDelCard} editCard={mockEditCard} />
        );

        const deleteButton = screen.getByLabelText(/Delete Card/i);
        fireEvent.click(deleteButton);

        expect(mockDelCard).toHaveBeenCalledTimes(1);
        expect(mockDelCard).toHaveBeenCalledWith({ columnId: mockColumnId, cardId: mockCard._id });
    });

    test('calls editCard function when edit button is clicked', () => {
        render(
            <Card card={mockCard} columnId={mockColumnId} delCard={mockDelCard} editCard={mockEditCard} />
        );

        const editButton = screen.getByLabelText(/Edit Card/i);
        fireEvent.click(editButton);

        expect(mockEditCard).toHaveBeenCalledTimes(1);
    });

    test('has drag icon button with correct aria label', () => {
        render(
            <Card card={mockCard} columnId={mockColumnId} delCard={mockDelCard} editCard={mockEditCard} />
        );

        const dragButton = screen.getByLabelText(/Drag Card/i);
        expect(dragButton).toBeInTheDocument();
    });
});
