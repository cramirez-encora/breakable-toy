import { useEffect, useState, useMemo } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useSearchStore, Product } from "../../store/useSearchStore.ts";
import Modal from "../Modal/Modal.tsx";

//Crear interface

function ResultsTable({ refreshTrigger, setRefreshTrigger }: { refreshTrigger: boolean , setRefreshTrigger: ()=> void}) {
    const { filters } = useSearchStore();
    const [productList, setProductList] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});

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

    useEffect(() => {
        void fetchProducts();
    }, [filters, refreshTrigger]);

    const handleUpdate = async () =>{
        await fetchProducts();
        setRefreshTrigger();
    }

    const handleSelectedRowsChange = async (selected: { selectedRows: Product[] }) => {
        const newSelectedRows: Record<number, boolean> = {};

        selected.selectedRows.forEach((product) => {
            newSelectedRows[product.id] = true;
        });

        const changedProducts = productList.filter((product) => {
            return selectedRows[product.id] !== newSelectedRows[product.id];
        });

        for (const product of changedProducts) {
            try {
                const isSelected = newSelectedRows[product.id];
                const endpoint = isSelected
                    ? `http://localhost:9090/products/${product.id}/outofstock`
                    : `http://localhost:9090/products/${product.id}/instock?quantity=10`;

                const response = await fetch(endpoint, {
                    method: isSelected ? "POST" : "PUT",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error(`Failed to update stock for product ${product.id}`);
                }
            } catch (error) {
                console.error(error);
            }
        }

        setSelectedRows(newSelectedRows);
        console.log("There was a selection")
        setRefreshTrigger();
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        fetchProducts();
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:9090/products/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete product");
            }

            alert("Product deleted successfully!");
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error: Unable to delete product.");
        }
    };

    const getRowStyle = (expDate: string | null) => {
        if (!expDate) return "transparent";

        const today = new Date();
        const expDateObj = new Date(expDate);
        const timeDiff = expDateObj.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysRemaining < 7) return "#ffcccc";
        if (daysRemaining <= 14) return "#fff5cc";
        return "#ccffcc";
    };

    const getStockColor = (quantity: number) => {
        if (quantity === 0) return "gray";
        if (quantity < 5) return "red";
        if (quantity <= 10) return "orange";
        return "black";
    };

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
                        <button onClick={() => handleEdit(row)}> Edit</button>
                        <button onClick={() => handleDelete(row.id)}> Delete</button>
                    </div>
                ),
                ignoreRowClick: true
            },
        ],
        []
    );

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
                onSelectedRowsChange={handleSelectedRowsChange}
                conditionalRowStyles={[
                    {
                        when: row => true,
                        style: row => ({
                            backgroundColor: getRowStyle(row.expDate),
                        }),
                    },
                ]}
            />

            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    refreshProducts={handleUpdate}
                    product={selectedProduct}
                />
            )}
        </div>
    );
}

export default ResultsTable;