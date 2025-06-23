import { render, screen } from "@testing-library/react";
import StockMetricsTable from "./StockMetricsTable";
import { useProductStore } from "../../store/useProductStore";

jest.mock("../../store/useProductStore", () => ({
    useProductStore: jest.fn(),
}));

beforeEach(() => {
    (useProductStore as unknown as jest.Mock).mockReturnValue({ refreshToken: 1 });

    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve({
                    TOTAL: {
                        totalStock: 100,
                        totalValue: 5000,
                        averagePrice: 50,
                    },
                    Toys: {
                        totalStock: 50,
                        totalValue: 2500,
                        averagePrice: 50,
                    },
                }),
        })
    ) as jest.Mock;
});

test("renders stock metrics table with rows", async () => {
    render(<StockMetricsTable />);

    expect(await screen.findByText("Toys")).toBeInTheDocument();
    expect(screen.getByText("TOTAL")).toBeInTheDocument();
});
