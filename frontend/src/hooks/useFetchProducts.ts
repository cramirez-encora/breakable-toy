import { useCallback } from "react";
import { useSearchStore } from "../store/useSearchStore";
import { Product } from "../types/Product";

export const useFetchProducts = (setProductList: (p: Product[]) => void) => {
    const { filters } = useSearchStore();

    return useCallback(async () => {
        try {
            const queryParams = new URLSearchParams();
            if (filters.searchTerm.trim()) queryParams.append("name", filters.searchTerm);
            if (filters.categories.length > 0) queryParams.append("category", filters.categories.join(","));
            if (filters.stock.length > 0 && !filters.stock.includes("All")) {
                queryParams.append("stock", filters.stock.join(","));
            }

            const res = await fetch(`http://localhost:9090/products?${queryParams.toString()}`);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const data = await res.json();
            setProductList(data);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    }, [filters]);
};
