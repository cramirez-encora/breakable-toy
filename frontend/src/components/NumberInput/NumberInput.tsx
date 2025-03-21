import '../TextInput/TextInput.css';

interface NumberInputProps {
    label: string;
    search: number | "";
    placeholder: string;
    onSearch: (value: number) => void;
}

function NumberInput({ label, search, placeholder, onSearch }: NumberInputProps) {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value === "" ? "" : Number(event.target.value);
        if (value === "" || !isNaN(value)) {
            onSearch(value as number);
        }
    };

    return (
        <div className={"form-input-container"}>
            <label className="label-input">
                {label}
            </label>
            <input
                className="text-input"
                type="number"
                placeholder={placeholder}
                value={search}
                onChange={handleInputChange}
            />
        </div>
    );
}

export default NumberInput;