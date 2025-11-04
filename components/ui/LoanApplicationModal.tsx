import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Member } from '../../types';

interface LoanApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { memberId: string; amount: number; reason: string; repaymentSchedule?: string; }) => void;
  members: Member[];
}

const LoanApplicationModal: React.FC<LoanApplicationModalProps> = ({ isOpen, onClose, onSubmit, members }) => {
    const [memberId, setMemberId] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [repaymentSchedule, setRepaymentSchedule] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setMemberId(members.length > 0 ? members[0].id : '');
            setAmount('');
            setReason('');
            setRepaymentSchedule('');
            setError('');
        }
    }, [isOpen, members]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const loanAmount = parseFloat(amount);
        if (!memberId || !amount || isNaN(loanAmount) || loanAmount <= 0 || !reason) {
            setError('Please fill out all required fields with valid values.');
            return;
        }

        onSubmit({ memberId, amount: loanAmount, reason, repaymentSchedule });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Apply for a New Loan">
            <form onSubmit={handleSubmit} noValidate>
                {error && <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"><p>{error}</p></div>}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Member</label>
                        <select
                            id="memberId"
                            value={memberId}
                            onChange={(e) => setMemberId(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600"
                            required
                            aria-required="true"
                        >
                            <option value="" disabled>Select a member</option>
                            {members.map(member => (
                                <option key={member.id} value={member.id}>{member.name} ({member.employeeId})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Loan Amount ($)</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            required
                            step="0.01"
                            min="0.01"
                            aria-required="true"
                            placeholder="e.g., 500.00"
                        />
                    </div>
                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason for Loan</label>
                        <textarea
                            id="reason"
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            required
                            aria-required="true"
                            placeholder="e.g., Medical emergency, home repair, etc."
                        />
                    </div>
                    <div>
                        <label htmlFor="repaymentSchedule" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Desired Repayment Schedule</label>
                        <input
                            type="text"
                            id="repaymentSchedule"
                            value={repaymentSchedule}
                            onChange={(e) => setRepaymentSchedule(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            placeholder="e.g., 12 monthly installments"
                        />
                         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            The standard repayment amount is the loan amount + 10% interest.
                        </p>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                        Cancel
                    </button>
                    <button type="submit" className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-indigo-800">
                        Submit Application
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default LoanApplicationModal;