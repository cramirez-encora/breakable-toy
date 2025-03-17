import { useEffect, useState } from "react";
import MultiselectDropdown from "../MultiselectDropdown/MultiselectDropdown.tsx";
import TextInput from "../TextInput/TextInput.tsx";
import Button from "../Button/Button.tsx";
import { stockOptions, stockLabel, nameLabel, categoryLabel } from "../../constants/SearchBarConsts.ts";
import { useSearchStore } from "../../store/useSearchStore.ts";

function SearchBar() {
    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
    const [categorySelectedOptions, categorySetSelectedOptions] = useState<string[]>([]);
    const [stockSelectedOptions, stockSetSelectedOptions] = useState<string[]>([]);
    const [search, setSearch] = useState("");

    const setFilters = useSearchStore((state) => state.setFilters);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:9090/categories");
                const data = await response.json();
                console.log("Fetched categories:", data);
                setCategoryOptions(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);


    const handleSearch = () => {
        console.log({ search, categorySelectedOptions, stockSelectedOptions });
        setFilters({ searchTerm: search, categories: categorySelectedOptions, stock: stockSelectedOptions });
    };

    return (
        <div className="container">
            <h2>Search Bar</h2>
            <div className="container-searchControls">
                <TextInput label={nameLabel} search={search} onSearch={setSearch} />
                <MultiselectDropdown
                    options={categoryOptions}
                    label={categoryLabel}
                    selectedOptions={categorySelectedOptions}
                    setSelectedOptions={categorySetSelectedOptions}
                />
                <MultiselectDropdown
                    options={stockOptions}
                    label={stockLabel}
                    selectedOptions={stockSelectedOptions}
                    setSelectedOptions={stockSetSelectedOptions}
                />
                <Button label="Search" onClick={handleSearch} />
            </div>
        </div>
    );
}

export default SearchBar;