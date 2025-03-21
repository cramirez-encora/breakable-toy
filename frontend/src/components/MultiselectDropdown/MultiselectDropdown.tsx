import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./MultiselectDropdown.css";
import dropdownIcon from "../../assets/icons/dropdown-arrow.png"; // Local image

interface MultiselectDropdownProps {
    options: string[];
    label: string;
    selectedOptions: string[];
    setSelectedOptions: Dispatch<SetStateAction<string[]>>;
}

function MultiselectDropdown({ options, label, selectedOptions, setSelectedOptions}: MultiselectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        setCategories(options);
    }, [options]);

    const handleSelect = (option: string) => {
        setSelectedOptions(prev =>
            prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
        );
    };


    return (
        <div className="dropdown-container " >
            <div className="dropdown-input-container form-input-container">
                <label className="label-input">{label}</label>
                <input
                    type="text"
                    value={selectedOptions.join(", ")}
                    placeholder="Select options..."
                    disabled
                    className="dropdown-input"
                />
                <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
                    <img src={dropdownIcon} alt="Open Dropdown" className="dropdown-icon" />
                </button>
            </div>

            {isOpen && (
                <div className="dropdown-menu">
                    {categories.length > 0 ? (
                        categories.map(option => (
                            <label key={option} className="dropdown-item">
                                <input
                                    type="checkbox"
                                    checked={selectedOptions.includes(option)}
                                    onChange={() => handleSelect(option)}
                                />
                                {option}
                            </label>
                        ))
                    ) : (
                        <p className="dropdown-empty">No options available</p>
                    )}

                </div>
            )}
        </div>
    );
}

export default MultiselectDropdown;