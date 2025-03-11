import MultiselectDropdown from "./MultiselectDropdown.tsx";
import TextInput from "./TextInput.tsx";
import Button from "./Button.tsx";
import {useState} from "react";
import {useSearchStore} from "../store/useSearchStore.ts";

function SearchBar(){
    const categoryOptions = ['Pets', 'Home', 'Food', 'Cleaning'];
    const categoryLabel = 'Category: ';
    const [categorySelectedOptions, categorySetSelectedOptions] = useState<string[]>([]);

    const stockOptions = ['In stock', 'Out of stock', 'All']
    const stockLabel = 'Stock: ';
    const [stockSelectedOptions, stockSetSelectedOptions] = useState<string[]>([]);

    const nameLabel = 'Name: ';
    const[searchName, setSearch] = useState("");

    const setFilters = useSearchStore((state) => state.setFilters);

    const handleSearch = () => {
        console.log({searchName, categorySelectedOptions, stockSelectedOptions});
        setFilters({searchTerm: searchName,categories: categorySelectedOptions,stock: stockSelectedOptions})
    };

    return(
        <>
            <div className={"container"}>
                <h2>Search Bar</h2>
                <div className={"container-searchControls"}>
                    <TextInput label={nameLabel} search={searchName} onSearch={setSearch}/>
                    <MultiselectDropdown options={categoryOptions} label={categoryLabel} selectedOptions = {categorySelectedOptions} setSelectedOptions = {categorySetSelectedOptions}/>
                    <MultiselectDropdown options={stockOptions} label={stockLabel} selectedOptions = {stockSelectedOptions} setSelectedOptions = {stockSetSelectedOptions}/>
                    <Button label={"Search"} onClick={handleSearch}></Button>
                </div>
            </div>
        </>
    )
}

export default SearchBar