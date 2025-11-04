import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Loan } from '../../types';

interface RepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { loanId: string; amount: number; date: string }) => void;
  loan: Loan | null;
}

const RepaymentModal: React.FC<RepaymentModalProps> = ({ isOpen, onClose, onSubmit, loan }) => {
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');

    const remainingBalance = loan ? loan.repaymentAmount - loan.repaymentsMade : 0;
    
    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setError('');
        }
    }, [isOpen, loan]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const repaymentAmount = parseFloat(amount);

        if (!loan || isNaN(repaymentAmount) || repaymentAmount <= 0) {
            setError('Please enter a valid positive amount.');
            return;
        }
        if (repaymentAmount > remainingBalance) {
            setError(`Amount cannot exceed the remaining balance of $${remainingBalance.toFixed(2)}.`);
            return;
        }

        onSubmit({ loanId: loan.id, amount: repaymentAmount, date });
        onClose();
    };

    if (!loan) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Record Repayment for ${loan.id}`}>
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4 text-gray-700 dark:text-gray-300">
                    <p>Member: <span className="font-bold">{loan.memberId}</span></p>
                    <p>Remaining Balance: <span className="font-bold text-lg">${remainingBalance.toFixed(2)}</span></p>
                </div>
                {error && <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"><p>{error}</p></div>}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Repayment Amount</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            required
                            step="0.01"
                            min="0.01"
                            max={remainingBalance.toFixed(2)}
                            aria-required="true"
                            aria-describedby="error"
                        />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Repayment Date</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600"
                            required
                            aria-required="true"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                        Cancel
                    </button>
                    <button type="submit" className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-indigo-800">
                        Record Repayment
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default RepaymentModal;
