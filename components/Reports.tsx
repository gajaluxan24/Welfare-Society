
import React, { useMemo, useState } from 'react';
import { useWelfareData } from '../context/WelfareDataContext';
import { TransactionType } from '../types';

const Reports: React.FC = () => {
    const { state } = useWelfareData();
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    const monthlyReport = useMemo(() => {
        const filtered = state.transactions.filter(t => t.date.startsWith(selectedMonth));
        const income = filtered.filter(t => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
        const expense = filtered.filter(t => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);
        return {
            transactions: filtered,
            income,
            expense,
            net: income - expense
        };
    }, [state.transactions, selectedMonth]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Reports</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Monthly Summary</h2>
                <div className="mb-4">
                    <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Month:</label>
                    <input
                        type="month"
                        id="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="mt-1 block w-full md:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                    <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-300">Total Income</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-200">${monthlyReport.income.toFixed(2)}</p>
                    </div>
                     <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-300">Total Expense</p>
                        <p className="text-2xl font-bold text-red-900 dark:text-red-200">${monthlyReport.expense.toFixed(2)}</p>
                    </div>
                     <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-300">Net Flow</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">${monthlyReport.net.toFixed(2)}</p>
                    </div>
                </div>

                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Transactions for {new Date(selectedMonth + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyReport.transactions.map(t => (
                                <tr key={t.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{t.description}</td>
                                    <td className={`px-6 py-4 font-semibold ${t.type === TransactionType.Income ? 'text-green-600' : 'text-red-600'}`}>{t.type}</td>
                                    <td className="px-6 py-4">${t.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
