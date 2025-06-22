import { useProductStore } from "../store/useProductStore";
import type { Product} from "../types/Product.ts";


export const useProductActions = (fetchProducts: () => Promise<void>) => {
    const triggerRefresh = useProductStore((s) => s.triggerRefresh);

    const handleDelete = async (id: number) => {
        const confirm = window.confirm("Are you sure?");
        if (!confirm) return;

        try {
            const res = await fetch(`http://localhost:9090/products/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            alert("Deleted!");
            await fetchProducts();
            triggerRefresh();
        } catch (e) {
            console.error("Delete error", e);
            alert("Could not delete");
        }
    };

    const handleStockToggle = async (selected: { selectedRows: Product[] }, selectedRows: Record<number, boolean>, setSelectedRows: any, productList: Product[]) => {
        const newSelectedRows: Record<number, boolean> = {};
        selected.selectedRows.forEach(p => (newSelectedRows[p.id] = true));

        const changed = productList.filter(p => selectedRows[p.id] !== newSelectedRows[p.id]);

        for (const p of changed) {
            const endpoint = newSelectedRows[p.id]
                ? `http://localhost:9090/products/${p.id}/outofstock`
                : `http://localhost:9090/products/${p.id}/instock?quantity=10`;

            await fetch(endpoint, { method: newSelectedRows[p.id] ? "POST" : "PUT" });
        }

        setSelectedRows(newSelectedRows);
        triggerRefresh();
    };

    return { handleDelete, handleStockToggle };
};
