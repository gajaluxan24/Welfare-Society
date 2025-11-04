import React, { useState } from 'react';
import { useWelfareData } from '../context/WelfareDataContext';
import AddProgrammeModal from './ui/AddProgrammeModal';

const Programmes: React.FC = () => {
    const { state, dispatch } = useWelfareData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddProgramme = (data: { name: string; budget: number; startDate: string; endDate: string }) => {
        dispatch({ type: 'ADD_PROGRAMME', payload: data });
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Programmes</h1>
                 <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    aria-haspopup="dialog"
                >
                    Add New Programme
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Society Programmes</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Programme Name</th>
                                <th scope="col" className="px-6 py-3">Start Date</th>
                                <th scope="col" className="px-6 py-3">End Date</th>
                                <th scope="col" className="px-6 py-3">Budget</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.programmes.map(p => (
                                <tr key={p.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{p.name}</td>
                                    <td className="px-6 py-4">{new Date(p.startDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{new Date(p.endDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">${p.budget.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddProgrammeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddProgramme}
            />
        </div>
    );
};

export default Programmes;