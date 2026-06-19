/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Megaphone, 
  Settings as SettingsIcon, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userCount: number;
  campaignCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, userCount, campaignCount }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Analytics Board',
      icon: BarChart3,
      category: 'Overview',
      badge: null
    },
    {
      id: 'users' as ActiveTab,
      label: 'User Manager',
      icon: Users,
      category: 'Management',
      badge: userCount ? String(userCount) : null
    },
    {
      id: 'finance' as ActiveTab,
      label: 'Finances & Ledger',
      icon: CreditCard,
      category: 'Management',
      badge: 'New'
    },
    {
      id: 'marketing' as ActiveTab,
      label: 'Campaign Planner',
      icon: Megaphone,
      category: 'Marketing',
      badge: campaignCount ? String(campaignCount) : null
    },
    {
      id: 'settings' as ActiveTab,
      label: 'System Settings',
      icon: SettingsIcon,
      category: 'Settings',
      badge: null
    }
  ];

  // Group items by category to make it clean
  const categories = ['Overview', 'Management', 'Marketing', 'Settings'];

  return (
    <motion.div 
      id="sidebar-container"
      animate={{ width: isCollapsed ? '76px' : '260px' }}
      className="h-screen bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 relative transition-transform overflow-y-auto"
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col"
              >
                <span className="font-display font-semibold text-sm tracking-tight text-white leading-none">
                  Aether Console
                </span>
                <span className="text-[10px] text-indigo-400 font-mono tracking-wider uppercase mt-1">
                  v2.4 Pro
                </span>
              </motion.div>
            )}
          </div>

          {!isCollapsed && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse-green shrink-0"></span>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <div className="px-3 py-6 space-y-6">
          {categories.map((category) => {
            const filteredItems = menuItems.filter((item) => item.category === category);
            if (filteredItems.length === 0) return null;

            return (
              <div key={category} className="space-y-1.5">
                {!isCollapsed && (
                  <p className="text-[10px] font-mono font-semibold text-slate-500 tracking-wider uppercase px-3 pb-1">
                    {category}
                  </p>
                )}

                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      id={`sidebar-item-${item.id}`}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all relative ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                      }`}
                    >
                      {/* Active Background Glow Pill */}
                      {isActive && (
                        <motion.div
                          layoutId="active-nav-glow"
                          className="absolute inset-0 bg-indigo-600/10 border border-indigo-500/20 rounded-xl"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}

                      {/* Active Indicator Line */}
                      {isActive && (
                        <motion.div
                          layoutId="active-indicator-bar"
                          className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-500 rounded-r-lg"
                        />
                      )}

                      <div className="flex items-center gap-3 z-10">
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                        {!isCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span className={`z-10 px-2 py-0.5 rounded-full text-[9px] font-mono leading-none ${
                          item.badge === 'New' 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                            : 'bg-indigo-500/20 text-indigo-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer Info */}
      <div className="border-t border-slate-800/80 p-3 space-y-3 bg-slate-950/60 sticky bottom-0">
        {!isCollapsed && (
          <div className="glass-panel p-3 rounded-xl border-dashed border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-mono text-[9px] font-bold text-emerald-400">UPTIME SCORE 99.98%</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Running in resilient Cloud Shell. Node operations running normal.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-1.5">
          <button
            id="sidebar-toggle-collapse"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800/80 hover:text-white text-slate-400 flex items-center justify-center shrink-0"
            title={isCollapsed ? 'Expand menu' : 'Collapse menu'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {!isCollapsed && (
            <span className="text-[10px] text-slate-500 font-mono tracking-wide leading-none select-none">
              © 2026 Aether OS
            </span>
          )}
          
          {!isCollapsed && (
            <button 
              id="sidebar-help-btn"
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800/80 text-slate-400 flex items-center justify-center shrink-0"
              title="Documentation Info"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
