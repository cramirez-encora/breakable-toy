import './App.css';
import './styles/FormControls.css'
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

            <div className="section-spacing">
                <SearchBar />
            </div>

            <div className="app-container section-spacing">
                <button onClick={() => setIsModalOpen(true)} className="open-modal-button button">
                    New Product
                </button>
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} refreshProducts={triggerRefresh} />
            </div>

            <div className="section-spacing">
                <ResultsTable />
            </div>

            <div className="section-spacing">
                <StockMetricsTable />
            </div>
        </>
    );
}

export default App;
