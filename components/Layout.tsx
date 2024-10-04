import React from 'react';
import { Navigation } from './Navigation';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-layout min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <Navigation />
      </header>
      <main className="flex-grow bg-gray-100 p-4">{children}</main>
      <footer className="bg-gray-200 p-4 text-center">
        <p>© 2024 Tascheged - Allowance Tracker</p>
      </footer>
    </div>
  );
};
