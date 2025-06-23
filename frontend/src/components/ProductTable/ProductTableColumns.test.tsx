import { render } from "@testing-library/react";
import { getProductTableColumns } from "./ProductTableColumns";
import { Product } from "../../types/Product";

test("action column renders edit and delete buttons", () => {
    const mockEdit = jest.fn();
    const mockDelete = jest.fn();

    const product: Product = {
        id: 1,
        name: "Test Product",
        category: "Books",
        quantityStock: 3,
        unitPrice: 10.5,
        expDate: "2025-12-31",
    } as Product;

    const columns = getProductTableColumns(mockEdit, mockDelete);
    const actionCol = columns.find(col => col.name === "Actions");

    expect(actionCol).toBeDefined();

    if (actionCol && typeof actionCol.cell === "function") {
        // Call with all expected arguments: (row, rowIndex, column, id)
        const rendered = actionCol.cell(product, 0, actionCol, "actions");

        const { getByText } = render(<>{rendered}</>);

        expect(getByText("Edit")).toBeInTheDocument();
        expect(getByText("Delete")).toBeInTheDocument();
    }
});
