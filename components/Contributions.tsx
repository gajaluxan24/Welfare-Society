import React, { useState } from 'react';
import { useWelfareData } from '../context/WelfareDataContext';
import AddContributionModal from './ui/AddContributionModal';

const Contributions: React.FC = () => {
    const { state, dispatch } = useWelfareData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddContribution = (data: { memberId: string; amount: number; date: string }) => {
        dispatch({ type: 'ADD_CONTRIBUTION', payload: data });
    };

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contributions</h1>
                 <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    aria-haspopup="dialog"
                >
                    Add Contribution
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Contributions</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Member Name</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...state.contributions]
                                .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map(c => {
                                const member = state.members.find(m => m.id === c.memberId);
                                return (
                                    <tr key={c.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{member?.name}</td>
                                        <td className="px-6 py-4">{new Date(c.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">${c.amount.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddContributionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddContribution}
                members={state.members}
            />
        </div>
    );
};

export default Contributions;