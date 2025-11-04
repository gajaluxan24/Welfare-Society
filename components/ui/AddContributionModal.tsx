import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Member } from '../../types';

interface AddContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { memberId: string; amount: number; date: string }) => void;
  members: Member[];
}

const AddContributionModal: React.FC<AddContributionModalProps> = ({ isOpen, onClose, onSubmit, members }) => {
    const [memberId, setMemberId] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setMemberId(members.length > 0 ? members[0].id : '');
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setError('');
        }
    }, [isOpen, members]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const contributionAmount = parseFloat(amount);
        if (!memberId || !amount || isNaN(contributionAmount) || contributionAmount <= 0) {
            setError('Please select a member and enter a valid positive amount.');
            return;
        }

        onSubmit({ memberId, amount: contributionAmount, date });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Contribution">
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
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contribution Amount ($)</label>
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
                            placeholder="e.g., 100.00"
                        />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contribution Date</label>
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
                        Add Contribution
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddContributionModal;