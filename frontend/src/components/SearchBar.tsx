import MultiselectDropdown from "./MultiselectDropdown.tsx";
import TextInput from "./TextInput.tsx";
import Button from "./Button.tsx";
import {useState} from "react";

function SearchBar(){
    const categoryOptions = ['Pets', 'Home', 'Food', 'Cleaning'];
    const categoryLabel = 'Category: ';
    const [categorySelectedOptions, categorySetSelectedOptions] = useState<string[]>([]);

    const stockOptions = ['In stock', 'Out of stock', 'All']
    const stockLabel = 'Stock: ';
    const [stockSelectedOptions, stockSetSelectedOptions] = useState<string[]>([]);

    const nameLabel = 'Name: ';
    const[search, setSearch] = useState("");

    const handleSearch = () => {
        console.log({search, categorySelectedOptions, stockSelectedOptions});
    };

    return(
        <>
            <div className={"container"}>
                <h2>Search Bar</h2>
                <div className={"container-searchControls"}>
                    <TextInput label={nameLabel} search={search} onSearch={setSearch}/>
                    <MultiselectDropdown options={categoryOptions} label={categoryLabel} selectedOptions = {categorySelectedOptions} setSelectedOptions = {categorySetSelectedOptions}/>
                    <MultiselectDropdown options={stockOptions} label={stockLabel} selectedOptions = {stockSelectedOptions} setSelectedOptions = {stockSetSelectedOptions}/>
                    <Button label={"Search"} onClick={handleSearch}></Button>
                </div>
            </div>
        </>
    )
}

export default SearchBar