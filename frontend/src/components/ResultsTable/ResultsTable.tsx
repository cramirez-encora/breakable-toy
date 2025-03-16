import DataTable, { TableColumn } from "react-data-table-component";
import { useSearchStore, Product } from "../../store/useSearchStore.ts";
import { useEffect, useState, useMemo } from "react";

function ResultsTable() {
    const { filters } = useSearchStore();
    const [productList, setProductList] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const queryParams = new URLSearchParams();
                if (filters.searchTerm.trim()) queryParams.append("name", filters.searchTerm);
                if (filters.categories.length > 0) queryParams.append("category", filters.categories.join(","));
                if (filters.stock.length > 0 && !filters.stock.includes("All")) {
                    queryParams.append("stock", filters.stock.join(","));
                }

                const response = await fetch(`http://localhost:9090/products?${queryParams.toString()}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setProductList(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [filters]);


    const columns: TableColumn<Product>[] = useMemo(
        () => [
            {
                name: "Category",
                selector: (row) => Array.isArray(row.category) ? row.category.join(", ") : String(row.category),
                sortable: true
            },
            {
                name: "Name",
                selector: (row) => row.name,
                sortable: true
            },
            {
                name: "Price",
                selector: (row) => row.unitPrice,
                format: (row) => `$${row.unitPrice}`,
                sortable: true,
                sortFunction: (a, b) => a.unitPrice - b.unitPrice,
            },
            {
                name: "Expiration Date",
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
                ignoreRowClick: true
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
                data={productList}
                pagination
                selectableRows
                highlightOnHover
                fixedHeader
            />
        </div>
    );
}

export default ResultsTable;