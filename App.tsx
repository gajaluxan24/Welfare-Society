
import React, { useState } from 'react';
import { Page } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Contributions from './components/Contributions';
import Loans from './components/Loans';
import CashBook from './components/CashBook';
import Programmes from './components/Programmes';
import Reports from './components/Reports';
import Members from './components/Members';
import { WelfareDataProvider } from './context/WelfareDataContext';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard />;
      case Page.Members:
        return <Members />;
      case Page.Contributions:
        return <Contributions />;
      case Page.Loans:
        return <Loans />;
      case Page.CashBook:
        return <CashBook />;
      case Page.Programmes:
        return <Programmes />;
      case Page.Reports:
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <WelfareDataProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </WelfareDataProvider>
  );
};

export default App;