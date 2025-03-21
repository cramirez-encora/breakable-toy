import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import SearchBar from "./SearchBar";
import "@testing-library/jest-dom";

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(["Electronics", "Books", "Clothing"]),
    })
) as jest.Mock;

test("renders SearchBar with input, dropdowns, and button", async () => {
    render(<SearchBar />);

    expect(screen.getByPlaceholderText(/Write the product name/i)).toBeInTheDocument();

    expect(screen.getAllByPlaceholderText(/select options/i)).toHaveLength(2);

    expect(screen.getAllByRole("button")).toHaveLength(3);

    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();

    const dropdownButton = screen.getAllByRole("button")[0]; // Assuming first button is for category dropdown
    fireEvent.click(dropdownButton);

    await waitFor(() => {
        expect(screen.getByText("Electronics")).toBeInTheDocument();
        expect(screen.getByText("Books")).toBeInTheDocument();
        expect(screen.getByText("Clothing")).toBeInTheDocument();
    });
});