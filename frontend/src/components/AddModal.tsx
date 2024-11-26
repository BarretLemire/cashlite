import React, { useState } from 'react';
import './Modal.css';

interface AddItemModalProps {
    type: 'income' | 'expense';
    onSubmit: (amount: number, category: string) => void;
    onClose: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ type, onSubmit, onClose }) => {
    const [amount, setAmount] = useState<number>(0);
    const [category, setCategory] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount <= 0 || !category.trim()) {
            alert('Please provide valid amount and category.');
            return;
        }
        onSubmit(amount, category);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add {type === 'income' ? 'Income' : 'Expense'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        required
                        min="0"
                    />
                    <label>Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                    <button type="submit">Add {type}</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;
