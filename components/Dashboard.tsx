
import React, { useMemo, useState } from 'react';
import { useWelfareData } from '../context/WelfareDataContext';
import { LoanStatus, TransactionType } from '../types';
import Card from './ui/Card';
import Modal from './ui/Modal';
import { getFinancialInsights } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CashIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-white" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V6.375m18 0h-3.375a1.125 1.125 0 0 1-1.125-1.125V3.375M9 11.25l1.5 1.5L15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);
const LoanIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-white" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
    </svg>
);

const Dashboard: React.FC = () => {
  const { state } = useWelfareData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insights, setInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const summary = useMemo(() => {
    const totalIncome = state.transactions.filter(t => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = state.transactions.filter(t => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);
    const totalContributions = state.transactions.filter(t => t.category === 'Contribution').reduce((sum, t) => sum + t.amount, 0);
    const outstandingLoans = state.loans.filter(l => l.status === LoanStatus.Approved).reduce((sum, l) => sum + l.amount, 0);
    
    return {
      balance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      totalContributions,
      outstandingLoans,
      pendingLoans: state.loans.filter(l => l.status === LoanStatus.Pending).length,
    };
  }, [state]);
  
  const handleGetInsights = async () => {
    setIsModalOpen(true);
    setIsLoading(true);
    const summaryText = `
      - Total Balance: $${summary.balance.toFixed(2)}
      - Total Income: $${summary.totalIncome.toFixed(2)}
      - Total Expense: $${summary.totalExpense.toFixed(2)}
      - Total Contributions this period: $${summary.totalContributions.toFixed(2)}
      - Total Outstanding Loans: $${summary.outstandingLoans.toFixed(2)}
      - Number of pending loan applications: ${summary.pendingLoans}
    `;
    const result = await getFinancialInsights(summaryText);
    setInsights(result);
    setIsLoading(false);
  };
  
    const chartData = useMemo(() => {
        const months: { [key: string]: { income: number, expense: number } } = {};
        state.transactions.forEach(t => {
            const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!months[month]) {
                months[month] = { income: 0, expense: 0 };
            }
            if (t.type === TransactionType.Income) {
                months[month].income += t.amount;
            } else {
                months[month].expense += t.amount;
            }
        });

        return Object.entries(months)
            .map(([name, values]) => ({ name, ...values }))
            .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    }, [state.transactions]);


  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Net Balance" value={`$${summary.balance.toFixed(2)}`} icon={<CashIcon />} color="bg-green-500" />
        <Card title="Outstanding Loans" value={`$${summary.outstandingLoans.toFixed(2)}`} icon={<LoanIcon />} color="bg-red-500" />
        <Card title="Pending Loans" value={summary.pendingLoans.toString()} icon={<LoanIcon />} color="bg-yellow-500" />
        <Card title="Total Contributions" value={`$${summary.totalContributions.toFixed(2)}`} icon={<CashIcon />} color="bg-blue-500" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Monthly Overview</h2>
        <div style={{ width: '100%', height: 400 }}>
             <ResponsiveContainer>
                <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700"/>
                <XAxis dataKey="name" className="text-xs fill-gray-600 dark:fill-gray-400"/>
                <YAxis className="text-xs fill-gray-600 dark:fill-gray-400"/>
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                        borderColor: '#4B5563',
                        color: '#F9FAFB'
                    }} 
                />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="Income" />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Financial Advisor</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-4">Get AI-powered insights on your society's financial health based on the current data.</p>
        <button 
          onClick={handleGetInsights}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-indigo-400"
        >
          {isLoading ? 'Generating...' : 'Get Insights'}
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="AI Financial Advisor Insights">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />') }} />
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
