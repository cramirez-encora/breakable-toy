import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "../MultiselectDropdown/MultiselectDropdown.css";
import dropdownIcon from "../../assets/icons/dropdown-arrow.png"; // Local image

interface DropdownProps {
    options: string[];
    label: string;
    selectedOption: string | null;
    setSelectedOption: Dispatch<SetStateAction<string>>;
    allowNewCategory?: boolean;
}

function Dropdown({ options, label, selectedOption, setSelectedOption, allowNewCategory = false }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState("");

    console.log("Received label dropdown:", label, "with options:", options);

    useEffect(() => {
        setCategories(options);
    }, [options]);

    const handleSelect = (option: string) => {
        setSelectedOption(option); // Only one selection allowed
        setIsOpen(false); // Close dropdown on selection
    };

    const handleAddCategory = async () => {
        if (newCategory.trim() && !categories.includes(newCategory)) {
            try {
                const response = await fetch("http://localhost:9090/categories", {
                    method: "POST",
                    headers: { "Content-Type": "text/plain" },
                    body: newCategory,
                });

                if (!response.ok) {
                    throw new Error("Failed to add category");
                }

                const updatedCategories = await fetch("http://localhost:9090/categories").then(res => res.json());

                setCategories(updatedCategories);
                setSelectedOption(newCategory);
                setNewCategory("");
                setIsOpen(false);
            } catch (error) {
                console.error("Error adding category:", error);
            }
        }
    };

    return (
        <div className="dropdown-container form-input-container">
            <div className="dropdown-input-container">
                <label className="label-input">{label}</label>
                <input
                    type="text"
                    value={selectedOption || ""}
                    placeholder="Select an option..."
                    disabled
                    className="dropdown-input"
                />
                <button type={"button"} className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
                    <img src={dropdownIcon} alt="Open Dropdown" className="dropdown-icon" />
                </button>
            </div>

            {isOpen && (
                <div className="dropdown-menu">
                    {categories.length > 0 ? (
                        categories.map(option => (
                            <label
                                key={option}
                                className={`dropdown-item ${selectedOption === option ? "selected" : ""}`}
                                onClick={() => handleSelect(option)}
                            >
                                {option}
                            </label>
                        ))
                    ) : (
                        <p className="dropdown-empty">No options available</p>
                    )}

                    {/* Allow new category input if enabled */}
                    {allowNewCategory && (
                        <div className="dropdown-new-category">
                            <input
                                type="text"
                                placeholder="New category..."
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                            <button type={"button"} onClick={handleAddCategory}>Add</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Dropdown;