/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Core Type definitions and Mock data
import { ActiveTab, User, Campaign, Transaction, UserRole, UserStatus, CampaignStatus, StatItem, TransactionStatus } from './types';
import { initialStats, initialUsers, initialTransactions, initialCampaigns } from './mockData';

// Modular View Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import UserManagementView from './components/UserManagementView';
import FinancesView from './components/FinancesView';
import CampaignView from './components/CampaignView';
import SettingsView from './components/SettingsView';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Unified State Stores
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [stats, setStats] = useState<StatItem[]>(initialStats);
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.ADMIN);

  // --- ACTIONS ENGINE ---

  // 1. User Account Operations
  const handleAddUser = (newFields: Omit<User, 'id' | 'joinDate'>) => {
    const nextIdNum = users.length + 1;
    const nextId = `USR-${String(nextIdNum).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const newUser: User = {
      ...newFields,
      id: nextId,
      joinDate: today
    };

    const updated = [newUser, ...users];
    setUsers(updated);

    // Dynamic stats connection: Increment platform users count!
    setStats(prevStats => prevStats.map(s => {
      if (s.title.includes('Active Platform Users')) {
        const currentCount = Number(s.value.replace(/,/g, ''));
        const nextValue = (currentCount + 1).toLocaleString();
        
        // Append value to historic sparkline points
        const nextSparkline = [...s.sparkline.slice(1), currentCount + 1];

        return {
          ...s,
          value: nextValue,
          sparkline: nextSparkline,
          change: Number((s.change + 0.1).toFixed(1))
        };
      }
      return s;
    }));
  };

  const handleEditUser = (modifiedUser: User) => {
    setUsers(users.map(u => u.id === modifiedUser.id ? modifiedUser : u));
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));

    // Dynamic stats connection: Decrement platform users count!
    setStats(prevStats => prevStats.map(s => {
      if (s.title.includes('Active Platform Users')) {
        const currentCount = Number(s.value.replace(/,/g, ''));
        const nextValue = Math.max(0, currentCount - 1).toLocaleString();
        const nextSparkline = [...s.sparkline.slice(1), Math.max(0, currentCount - 1)];

        return {
          ...s,
          value: nextValue,
          sparkline: nextSparkline
        };
      }
      return s;
    }));
  };

  // 2. Financial ledger operations
  const handleAddTransaction = (newTxnFields: Omit<Transaction, 'id' | 'date'>) => {
    const nextIdNum = transactions.length + 9021;
    const nextId = `TXN-${nextIdNum}`;
    const now = new Date();
    // Format timestamp: YYYY-MM-DD HH:MM
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newTxn: Transaction = {
      ...newTxnFields,
      id: nextId,
      date: dateStr
    };

    setTransactions([newTxn, ...transactions]);

    // Dynamic stats connection: Add spent amount and increment Total Monthly Revenue stat metric!
    setStats(prevStats => prevStats.map(s => {
      if (s.title.includes('Total Monthly Revenue')) {
        const numericVal = Number(s.value.replace(/[$,]/g, ''));
        const nextValNum = numericVal + newTxnFields.amount;
        const nextValue = `$${nextValNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const nextSparkline = [...s.sparkline.slice(1), s.sparkline[s.sparkline.length - 1] + (newTxnFields.amount / 1000)];

        return {
          ...s,
          value: nextValue,
          sparkline: nextSparkline,
          change: Number((s.change + 0.4).toFixed(1))
        };
      }
      return s;
    }));
  };

  // 3. Campaign planner operations
  const handleAddCampaign = (newCampFields: Omit<Campaign, 'id'>) => {
    const nextIdNum = campaigns.length + 1;
    const nextId = `CMP-${String(nextIdNum).padStart(3, '0')}`;

    const newCampaign: Campaign = {
      ...newCampFields,
      id: nextId
    };

    setCampaigns([newCampaign, ...campaigns]);

    // Dynamic stats connection: Increment Active Marketing Ad Spend by budget!
    setStats(prevStats => prevStats.map(s => {
      if (s.title.includes('Active Marketing Ad Spend')) {
        const numericVal = Number(s.value.replace(/[$,]/g, ''));
        const nextValNum = numericVal + newCampFields.budget;
        const nextValue = `$${nextValNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const nextSparkline = [...s.sparkline.slice(1), s.sparkline[s.sparkline.length - 1] + (newCampFields.budget / 1000)];

        return {
          ...s,
          value: nextValue,
          sparkline: nextSparkline,
          change: Number((s.change + 1.2).toFixed(1))
        };
      }
      return s;
    }));
  };

  const handleToggleCampaignStatus = (id: string) => {
    setCampaigns(campaigns.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === CampaignStatus.RUNNING ? CampaignStatus.PAUSED : CampaignStatus.RUNNING;
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const handleDeleteCampaign = (id: string) => {
    const targeted = campaigns.find(c => c.id === id);
    setCampaigns(campaigns.filter(c => c.id !== id));

    // Dynamic stats connection: Decrement Active Marketing Ad Spend by deleted budget!
    if (targeted) {
      setStats(prevStats => prevStats.map(s => {
        if (s.title.includes('Active Marketing Ad Spend')) {
          const numericVal = Number(s.value.replace(/[$,]/g, ''));
          const nextValNum = Math.max(0, numericVal - targeted.budget);
          const nextValue = `$${nextValNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          const nextSparkline = [...s.sparkline.slice(1), Math.max(0, s.sparkline[s.sparkline.length - 1] - (targeted.budget / 1000))];

          return {
            ...s,
            value: nextValue,
            sparkline: nextSparkline
          };
        }
        return s;
      }));
    }
  };

  // Rendering Routing matrix
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            stats={stats}
            users={users}
            campaigns={campaigns}
            transactions={transactions}
            onNavigate={(tab) => setActiveTab(tab as ActiveTab)}
          />
        );
      case 'users':
        return (
          <UserManagementView
            users={users}
            onAddUser={handleAddUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 'finance':
        return (
          <FinancesView
            transactions={transactions}
            users={users}
            onAddTransaction={handleAddTransaction}
          />
        );
      case 'marketing':
        return (
          <CampaignView
            campaigns={campaigns}
            onAddCampaign={handleAddCampaign}
            onToggleCampaignStatus={handleToggleCampaignStatus}
            onDeleteCampaign={handleDeleteCampaign}
          />
        );
      case 'settings':
        return (
          <SettingsView
            currentRole={currentRole}
          />
        );
      default:
        return (
          <div className="text-center py-20 text-slate-500 font-mono">
            Error: Invalid Tab state requested.
          </div>
        );
    }
  };

  return (
    <div id="aether-console-frame" className="min-h-screen bg-slate-950 font-sans text-slate-250 flex overflow-hidden">
      
      {/* 1. Left Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userCount={users.length}
        campaignCount={campaigns.filter(c => c.status === CampaignStatus.RUNNING).length}
      />

      {/* 2. Right Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Floating Control Bar */}
        <Header 
          activeTab={activeTab}
          users={users}
          campaigns={campaigns}
          transactions={transactions}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          onNavigate={(tab) => setActiveTab(tab)}
        />

        {/* Scrollable View Panel */}
        <main className="flex-1 overflow-y-auto px-6 py-6 bg-slate-950/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="max-w-7xl mx-auto w-full h-full pb-10"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

    </div>
  );
}
