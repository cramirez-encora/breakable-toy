import React, { useEffect, useState } from "react";
import "./Modal.css";
import Dropdown from "../Dropdown/Dropdown.tsx";
import TextInput from "../TextInput/TextInput.tsx";
import NumberInput from "../NumberInput/NumberInput.tsx";
import { nameLabel, categoryLabel, stockLabel, unitPriceLabel, expDateLabel } from "../../constants/ModalConsts.ts";

interface Product {
    id?: number;
    name: string;
    category: string;
    quantityStock: number;
    unitPrice: number;
    expDate: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    refreshProducts: () => void;
    product?: Product;
}

function Modal({ isOpen, onClose, refreshProducts, product }: ModalProps) {
    if (!isOpen) return null;

    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
    const [categorySelectedOption, setCategorySelectedOption] = useState(product?.category || "");
    const [name, setName] = useState(product?.name || "");
    const [stock, setStock] = useState<number | "">(product?.quantityStock || "");
    const [unitPrice, setUnitPrice] = useState<number | "">(product?.unitPrice || "");
    const [expDate, setExpDate] = useState<string>(product?.expDate || "");

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
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !categorySelectedOption || stock === "" || unitPrice === "" || !expDate) {
            alert("All fields are required.");
            return;
        }

        const newProduct = {
            name,
            category: categorySelectedOption,
            quantityStock: Number(stock),
            unitPrice: Number(unitPrice),
            expDate: expDate
        };

        try {
            let response;
            if (product) {
                response = await fetch(`http://localhost:9090/products/${product.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newProduct),
                });
            } else {
                // Add new product
                response = await fetch("http://localhost:9090/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newProduct),
                });
            }

            if (response.ok) {
                alert(`Product ${product ? "updated" : "added"} successfully!`);
                refreshProducts();
                setTimeout(() => {
                    onClose();
                }, 100);
            } else {
                alert("Failed to save product.");
            }
        } catch (error) {
            alert("Error: Unable to connect to server.");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="modal-close-button">✖</button>
                <h2 className="modal-title">{product ? "Edit Product" : "Register New Product"}</h2>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <TextInput label={nameLabel} search={name} placeholder="Write the product name..." onSearch={setName} />
                    <Dropdown options={categoryOptions} label={categoryLabel} selectedOption={categorySelectedOption} setSelectedOption={setCategorySelectedOption} allowNewCategory={true} />
                    <NumberInput label={stockLabel} search={stock} placeholder="Integers only" onSearch={setStock} />
                    <NumberInput label={unitPriceLabel} search={unitPrice} placeholder="Enter price" onSearch={setUnitPrice} />

                    <label className="modal-label">{expDateLabel}</label>
                    <input type="date" value={expDate} onChange={(e) => setExpDate(e.target.value)} className="modal-input" />

                    <button type="submit" className="modal-submit-button">{product ? "Update" : "Register"}</button>
                </form>
            </div>
        </div>
    );
}

export default Modal;