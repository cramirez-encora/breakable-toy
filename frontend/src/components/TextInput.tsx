import '../TextInput.css'

interface TextInputProps{
    label: string;
    search: string;
    onSearch: (value: string) => void;
}

function TextInput({ label, search, onSearch }: TextInputProps) {
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
                placeholder="Write the product name..."
                value={search}
                onChange={handleInputChange}
            />
        </>
    );
}

export default TextInput;