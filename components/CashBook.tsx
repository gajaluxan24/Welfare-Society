import React, { useState } from 'react';
import { useWelfareData } from '../context/WelfareDataContext';
import { TransactionType, TransactionMethod, Transaction } from '../types';
import Modal from './ui/Modal';

const AddTransactionForm: React.FC<{ onAdd: (transaction: Omit<Transaction, 'id'>) => void, onClose: () => void }> = ({ onAdd, onClose }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [type, setType] = useState<TransactionType>(TransactionType.Income);
    const [method, setMethod] = useState<TransactionMethod>(TransactionMethod.Bank);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (!date || !description || !amount || !category || isNaN(numAmount) || numAmount <= 0) {
            setError('All fields are required and amount must be a positive number.');
            return;
        }
        onAdd({
            date,
            description,
            type,
            method,
            amount: numAmount,
            category
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" required />
                </div>
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" required />
                </div>
                 <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                    <select id="type" value={type} onChange={(e) => setType(e.target.value as TransactionType)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600">
                        <option value={TransactionType.Income}>Income</option>
                        <option value={TransactionType.Expense}>Expense</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="method" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Method</label>
                    <select id="method" value={method} onChange={(e) => setMethod(e.target.value as TransactionMethod)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600">
                        <option value={TransactionMethod.Bank}>Bank</option>
                        <option value={TransactionMethod.Cash}>Cash</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                    <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" required step="0.01" min="0.01" />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600" required />
                </div>
            </div>
             <div className="mt-6 flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                    Cancel
                </button>
                <button type="submit" className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-indigo-800">
                    Add Transaction
                </button>
            </div>
        </form>
    );
};


const CashBook: React.FC = () => {
    const { state, dispatch } = useWelfareData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddTransaction = (transactionData: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            id: `trn-${Date.now()}`,
            ...transactionData,
        };
        dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cash Book</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    aria-haspopup="dialog"
                >
                    Add New Transaction
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">All Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Method</th>
                                <th scope="col" className="px-6 py-3">Income</th>
                                <th scope="col" className="px-6 py-3">Expense</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.transactions
                                .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map(t => (
                                <tr key={t.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{t.description}</td>
                                    <td className="px-6 py-4">{t.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${t.method === TransactionMethod.Bank ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
                                            {t.method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-green-600">
                                        {t.type === TransactionType.Income ? `$${t.amount.toFixed(2)}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-red-600">
                                        {t.type === TransactionType.Expense ? `$${t.amount.toFixed(2)}` : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Transaction">
                <AddTransactionForm onAdd={handleAddTransaction} onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default CashBook;