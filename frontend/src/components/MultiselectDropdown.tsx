import { useState } from "react";
import "../MultiselectDropdown.css";
import dropdownIcon from "../assets/icons/dropdown-arrow.png"; // Local image

interface MultiselectDropdownProps {
    options: string[];
    label: string;
}

function MultiselectDropdown({ options, label }: MultiselectDropdownProps) {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false); // Toggle dropdown visibility

    const handleSelect = (option: string) => {
        setSelectedOptions((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option) // Remove if already selected
                : [...prev, option] // Add new selection
        );
    };

    return (
        <div className="dropdown-container">

            <div className="dropdown-input-container">
            <label>{label}</label>
                {/* Disabled input to show selected options */}
                <input
                    type="text"
                    value={selectedOptions.join(", ")}
                    placeholder="Select options..."
                    disabled
                    className="dropdown-input"
                />

                {/* Button to toggle dropdown */}
                <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
                    <img src={dropdownIcon} alt="Open Dropdown" className="dropdown-icon" />
                </button>
            </div>

            {/* Dropdown list */}
            {isOpen && (
                <div className="dropdown-menu">
                    {options.map((option) => (
                        <label key={option} className="dropdown-item">
                            <input
                                type="checkbox"
                                checked={selectedOptions.includes(option)}
                                onChange={() => handleSelect(option)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MultiselectDropdown;