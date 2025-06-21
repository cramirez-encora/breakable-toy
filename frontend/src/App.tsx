import './App.css';
import SearchBar from "./components/SearchBar/SearchBar";
import ResultsTable from "./components/ResultsTable/ResultsTable";
import Modal from "./components/Modal/Modal";
import StockMetricsTable from "./components/StockMetricsTable/StockMetricsTable";
import { useState } from "react";
import {useProductStore} from "./store/useProductStore.ts";

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const triggerRefresh = useProductStore((s) => s.triggerRefresh)

    return (
        <>
            <h1>APP Breakable Toy</h1>
            <SearchBar />
            <div className="app-container">
                <button onClick={() => setIsModalOpen(true)} className="open-modal-button">
                    New Product
                </button>
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} refreshProducts={triggerRefresh} />
            </div>
            <ResultsTable />
            <StockMetricsTable />
        </>
    );
}

export default App;
