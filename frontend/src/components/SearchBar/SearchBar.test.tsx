import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "@testing-library/react";
import SearchBar from "./SearchBar";

import { useSearchStore } from "../../store/useSearchStore";
import { useProductStore } from "../../store/useProductStore";

// Mocks for Zustand stores
jest.mock("../../store/useSearchStore");
jest.mock("../../store/useProductStore");

const mockedUseSearchStore = useSearchStore as unknown as jest.Mock;
const mockedUseProductStore = useProductStore as unknown as jest.Mock;

const mockSetFilters = jest.fn();

beforeEach(() => {
    (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(["Electronics", "Books"]),
        })
    );

    mockedUseSearchStore.mockImplementation((selector) =>
        selector({ setFilters: mockSetFilters })
    );

    mockedUseProductStore.mockImplementation((selector) =>
        selector({ refreshToken: 1 })
    );

    jest.clearAllMocks();
});

test("renders inputs and button", async () => {
    await act(async () => {
        render(<SearchBar />);
    });

    expect(screen.getByPlaceholderText(/write the product name/i)).toBeInTheDocument();
    expect(await screen.findAllByPlaceholderText(/select options/i)).toHaveLength(2);
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
});

test("fetches and displays categories", async () => {
    await act(async () => {
        render(<SearchBar />);
    });

    fireEvent.click(screen.getAllByRole("button")[0]); // open dropdown

    await waitFor(() => {
        expect(screen.getByText("Electronics")).toBeInTheDocument();
        expect(screen.getByText("Books")).toBeInTheDocument();
    });
});

test("search button calls setFilters with correct values", async () => {
    await act(async () => {
        render(<SearchBar />);
    });

    fireEvent.change(screen.getByPlaceholderText(/write the product name/i), {
        target: { value: "laptop" },
    });

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(mockSetFilters).toHaveBeenCalledWith({
        searchTerm: "laptop",
        categories: [],
        stock: [],
    });
});
