
import React from 'react';
import { Page } from '../types';
import { NAV_ITEMS } from '../constants';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <aside className="w-16 md:w-64 bg-white dark:bg-gray-800 flex flex-col transition-all duration-300">
      <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
         <svg className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        <h1 className="hidden md:block text-2xl font-bold ml-2 text-gray-800 dark:text-white">Welfare</h1>
      </div>
      <nav className="flex-1 mt-6">
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.name}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(item.name);
                }}
                className={`flex items-center justify-center md:justify-start px-4 py-3 my-1 transition-colors duration-200
                  ${
                    currentPage === item.name
                      ? 'bg-indigo-500 text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="hidden md:block mx-4 font-medium">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
