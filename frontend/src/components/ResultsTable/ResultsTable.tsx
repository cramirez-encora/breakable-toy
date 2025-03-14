import DataTable, { TableColumn } from "react-data-table-component";
import { useSearchStore, Product } from "../../store/useSearchStore.ts";
import { mockProducts } from "../../mocks/productsTest.ts";
import { useMemo } from "react";

function ResultsTable() {
    const { filters } = useSearchStore();
    const productList = mockProducts; // Using mock data for testing


    const filteredResults = productList.filter((item) => {
        const stockCondition =
            filters.stock.includes("All") ||
            (filters.stock.includes("In stock") && (item.quantityStock > 0)) ||
            (filters.stock.includes("Out of stock") && (item.quantityStock === 0));

        const categoryCondition =
            filters.categories.length === 0 ||
            item.category.some((cat) => filters.categories.includes(cat));

        const nameCondition =
            filters.searchTerm.trim() === "" ||
            item.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
        return stockCondition && categoryCondition && nameCondition;
    });


    const columns: TableColumn<Product>[] = useMemo(
        () => [
            { name: "Category",
                selector: (row) => row.category.join(", "),
                sortable: true
            },
            { name: "Name",
                selector: (row) => row.name,
                sortable: true
            },
            { name: "Price",
                selector: (row) => row.unitPrice,
                format: (row) => `$${row.unitPrice.toFixed(2)}`,
                sortable: true,
                sortFunction: (a, b) => a.unitPrice - b.unitPrice,
            },
            { name: "Expiration Date",
                selector: (row) => row.expDate,
                sortable: true
            },
            {
                name: "Stock",
                selector: (row) => row.quantityStock,
                sortable: true,
                format: (row) => row.quantityStock,
            },
            {
                name: "Actions",
                cell: (row) => (
                    <div>
                        <button onClick={() => handleEdit(row)}> Edit</button>
                        <button onClick={() => handleDelete(row.id)}> Delete</button>
                    </div>
                ),
                ignoreRowClick: true,
                allowOverflow: true,
                button: true,
            },
        ],
        []
    );

    const handleEdit = (product: Product) => {
        console.log("Editing:", product);
    };

    const handleDelete = (id: number) => {
        console.log("Deleting product with ID:", id);
    };

    return (
        <div className="results-container">
            <h2>Results</h2>
            <DataTable
                columns={columns}
                data={filteredResults}
                pagination
                selectableRows
                highlightOnHover
                fixedHeader
            />
        </div>
    );
}

export default ResultsTable;