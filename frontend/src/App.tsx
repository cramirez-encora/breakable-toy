import './App.css'
import SearchBar from "./components/SearchBar/SearchBar.tsx";
import ResultsTable from "./components/ResultsTable.tsx";
function App() {
  return (
    <>
        <h1>APP Breakable Toy</h1>
        <SearchBar/>
        <ResultsTable></ResultsTable>
    </>
  )
}

export default App
