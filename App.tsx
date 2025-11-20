import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, Transaction } from './types';
import { getTransactions, saveTransaction, deleteTransaction, updateTransaction, updateUserProfile } from './services/storageService';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import Scanner from './components/Scanner';
import TaxReport from './components/TaxReport';
import Profile from './components/Profile';
import Auth from './components/Auth';
import AskTony from './components/AskTony';
import Payroll from './components/Payroll';
import Invoices from './components/Invoices';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load user session
  useEffect(() => {
    const savedUser = localStorage.getItem('taxmind_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Load transactions when user changes
  useEffect(() => {
    if (user) {
      setTransactions(getTransactions(user.id));
    } else {
      setTransactions([]);
    }
  }, [user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('taxmind_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('taxmind_session');
  };

  const handleUpdateUser = (updatedUser: User) => {
    const savedUser = updateUserProfile(updatedUser);
    setUser(savedUser);
    localStorage.setItem('taxmind_session', JSON.stringify(savedUser));
  };

  const handleAddTransaction = (t: Omit<Transaction, 'id'>) => {
    if (!user) return;
    const newT = saveTransaction({ ...t, userId: user.id });
    setTransactions(prev => [newT, ...prev]);
  };

  const handleUpdateTransaction = (updatedT: Transaction) => {
    if (!user) return;
    // Pass the current user's ID as the editor
    const savedT = updateTransaction(updatedT, user.id);
    setTransactions(prev => prev.map(t => t.id === savedT.id ? savedT : t));
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-50">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header 
            user={user} 
            onLogout={handleLogout}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route 
                  path="/" 
                  element={<Dashboard transactions={transactions} />} 
                />
                <Route 
                  path="/chat" 
                  element={
                    <AskTony 
                      user={user} 
                      transactions={transactions}
                    />
                  } 
                />
                <Route 
                  path="/transactions" 
                  element={
                    <TransactionList 
                      transactions={transactions} 
                      onDelete={handleDeleteTransaction}
                      onAdd={handleAddTransaction}
                      onUpdate={handleUpdateTransaction}
                      userId={user.id}
                    />
                  } 
                />
                <Route 
                  path="/scan" 
                  element={
                    <Scanner 
                      onScanComplete={handleAddTransaction} 
                      userId={user.id} 
                    />
                  } 
                />
                <Route 
                  path="/invoices" 
                  element={<Invoices user={user} />} 
                />
                 <Route 
                  path="/payroll" 
                  element={<Payroll user={user} />} 
                />
                <Route 
                  path="/reports" 
                  element={
                    <TaxReport 
                      transactions={transactions} 
                      user={user}
                    />
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <Profile 
                      user={user} 
                      onUpdateUser={handleUpdateUser}
                    />
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
