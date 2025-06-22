import { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import Modal from "../Modal/Modal";
import { useProductStore } from "../../store/useProductStore";
import { Product } from "../../types/Product";
import { useFetchProducts } from "../../hooks/useFetchProducts";
import { getProductTableColumns} from "../ProductTable/ProductTableColumns.tsx";

function ResultsTable() {
    const [productList, setProductList] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});
    const { refreshToken, triggerRefresh } = useProductStore();

    const fetchProducts = useFetchProducts(setProductList);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts, refreshToken]);

    const handleDelete = useCallback(async (id: number) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            const res = await fetch(`http://localhost:9090/products/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete product");
            alert("Deleted");
            fetchProducts();
            triggerRefresh();
        } catch (e) {
            alert("Error deleting product");
            console.error(e);
        }
    }, [fetchProducts]);

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        fetchProducts();
    };

    const handleSelectedRowsChange = async (selected: { selectedRows: Product[] }) => {
        const newSelectedRows: Record<number, boolean> = {};
        selected.selectedRows.forEach(p => newSelectedRows[p.id] = true);

        const changedProducts = productList.filter(p => selectedRows[p.id] !== newSelectedRows[p.id]);

        for (const product of changedProducts) {
            const isSelected = newSelectedRows[product.id];
            const url = isSelected
                ? `http://localhost:9090/products/${product.id}/outofstock`
                : `http://localhost:9090/products/${product.id}/instock?quantity=10`;
            await fetch(url, { method: isSelected ? "POST" : "PUT" });
        }

        setSelectedRows(newSelectedRows);
        triggerRefresh();
    };

    const getRowStyle = (expDate: string | null) => {
        if (!expDate) return "transparent";
        const today = new Date();
        const diffDays = Math.ceil((new Date(expDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 7) return "#ffcccc";
        if (diffDays <= 14) return "#fff5cc";
        return "#ccffcc";
    };

    return (
        <div className="results-container">
            <h2>Results</h2>
            <DataTable
                columns={getProductTableColumns(handleEdit, handleDelete)}
                data={productList}
                pagination
                selectableRows
                highlightOnHover
                fixedHeader
                onSelectedRowsChange={handleSelectedRowsChange}
                conditionalRowStyles={[{
                    when: () => true,
                    style: (row) => ({ backgroundColor: getRowStyle(row.expDate) }),
                }]}
            />
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    refreshProducts={fetchProducts}
                    product={selectedProduct}
                />
            )}
        </div>
    );
}

export default ResultsTable;
