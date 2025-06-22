import "./Button.css"

interface ButtonProps {
    label: string;
    onClick: () => void;
    type?: "button" | "submit" | "reset";
}

function Button({ label, onClick, type = "submit" }: ButtonProps) {
    return (
        <button className={"button"} onClick={onClick} type={type}>
            {label}
        </button>
    );
}

export default Button;