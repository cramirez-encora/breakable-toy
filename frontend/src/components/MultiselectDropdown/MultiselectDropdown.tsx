import {Dispatch, SetStateAction, useState} from "react";
import "../MultiselectDropdown.css";
import dropdownIcon from "../assets/icons/dropdown-arrow.png"; // Local image


interface MultiselectDropdownProps {
    options: readonly string[];
    label: string;
    selectedOptions: string[];
    setSelectedOptions:Dispatch<SetStateAction<string[]>>;
}

function MultiselectDropdown({ options, label, selectedOptions, setSelectedOptions }: MultiselectDropdownProps) {
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
            <label className={"label-input"}>{label}</label>
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