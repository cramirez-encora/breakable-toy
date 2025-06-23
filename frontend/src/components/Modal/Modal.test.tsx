import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "@testing-library/react";
import Modal from "./Modal";

const mockOnClose = jest.fn();
const mockRefresh = jest.fn();

beforeEach(() => {
    (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(["Food", "Toys"]),
        })
    );
    jest.clearAllMocks();
});

test("does not render when closed", async () => {
    let container: HTMLElement;

    await act(async () => {
        const result = render(
            <Modal isOpen={false} onClose={mockOnClose} refreshProducts={mockRefresh} />
        );
        container = result.container;
    });

    expect(container!).toBeEmptyDOMElement();
});

test("renders when open and fetches categories", async () => {
    await act(async () => {
        render(<Modal isOpen={true} onClose={mockOnClose} refreshProducts={mockRefresh} />);
    });

    expect(screen.getByText(/Register New Product/i)).toBeInTheDocument();

    await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
    });

    expect(screen.getByPlaceholderText(/Write the product name.../i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
});

test("shows alert if form is incomplete", async () => {
    window.alert = jest.fn();

    await act(async () => {
        render(<Modal isOpen={true} onClose={mockOnClose} refreshProducts={mockRefresh} />);
    });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    expect(window.alert).toHaveBeenCalledWith("All fields are required.");
});
