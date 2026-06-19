/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  Clock, 
  Sparkles, 
  User as UserIcon, 
  LogOut, 
  Shield, 
  BadgeCheck, 
  HelpCircle,
  X,
  CreditCard,
  Target,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, User, Campaign, Transaction, UserRole } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  users: User[];
  campaigns: Campaign[];
  transactions: Transaction[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onNavigate: (tab: ActiveTab) => void;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: 'info' | 'alert' | 'success';
}

export default function Header({ 
  activeTab, 
  users, 
  campaigns, 
  transactions, 
  currentRole, 
  setCurrentRole,
  onNavigate
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const [timeStr, setTimeStr] = useState('');
  
  const searchRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Live Clock Updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to HH:MM:SS
      const hh = String(now.getUTCHours()).padStart(2, '0');
      const mm = String(now.getUTCMinutes()).padStart(2, '0');
      const ss = String(now.getUTCSeconds()).padStart(2, '0');
      setTimeStr(`${hh}:${mm}:${ss} UTC`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'High Conversion Spike',
      desc: 'Campaign "Summer Developer Booster" rose by 14.2% CTR.',
      time: 'Just now',
      read: false,
      type: 'success'
    },
    {
      id: 'n-2',
      title: 'Failed Payment Logged',
      desc: 'Transaction TXN-9024 for compute credit failed (Terminal 02).',
      time: '15m ago',
      read: false,
      type: 'alert'
    },
    {
      id: 'n-3',
      title: 'New Member Registered',
      desc: 'Suzuha Amane has completed verification check.',
      time: '2h ago',
      read: true,
      type: 'info'
    },
    {
      id: 'n-4',
      title: 'Server Maintenance Completed',
      desc: 'Database nodes shifted seamlessly to Backup Zone B.',
      time: '1d ago',
      read: true,
      type: 'info'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Search filter matches
  const matchedUsers = searchQuery 
    ? users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  const matchedCampaigns = searchQuery
    ? campaigns.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  const matchedTxns = searchQuery
    ? transactions.filter(t => t.id.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  const hasSearchResults = matchedUsers.length > 0 || matchedCampaigns.length > 0 || matchedTxns.length > 0;

  // Handle outside clicks for dropdowns
  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        // Delay slightly if click was inside target
        setShowNotificationDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard': return 'Overview / Analytics Board';
      case 'users': return 'Management / Platform Users';
      case 'finance': return 'Management / Financial Transactions';
      case 'marketing': return 'Planner / Campaigns';
      case 'settings': return 'System Settings';
      default: return 'Aether Console';
    }
  };

  return (
    <header id="top-header" className="h-16 border-b border-slate-800/80 bg-slate-950/65 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20 sticky top-0">
      
      {/* Search Input Panel */}
      <div className="flex items-center gap-6 flex-1 max-w-md">
        <div ref={searchRef} className="relative w-full">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="header-global-search-input"
            type="text"
            placeholder="Search users, transactions, campaigns..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-indigo-500/50 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white pl-9 pr-8 py-2 transition-all leading-normal font-sans"
          />
          {searchQuery && (
            <button
              id="clear-header-search-query"
              onClick={() => {
                setSearchQuery('');
                setShowSearchDropdown(false);
              }}
              className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Search Dropdown Panel */}
          <AnimatePresence>
            {showSearchDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 mt-2 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-4 max-h-[380px] overflow-y-auto space-y-4 z-50 glass-panel"
              >
                {!searchQuery ? (
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold font-mono tracking-wider text-slate-400 uppercase">Quick Shortcuts</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => { onNavigate('users'); setSearchQuery(''); setShowSearchDropdown(false); }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-905 border border-slate-800/60 hover:bg-slate-900/80 hover:border-slate-700 text-left transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[11px] text-slate-300">Open User Manager</span>
                      </button>
                      <button 
                        onClick={() => { onNavigate('finance'); setSearchQuery(''); setShowSearchDropdown(false); }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-905 border border-slate-800/60 hover:bg-slate-900/80 hover:border-slate-700 text-left transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] text-slate-300">Inspect Finances</span>
                      </button>
                      <button 
                        onClick={() => { onNavigate('marketing'); setSearchQuery(''); setShowSearchDropdown(false); }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-905 border border-slate-800/60 hover:bg-slate-900/80 hover:border-slate-700 text-left transition-colors"
                      >
                        <Target className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-[11px] text-slate-300">View Campaigns</span>
                      </button>
                      <button 
                        onClick={() => { onNavigate('settings'); setSearchQuery(''); setShowSearchDropdown(false); }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-905 border border-slate-800/60 hover:bg-slate-900/80 hover:border-slate-700 text-left transition-colors"
                      >
                        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[11px] text-slate-300 font-mono">System Settings</span>
                      </button>
                    </div>
                  </div>
                ) : hasSearchResults ? (
                  <div className="space-y-3">
                    {/* User results */}
                    {matchedUsers.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-indigo-400">Matched Users</p>
                        {matchedUsers.map((u) => (
                          <div 
                            key={u.id} 
                            onClick={() => { onNavigate('users'); setShowSearchDropdown(false); setSearchQuery(''); }}
                            className="flex items-center gap-2 p-2 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                          >
                            <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                            <div className="min-w-0">
                              <p className="text-xs text-white font-medium truncate">{u.name}</p>
                              <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Campaign results */}
                    {matchedCampaigns.length > 0 && (
                      <div className="space-y-1.5 pt-1 border-t border-slate-900">
                        <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-rose-400">Matched Campaigns</p>
                        {matchedCampaigns.map((c) => (
                          <div 
                            key={c.id} 
                            onClick={() => { onNavigate('marketing'); setShowSearchDropdown(false); setSearchQuery(''); }}
                            className="flex items-center justify-between p-2 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                          >
                            <span className="text-xs text-white font-medium truncate">{c.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">{c.platform} / CMP</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Transaction results */}
                    {matchedTxns.length > 0 && (
                      <div className="space-y-1.5 pt-1 border-t border-slate-900">
                        <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400">Matched Transactions</p>
                        {matchedTxns.map((t) => (
                          <div 
                            key={t.id} 
                            onClick={() => { onNavigate('finance'); setShowSearchDropdown(false); setSearchQuery(''); }}
                            className="flex items-center justify-between p-2 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                          >
                            <div className="min-w-0">
                              <p className="text-xs text-white truncate">{t.category}</p>
                              <p className="text-[9px] text-slate-500 font-mono">{t.id}</p>
                            </div>
                            <span className="text-xs font-mono font-bold text-emerald-400">${t.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <p className="text-xs">No entries match your search query</p>
                    <p className="text-[10px] font-mono mt-1 text-slate-600">Try searching "Sarah" or "servers"</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Breadcrumb Info - Displays on medium screens */}
      <span className="hidden md:inline text-[11px] font-mono text-slate-500 uppercase tracking-widest px-4 truncate max-w-xs">{getBreadcrumb()}</span>

      {/* Right widgets */}
      <div className="flex items-center gap-4">
        
        {/* UTC Live clock */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 rounded-xl px-3 py-1 text-slate-400 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{timeStr || '00:00:00 UTC'}</span>
        </div>

        {/* Notification center */}
        <div className="relative">
          <button
            id="header-notification-bell-btn"
            ref={bellRef}
            onClick={() => {
              setShowNotificationDropdown(!showNotificationDropdown);
              setShowProfileDropdown(false);
            }}
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800/50 hover:text-white text-slate-400 flex items-center justify-center relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[9px] font-mono font-bold text-white rounded-full flex items-center justify-center border border-slate-950">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          <AnimatePresence>
            {showNotificationDropdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 glass-panel"
              >
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="font-display font-medium text-xs text-white">Console Alerts</span>
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      id="notifications-mark-read"
                      onClick={markAllAsRead} 
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    >
                      Clear unread
                    </button>
                  )}
                </div>

                <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-900">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-4 hover:bg-slate-900/60 transition-colors relative flex gap-3 ${
                          !n.read ? 'bg-indigo-950/10' : ''
                        }`}
                      >
                        {/* Type indicator */}
                        <div className="pt-0.5 shrink-0">
                          <span className={`w-1.5 h-1.5 rounded-full block ${
                            n.type === 'success' ? 'bg-emerald-500' : n.type === 'alert' ? 'bg-rose-500' : 'bg-blue-400'
                          }`}></span>
                        </div>

                        <div className="min-w-0 pr-4">
                          <p className={`text-[11px] leading-tight truncate ${!n.read ? 'font-semibold text-white' : 'text-slate-300'}`}>
                            {n.title}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                            {n.desc}
                          </p>
                          <span className="text-[9px] font-mono text-slate-600 block mt-1.5">
                            {n.time}
                          </span>
                        </div>

                        <button
                          id={`delete-notification-${n.id}`}
                          onClick={(e) => deleteNotification(n.id, e)}
                          className="absolute right-3 top-3 text-slate-600 hover:text-slate-400"
                        >
                          <X className="w-3" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-500 font-sans">
                      <p className="text-xs">Console reports green state.</p>
                      <p className="text-[10px] text-slate-600 mt-1 font-mono">0 pending system warnings</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile and Role customization */}
        <div ref={profileRef} className="relative flex items-center gap-2 border-l border-slate-800 pl-4">
          <button
            id="header-user-profile-btn"
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotificationDropdown(false);
            }}
            className="flex items-center gap-2 group focus:outline-none cursor-pointer"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="System Operator"
                className="w-8 h-8 rounded-xl object-cover border border-indigo-500/30 group-hover:border-indigo-500 transition-colors"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-slate-950 rounded-full"></span>
            </div>
            
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-medium text-white group-hover:text-indigo-300 transition-colors">
                Anes Bibo
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase leading-none mt-0.5">
                {currentRole}
              </span>
            </div>
          </button>

          {/* Profile Dropdown Panel */}
          <AnimatePresence>
            {showProfileDropdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 mt-1 w-52 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 glass-panel"
              >
                <div className="p-3 border-b border-slate-900">
                  <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500">Privilege Level</p>
                  
                  {/* Interactive mock role-switcher */}
                  <div className="mt-2 space-y-1">
                    {Object.values(UserRole).map((role) => (
                      <button
                        key={role}
                        id={`profile-role-select-${role}`}
                        onClick={() => {
                          setCurrentRole(role);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-[11px] transition-colors ${
                          currentRole === role
                            ? 'bg-indigo-650/20 text-indigo-400 border border-indigo-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        <span>{role}</span>
                        {currentRole === role && <BadgeCheck className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    id="profile-dropdown-nav-settings"
                    onClick={() => {
                      onNavigate('settings');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-900 hover:text-white text-left transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Policy Manager</span>
                  </button>
                  <button
                    id="profile-dropdown-nav-help"
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-900 hover:text-white text-left transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Support Desk</span>
                  </button>
                  <div className="border-t border-slate-900 my-1"></div>
                  <button
                    id="profile-logout-mock-btn"
                    onClick={() => {
                      alert('Goodbye! Logging out sequence completed.');
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/5 hover:text-rose-300 text-left transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
