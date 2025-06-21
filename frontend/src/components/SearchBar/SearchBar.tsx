import { useEffect, useState } from "react";
import MultiselectDropdown from "../MultiselectDropdown/MultiselectDropdown";
import TextInput from "../TextInput/TextInput";
import Button from "../Button/Button";
import { stockOptions, stockLabel, nameLabel, categoryLabel } from "../../constants/SearchBarConsts";
import { useSearchStore } from "../../store/useSearchStore";
import { useProductStore } from "../../store/useProductStore";

function SearchBar() {
    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
    const [categorySelectedOptions, categorySetSelectedOptions] = useState<string[]>([]);
    const [stockSelectedOptions, stockSetSelectedOptions] = useState<string[]>([]);
    const [search, setSearch] = useState("");

    const refreshToken = useProductStore((s) => s.refreshToken);
    const setFilters = useSearchStore((state) => state.setFilters);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:9090/categories");
                const data = await response.json();
                setCategoryOptions(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, [refreshToken]);

    const handleSearch = () => {
        setFilters({
            searchTerm: search,
            categories: categorySelectedOptions,
            stock: stockSelectedOptions
        });
    };

    return (
        <div className="container">
            <h2>Search Bar</h2>
            <div className="container-searchControls">
                <TextInput label={nameLabel} search={search} placeholder={"Write the product name..."} onSearch={setSearch} />
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
