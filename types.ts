

// Fix: Removed self-import of Page. The enum 'Page' is defined in this file and should not be imported from itself.
export enum Page {
  Dashboard = 'Dashboard',
  Members = 'Members',
  Contributions = 'Contributions',
  Loans = 'Loans',
  CashBook = 'Cash Book',
  Programmes = 'Programmes',
  Reports = 'Reports',
}

export enum TransactionType {
  Income = 'Income',
  Expense = 'Expense',
}

export enum TransactionMethod {
  Cash = 'Cash',
  Bank = 'Bank',
}

export enum LoanStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Paid = 'Paid',
}

export interface Member {
  id: string;
  name: string;
  employeeId: string;
  joiningDate: string;
  designation: string;
  nic: string;
  dob: string;
  address: string;
  contactNo: string;
  remark?: string;
}

export interface Transaction {
  id:string;
  date: string;
  description: string;
  type: TransactionType;
  method: TransactionMethod;
  amount: number;
  category: string; // e.g., Contribution, Loan Disbursement, Programme Expense
}

export interface Contribution {
  id: string;
  memberId: string;
  date: string;
  amount: number;
  transactionId: string;
}

export interface Loan {
  id: string;
  memberId: string;
  applicationDate: string;
  amount: number;
  reason: string;
  status: LoanStatus;
  repaymentAmount: number;
  repaymentsMade: number;
  repaymentSchedule?: string;
}

export interface Programme {
  id: string;
  name: string;
  budget: number;
  startDate: string;
  endDate: string;
}

export interface Repayment {
  id: string;
  loanId: string;
  date: string;
  amount: number;
  transactionId: string;
}