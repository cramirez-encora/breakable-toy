import { render, screen } from "@testing-library/react";
import ResultsTable from "./ResultsTable";
import { useProductStore } from "../../store/useProductStore";

jest.mock("../../store/useProductStore", () => ({
    useProductStore: jest.fn(),
}));

jest.mock("../../hooks/useFetchProducts", () => ({
    useFetchProducts: () => jest.fn(),
}));

beforeEach(() => {
    (useProductStore as unknown as jest.Mock).mockReturnValue({
        refreshToken: 1,
        triggerRefresh: jest.fn(),
    });
    global.fetch = jest.fn(() =>
        Promise.resolve({ json: () => Promise.resolve([]), ok: true })
    ) as jest.Mock;
});

test("renders results table with header", async () => {
    render(<ResultsTable />);
    expect(await screen.findByText(/Results/i)).toBeInTheDocument();
});
