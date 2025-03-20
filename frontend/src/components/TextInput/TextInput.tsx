import './TextInput.css'

interface TextInputProps{
    label: string;
    search: string;
    placeholder: string;
    onSearch: (value: string) => void;
}

function TextInput({ label, search, placeholder, onSearch }: TextInputProps) {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value);
    };
    return (
        <>
            <label className={"label-input"}>
                {label}
            </label>
            <input className={"text-input"}
                type="text"
                placeholder={placeholder}
                value={search}
                onChange={handleInputChange}
            />
        </>
    );
}

export default TextInput;