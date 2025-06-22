import { TableColumn } from "react-data-table-component";
import type { Product } from "../../types/Product.ts";

const getStockColor = (qty: number) => {
    if (qty === 0) return "gray";
    if (qty < 5) return "red";
    if (qty <= 10) return "orange";
    return "black";
};

export const getProductTableColumns = (
    onEdit: (product: Product) => void,
    onDelete: (id: number) => void
): TableColumn<Product>[] => [
    {
        name: "Category",
        selector: (row) => row.category,
        sortable: true,
    },
    {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
        cell: (row) => (
            <span style={{ textDecoration: row.quantityStock === 0 ? "line-through" : "none" }}>
        {row.name}
      </span>
        ),
    },
    {
        name: "Price",
        selector: (row) => row.unitPrice,
        format: (row) => `$${row.unitPrice.toFixed(2)}`,
        sortable: true,
    },
    {
        name: "Expiration Date",
        selector: (row) => row.expDate,
        sortable: true,
    },
    {
        name: "Stock",
        selector: (row) => row.quantityStock,
        sortable: true,
        cell: (row) => (
            <span style={{ color: getStockColor(row.quantityStock), fontWeight: "bold" }}>
        {row.quantityStock}
      </span>
        ),
    },
    {
        name: "Actions",
        cell: (row) => (
            <div>
                <button onClick={() => onEdit(row)}>Edit</button>
                <button onClick={() => onDelete(row.id)}>Delete</button>
            </div>
        ),
        ignoreRowClick: true,
    },
];
