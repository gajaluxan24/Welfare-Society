import React, { useState } from 'react';
import { useWelfareData } from '../context/WelfareDataContext';
import { LoanStatus, Loan } from '../types';
import ConfirmationModal from './ui/ConfirmationModal';
import RepaymentModal from './ui/RepaymentModal';
import LoanApplicationModal from './ui/LoanApplicationModal';

const statusColorMap: { [key in LoanStatus]: string } = {
    [LoanStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [LoanStatus.Approved]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [LoanStatus.Rejected]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    [LoanStatus.Paid]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

const Loans: React.FC = () => {
    const { state, dispatch } = useWelfareData();
    const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
    const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<LoanStatus | 'All'>('All');


    const [confirmation, setConfirmation] = useState<{
        isOpen: boolean;
        loanId: string | null;
        status: LoanStatus.Approved | LoanStatus.Rejected | null;
        message: string;
        title: string;
    }>({
        isOpen: false,
        loanId: null,
        status: null,
        message: '',
        title: '',
    });

    const handleToggleExpand = (loanId: string) => {
        setExpandedLoanId(currentId => (currentId === loanId ? null : loanId));
    };

    const handleActionClick = (loanId: string, status: LoanStatus.Approved | LoanStatus.Rejected) => {
        const loan = state.loans.find(l => l.id === loanId);
        const member = state.members.find(m => m.id === loan?.memberId);
        const actionText = status === LoanStatus.Approved ? 'approve' : 'reject';
        const titleText = status === LoanStatus.Approved ? 'Approval' : 'Rejection';

        setConfirmation({
            isOpen: true,
            loanId,
            status,
            title: `Confirm Loan ${titleText}`,
            message: `Are you sure you want to ${actionText} the loan application for ${member?.name || 'this member'}?`,
        });
    };

    const handleConfirm = () => {
        if (confirmation.loanId && confirmation.status) {
            dispatch({
                type: 'UPDATE_LOAN_STATUS',
                payload: { loanId: confirmation.loanId, status: confirmation.status },
            });
        }
        handleClose();
    };

    const handleClose = () => {
        setConfirmation({ isOpen: false, loanId: null, status: null, message: '', title: '' });
    };
    
    const handleOpenRepaymentModal = (loan: Loan) => {
        setSelectedLoan(loan);
        setIsRepaymentModalOpen(true);
    };

    const handleAddRepayment = (data: { loanId: string; amount: number; date: string }) => {
        dispatch({ type: 'ADD_REPAYMENT', payload: data });
    };

    const handleAddLoan = (data: { memberId: string; amount: number; reason: string; repaymentSchedule?: string; }) => {
        const INTEREST_RATE = 0.10; // 10% interest rate
        const repaymentAmount = data.amount * (1 + INTEREST_RATE);

        const newLoan: Loan = {
            id: `loan-${Date.now()}`,
            memberId: data.memberId,
            applicationDate: new Date().toISOString().split('T')[0],
            amount: data.amount,
            reason: data.reason,
            status: LoanStatus.Pending,
            repaymentAmount: repaymentAmount,
            repaymentsMade: 0,
            repaymentSchedule: data.repaymentSchedule,
        };
        dispatch({ type: 'ADD_LOAN', payload: newLoan });
    };

    const filteredLoans = state.loans.filter(loan => {
        if (statusFilter === 'All') {
            return true;
        }
        return loan.status === statusFilter;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loan Management</h1>
                <button
                    onClick={() => setIsApplicationModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    aria-haspopup="dialog"
                >
                    Apply for Loan
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">Loan Applications</h2>
                     <div>
                        <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Filter by status:</label>
                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as LoanStatus | 'All')}
                            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="All">All</option>
                            <option value={LoanStatus.Pending}>Pending</option>
                            <option value={LoanStatus.Approved}>Approved</option>
                            <option value={LoanStatus.Rejected}>Rejected</option>
                            <option value={LoanStatus.Paid}>Paid</option>
                        </select>
                    </div>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-1 py-3 w-8"></th>
                                <th scope="col" className="px-6 py-3">Member</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Loan Amount</th>
                                <th scope="col" className="px-6 py-3">Repayment Progress</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLoans.map(loan => {
                                const member = state.members.find(m => m.id === loan.memberId);
                                const remainingBalance = loan.repaymentAmount - loan.repaymentsMade;
                                const loanRepayments = state.repayments.filter(r => r.loanId === loan.id);
                                const isExpanded = expandedLoanId === loan.id;

                                return (
                                    <React.Fragment key={loan.id}>
                                        <tr 
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                                            onClick={() => handleToggleExpand(loan.id)}
                                            aria-expanded={isExpanded}
                                        >
                                            <td className="px-1 py-4">
                                                <svg 
                                                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{member?.name}</td>
                                            <td className="px-6 py-4">{new Date(loan.applicationDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">${loan.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span>${loan.repaymentsMade.toFixed(2)} / ${loan.repaymentAmount.toFixed(2)}</span>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
                                                        <div 
                                                            className="bg-green-600 h-2.5 rounded-full" 
                                                            style={{ width: `${(loan.repaymentsMade / loan.repaymentAmount) * 100}%` }}>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 mt-1">
                                                        Remaining: ${remainingBalance.toFixed(2)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[loan.status]}`}>
                                                    {loan.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                {loan.status === LoanStatus.Pending && (
                                                    <div className="flex space-x-2">
                                                        <button onClick={() => handleActionClick(loan.id, LoanStatus.Approved)} className="text-green-600 hover:text-green-900 font-medium">Approve</button>
                                                        <button onClick={() => handleActionClick(loan.id, LoanStatus.Rejected)} className="text-red-600 hover:text-red-900 font-medium">Reject</button>
                                                    </div>
                                                )}
                                                {loan.status === LoanStatus.Approved && (
                                                    <button onClick={() => handleOpenRepaymentModal(loan)} className="text-indigo-600 hover:text-indigo-900 font-medium">Record Repayment</button>
                                                )}
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="bg-gray-50 dark:bg-gray-900">
                                                <td colSpan={7} className="p-4">
                                                    <div className="p-4 bg-white dark:bg-gray-800 rounded-md">
                                                        <h4 className="font-semibold text-md mb-2 text-gray-800 dark:text-gray-200">Repayment History</h4>
                                                        {loanRepayments.length > 0 ? (
                                                            <table className="w-full text-sm text-left">
                                                                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                                                    <tr>
                                                                        <th className="px-4 py-2">Date</th>
                                                                        <th className="px-4 py-2">Amount Paid</th>
                                                                        <th className="px-4 py-2">Transaction ID</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {loanRepayments.map(repayment => (
                                                                        <tr key={repayment.id} className="border-b dark:border-gray-700">
                                                                            <td className="px-4 py-2">{new Date(repayment.date).toLocaleDateString()}</td>
                                                                            <td className="px-4 py-2">${repayment.amount.toFixed(2)}</td>
                                                                            <td className="px-4 py-2">{repayment.transactionId}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        ) : (
                                                            <p className="text-gray-500 dark:text-gray-400">No repayments have been made for this loan.</p>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <ConfirmationModal
                isOpen={confirmation.isOpen}
                onClose={handleClose}
                onConfirm={handleConfirm}
                title={confirmation.title}
                message={confirmation.message}
                confirmButtonText={confirmation.status === LoanStatus.Approved ? 'Approve' : 'Reject'}
                confirmButtonClass={
                    confirmation.status === LoanStatus.Approved
                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-300 dark:focus:ring-green-800'
                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-300 dark:focus:ring-red-800'
                }
            />
             <RepaymentModal
                isOpen={isRepaymentModalOpen}
                onClose={() => setIsRepaymentModalOpen(false)}
                onSubmit={handleAddRepayment}
                loan={selectedLoan}
            />
            <LoanApplicationModal
                isOpen={isApplicationModalOpen}
                onClose={() => setIsApplicationModalOpen(false)}
                onSubmit={handleAddLoan}
                members={state.members}
            />
        </div>
    );
};

export default Loans;