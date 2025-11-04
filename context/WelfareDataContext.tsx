import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Member, Transaction, Loan, Programme, Contribution, LoanStatus, TransactionType, TransactionMethod, Repayment } from '../types';

interface AppState {
  members: Member[];
  transactions: Transaction[];
  loans: Loan[];
  programmes: Programme[];
  contributions: Contribution[];
  repayments: Repayment[];
}

// MOCK DATA
const mockMembers: Member[] = [
  { id: 'mem-1', name: 'Alice Johnson', employeeId: 'EMP101', joiningDate: '2022-01-15', designation: 'Software Engineer', nic: '12345-6789012-3', dob: '1990-05-20', address: '123 Main St, Anytown', contactNo: '555-0101', remark: 'Team lead for Project X' },
  { id: 'mem-2', name: 'Bob Williams', employeeId: 'EMP102', joiningDate: '2022-02-20', designation: 'Project Manager', nic: '23456-7890123-4', dob: '1985-11-15', address: '456 Oak Ave, Anytown', contactNo: '555-0102' },
  { id: 'mem-3', name: 'Charlie Brown', employeeId: 'EMP103', joiningDate: '2022-03-10', designation: 'QA Analyst', nic: '34567-8901234-5', dob: '1992-08-30', address: '789 Pine Ln, Anytown', contactNo: '555-0103', remark: 'Joined recently' },
];

const mockTransactions: Transaction[] = [
  { id: 'trn-1', date: '2024-07-01', description: 'Contribution from Alice Johnson', type: TransactionType.Income, method: TransactionMethod.Bank, amount: 100, category: 'Contribution' },
  { id: 'trn-2', date: '2024-07-01', description: 'Contribution from Bob Williams', type: TransactionType.Income, method: TransactionMethod.Bank, amount: 100, category: 'Contribution' },
  { id: 'trn-3', date: '2024-07-05', description: 'Office Supplies', type: TransactionType.Expense, method: TransactionMethod.Cash, amount: 50, category: 'Admin' },
  { id: 'trn-4', date: '2024-07-10', description: 'Loan Disbursed to Charlie Brown', type: TransactionType.Expense, method: TransactionMethod.Bank, amount: 1000, category: 'Loan Disbursement' },
  { id: 'trn-5', date: '2024-07-20', description: 'Loan Repayment from Charlie Brown', type: TransactionType.Income, method: TransactionMethod.Bank, amount: 100, category: 'Loan Repayment' },
  { id: 'trn-6', date: '2024-08-01', description: 'Expense for programme: Annual Picnic', type: TransactionType.Expense, method: TransactionMethod.Bank, amount: 500, category: 'Programme Expense' },
];

const mockLoans: Loan[] = [
  { id: 'loan-1', memberId: 'mem-3', applicationDate: '2024-07-08', amount: 1000, reason: 'Medical Emergency', status: LoanStatus.Approved, repaymentAmount: 1100, repaymentsMade: 100, repaymentSchedule: '11 monthly installments of $100' },
  { id: 'loan-2', memberId: 'mem-1', applicationDate: '2024-07-15', amount: 500, reason: 'Education Fees', status: LoanStatus.Pending, repaymentAmount: 550, repaymentsMade: 0, repaymentSchedule: '5 monthly installments' },
];

const mockProgrammes: Programme[] = [
    { id: 'prog-1', name: 'Annual Picnic', budget: 500, startDate: '2024-08-01', endDate: '2024-08-01' },
];

const mockContributions: Contribution[] = [
    {id: 'con-1', memberId: 'mem-1', date: '2024-07-01', amount: 100, transactionId: 'trn-1'},
    {id: 'con-2', memberId: 'mem-2', date: '2024-07-01', amount: 100, transactionId: 'trn-2'},
];

const mockRepayments: Repayment[] = [
    { id: 'rep-1', loanId: 'loan-1', date: '2024-07-20', amount: 100, transactionId: 'trn-5' }
];


const initialState: AppState = {
  members: mockMembers,
  transactions: mockTransactions,
  loans: mockLoans,
  programmes: mockProgrammes,
  contributions: mockContributions,
  repayments: mockRepayments,
};

type Action =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_LOAN'; payload: Loan }
  | { type: 'UPDATE_LOAN_STATUS'; payload: { loanId: string; status: LoanStatus } }
  | { type: 'ADD_MEMBER'; payload: Member }
  | { type: 'ADD_REPAYMENT'; payload: { loanId: string; amount: number; date: string } }
  | { type: 'ADD_CONTRIBUTION'; payload: { memberId: string; amount: number; date: string } }
  | { type: 'ADD_PROGRAMME'; payload: { name: string; budget: number; startDate: string; endDate: string } };

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_MEMBER':
      return { ...state, members: [...state.members, action.payload] };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'ADD_LOAN':
        return { ...state, loans: [...state.loans, action.payload] };
    case 'UPDATE_LOAN_STATUS': {
      const { loanId, status } = action.payload;
      const loan = state.loans.find(l => l.id === loanId);
      if (!loan || status !== LoanStatus.Approved) {
         return {
            ...state,
            loans: state.loans.map(l => l.id === loanId ? { ...l, status } : l)
         };
      }
      // If loan is approved, create a transaction for disbursement
      const member = state.members.find(m => m.id === loan.memberId);
      const newTransaction: Transaction = {
        id: `trn-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: `Loan Disbursed to ${member?.name || 'member'}`,
        type: TransactionType.Expense,
        method: TransactionMethod.Bank,
        amount: loan.amount,
        category: 'Loan Disbursement'
      };
      return {
        ...state,
        loans: state.loans.map(l => l.id === loanId ? { ...l, status } : l),
        transactions: [...state.transactions, newTransaction]
      };
    }
    case 'ADD_REPAYMENT': {
        const { loanId, amount, date } = action.payload;
        const loan = state.loans.find(l => l.id === loanId);
        if (!loan) return state;

        const member = state.members.find(m => m.id === loan.memberId);

        // 1. Create a new transaction for the repayment income
        const newTransaction: Transaction = {
            id: `trn-${Date.now()}`,
            date,
            description: `Loan Repayment from ${member?.name || 'member'}`,
            type: TransactionType.Income,
            method: TransactionMethod.Bank,
            amount,
            category: 'Loan Repayment',
        };

        // 2. Create a new repayment record
        const newRepayment: Repayment = {
            id: `rep-${Date.now()}`,
            loanId,
            date,
            amount,
            transactionId: newTransaction.id,
        };
        
        // 3. Update the loan
        const updatedRepaymentsMade = loan.repaymentsMade + amount;
        const isFullyPaid = updatedRepaymentsMade >= loan.repaymentAmount;
        
        const updatedLoan: Loan = {
            ...loan,
            repaymentsMade: updatedRepaymentsMade,
            status: isFullyPaid ? LoanStatus.Paid : loan.status,
        };

        return {
            ...state,
            transactions: [...state.transactions, newTransaction],
            repayments: [...state.repayments, newRepayment],
            loans: state.loans.map(l => l.id === loanId ? updatedLoan : l),
        };
    }
     case 'ADD_CONTRIBUTION': {
      const { memberId, amount, date } = action.payload;
      const member = state.members.find(m => m.id === memberId);
      if (!member) return state;

      const newTransaction: Transaction = {
        id: `trn-${Date.now()}`,
        date,
        description: `Contribution from ${member.name}`,
        type: TransactionType.Income,
        method: TransactionMethod.Bank,
        amount,
        category: 'Contribution',
      };

      const newContribution: Contribution = {
        id: `con-${Date.now()}`,
        memberId,
        date,
        amount,
        transactionId: newTransaction.id,
      };

      return {
        ...state,
        transactions: [...state.transactions, newTransaction],
        contributions: [...state.contributions, newContribution],
      };
    }
    case 'ADD_PROGRAMME': {
      const { name, budget, startDate, endDate } = action.payload;

      const newProgramme: Programme = {
        id: `prog-${Date.now()}`,
        name,
        budget,
        startDate,
        endDate,
      };

      const newTransaction: Transaction = {
        id: `trn-${Date.now()}`,
        date: startDate,
        description: `Expense for programme: ${name}`,
        type: TransactionType.Expense,
        method: TransactionMethod.Bank,
        amount: budget,
        category: 'Programme Expense',
      };

      return {
        ...state,
        programmes: [...state.programmes, newProgramme],
        transactions: [...state.transactions, newTransaction],
      };
    }
    default:
      return state;
  }
};

const WelfareDataContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> }>({
  state: initialState,
  dispatch: () => null,
});

export const WelfareDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <WelfareDataContext.Provider value={{ state, dispatch }}>
      {children}
    </WelfareDataContext.Provider>
  );
};

export const useWelfareData = () => useContext(WelfareDataContext);