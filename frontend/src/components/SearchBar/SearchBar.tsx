import MultiselectDropdown from "../MultiselectDropdown/MultiselectDropdown.tsx";
import TextInput from "../TextInput/TextInput.tsx";
import Button from "../Button/Button.tsx";
import { categoryOptions, categoryLabel, stockOptions, stockLabel, nameLabel } from "../../constants/SearchBarConsts.ts";
import {useState} from "react";

function SearchBar(){
    const [categorySelectedOptions, categorySetSelectedOptions] = useState<string[]>([]);
    const [stockSelectedOptions, stockSetSelectedOptions] = useState<string[]>([]);
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