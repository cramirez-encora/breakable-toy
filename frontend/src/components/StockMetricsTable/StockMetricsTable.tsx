import { useEffect, useState } from "react";
import "./StockMetricsTable.css";
import { useProductStore } from "../../store/useProductStore";

interface StockMetrics {
    totalStock: number;
    totalValue: number;
    averagePrice: number;
}

function StockMetricsTable() {
    const [metrics, setMetrics] = useState<{ [category: string]: StockMetrics }>({});
    const refreshToken = useProductStore((s) => s.refreshToken);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch(`http://localhost:9090/products/metrics?timestamp=${Date.now()}`);
                if (!response.ok) throw new Error("Failed to fetch metrics");

                const data = await response.json();
                setMetrics(data);
            } catch (error) {
                console.error("Error fetching stock metrics:", error);
            }
        };

        fetchMetrics();
    }, [refreshToken]);


    const totalMetrics = metrics["TOTAL"];
    const categories = Object.keys(metrics).filter(category => category !== "TOTAL");

    return (
        <div className="metrics-container">
            <h2>Stock Metrics</h2>
            <table className="metrics-table">
                <thead>
                <tr>
                    <th>Category</th>
                    <th>Total Products in Stock</th>
                    <th>Total Value in Stock</th>
                    <th>Average Price in Stock</th>
                </tr>
                </thead>
                <tbody>
                {categories.map(category => (
                    <tr key={category}>
                        <td>{category}</td>
                        <td>{metrics[category].totalStock}</td>
                        <td>${metrics[category].totalValue.toFixed(2)}</td>
                        <td>${metrics[category].averagePrice.toFixed(2)}</td>
                    </tr>
                ))}
                {totalMetrics && (
                    <tr className="total-row">
                        <td><strong>TOTAL</strong></td>
                        <td><strong>{totalMetrics.totalStock}</strong></td>
                        <td><strong>${totalMetrics.totalValue.toFixed(2)}</strong></td>
                        <td><strong>${totalMetrics.averagePrice.toFixed(2)}</strong></td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default StockMetricsTable;