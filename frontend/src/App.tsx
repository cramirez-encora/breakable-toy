import './App.css'
import SearchBar from "./components/SearchBar/SearchBar.tsx";
import ResultsTable from "./components/ResultsTable/ResultsTable.tsx";
import Modal from "./components/Modal/Modal.tsx"
import StockMetricsTable from "./components/StockMetricsTable/StockMetricsTable.tsx";
import {useState} from "react";

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const refreshProducts = () => {
        setRefreshTrigger(prev => {
            return !prev;
        });
    };
  return (
    <>
        <h1>APP Breakable Toy</h1>
        <SearchBar/>
        <div className="app-container" >
            <button onClick={() => setIsModalOpen(true)} className="open-modal-button"  >
                New Product
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} refreshProducts={refreshProducts} />
        </div>
        <ResultsTable refreshTrigger={refreshTrigger} setRefreshTrigger={refreshProducts}/>
        <StockMetricsTable refreshTrigger={refreshTrigger}/>
    </>
  );
}

export default App
