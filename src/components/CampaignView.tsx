/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  X, 
  Target, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  DollarSign, 
  Search,
  BadgeAlert,
  Play,
  Pause,
  Layers,
  Facebook,
  Chrome,
  Linkedin,
  Twitter,
  Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Campaign, CampaignStatus } from '../types';

interface CampaignViewProps {
  campaigns: Campaign[];
  onAddCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  onToggleCampaignStatus: (id: string) => void;
  onDeleteCampaign: (id: string) => void;
}

export default function CampaignView({ 
  campaigns, 
  onAddCampaign, 
  onToggleCampaignStatus,
  onDeleteCampaign
}: CampaignViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [campaignSearch, setCampaignSearch] = useState('');
  
  // Create Campaign State
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('10000');
  const [platform, setPlatform] = useState<'Google' | 'Facebook' | 'LinkedIn' | 'Twitter' | 'TikTok'>('Google');

  const filteredCampaigns = campaigns.filter(c => 
    c.name.toLowerCase().includes(campaignSearch.toLowerCase())
  );

  const getPlatformIcon = (plt: string) => {
    switch (plt) {
      case 'Facebook': return <Facebook className="w-4 h-4 text-sky-500" />;
      case 'LinkedIn': return <Linkedin className="w-4 h-4 text-blue-600" />;
      case 'Twitter': return <Twitter className="w-4 h-4 text-sky-400" />;
      case 'TikTok': return <Music className="w-4 h-4 text-pink-500" />;
      default: return <Chrome className="w-4 h-4 text-red-400" />; // Represents google chrome
    }
  };

  const calculateCTR = (reach: number, conversions: number) => {
    if (!reach) return '0.0%';
    const pct = (conversions / reach) * 100;
    return `${pct.toFixed(2)}%`;
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onAddCampaign({
      name,
      budget: Number(budget) || 5000,
      spent: 0,
      reach: 0,
      conversions: 0,
      cpc: Number((Math.random() * 3 + 1).toFixed(2)),
      status: CampaignStatus.RUNNING,
      platform
    });

    setName('');
    setBudget('10000');
    setPlatform('Google');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Overview Head */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-lg text-white">Campaign Resource Command</h2>
          <p className="text-xs text-slate-500 mt-0.5">Control visual marketing funnels, budgets, CPC coefficients, and trigger runs.</p>
        </div>

        <button
          id="btn-create-campaign-modal"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xl shadow-indigo-500/5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Schedule Campaign
        </button>
      </div>

      {/* Campaign utility row */}
      <div className="glass-panel p-4 rounded-xl flex items-center justify-between gap-4">
        <div className="relative w-full max-w-xs shrink-0">
          <Search className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-slate-500" />
          <input
            id="campaign-search-input"
            type="text"
            placeholder="Search campaigns by name..."
            value={campaignSearch}
            onChange={(e) => setCampaignSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white pl-9 pr-4 py-2 transition-all"
          />
        </div>

        <span className="text-[11px] text-slate-500 font-mono">
          Total Scheduled Services: <strong>{filteredCampaigns.length}</strong>
        </span>
      </div>

      {/* Grid of campaign cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.length > 0 ? (
          filteredCampaigns.map((c) => {
            const isRunning = c.status === CampaignStatus.RUNNING;
            const isPaused = c.status === CampaignStatus.PAUSED;
            const burnRate = c.budget > 0 ? (c.spent / c.budget) * 100 : 0;
            
            return (
              <motion.div
                key={c.id}
                layoutId={`campaign-card-${c.id}`}
                className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700/80 hover:bg-slate-900/10 transition-all border border-slate-850"
              >
                {/* Card Title Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 select-none">
                        {getPlatformIcon(c.platform)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono text-[9px] uppercase text-indigo-400 tracking-wider font-bold">{c.id}</span>
                        <h4 className="font-display font-semibold text-xs text-white leading-tight truncate max-w-[140px] block" title={c.name}>
                          {c.name}
                        </h4>
                      </div>
                    </div>

                    {/* Quick run/pause toggle */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono leading-none ${
                        isRunning ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                        isPaused ? 'bg-amber-400/10 text-amber-300 border border-amber-300/25' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {isRunning ? 'RUNNING' : isPaused ? 'PAUSED' : 'COMPLETED'}
                      </span>
                      
                      {c.status !== CampaignStatus.COMPLETED && (
                        <button
                          id={`btn-toggle-campaign-${c.id}`}
                          onClick={() => onToggleCampaignStatus(c.id)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                            isRunning 
                              ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-400/40' 
                              : 'bg-emerald-950/20 border-emerald-800 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                          }`}
                          title={isRunning ? 'Pause ad delivery' : 'Resume ad delivery'}
                        >
                          {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Budget burn range */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                      <span>Budget Burned</span>
                      <span className="text-white font-bold">{burnRate.toFixed(1)}%</span>
                    </div>
                    {/* Linear slider */}
                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          burnRate >= 90 ? 'bg-rose-500' : burnRate >= 60 ? 'bg-amber-400' : 'bg-indigo-500'
                        }`} 
                        style={{ width: `${Math.min(burnRate, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Statistics panel */}
                <div className="grid grid-cols-2 gap-3.5 my-5 pt-3.5 border-t border-slate-900/60 text-left font-sans">
                  
                  {/* Budget / Spent */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-550 flex items-center gap-0.5 leading-none">
                      <DollarSign className="w-3 h-3 text-emerald-400" /> Allocated Budget
                    </span>
                    <p className="font-mono text-xs font-bold text-white mt-1">
                      ${c.spent.toLocaleString()} / <span className="font-normal text-slate-500">${c.budget.toLocaleString()}</span>
                    </p>
                  </div>

                  {/* Reach */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-550 flex items-center gap-0.5 leading-none">
                      <Users className="w-3" /> Audience Reach
                    </span>
                    <p className="font-mono text-xs font-bold text-white mt-1">
                      {c.reach ? c.reach.toLocaleString() : '---'}
                    </p>
                  </div>

                  {/* Conversion CTR */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-550 flex items-center gap-0.5 leading-none">
                      <Target className="w-3 text-indigo-400" /> CTR Conversion Rate
                    </span>
                    <p className="font-mono text-xs font-bold text-indigo-400 mt-1">
                      {calculateCTR(c.reach, c.conversions)}
                    </p>
                  </div>

                  {/* Avg Cost Per Click (CPC) */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-550 flex items-center gap-0.5 leading-none">
                      <MousePointerClick className="w-3 text-cyan-400" /> Average CPC
                    </span>
                    <p className="font-mono text-xs font-bold text-white mt-1">
                      ${c.cpc} <span className="text-[9px] font-mono text-slate-500">USD</span>
                    </p>
                  </div>

                </div>

                {/* Footer and cancel buttons */}
                <button
                  id={`btn-delete-campaign-id-${c.id}`}
                  onClick={() => {
                    if (confirm(`Terminate scheduled ad services: ${c.name}?`)) {
                      onDeleteCampaign(c.id);
                    }
                  }}
                  className="w-full text-center py-2 bg-slate-900/40 hover:bg-rose-950/20 border border-slate-900 hover:border-rose-900 text-[11px] text-slate-500 hover:text-rose-450 rounded-xl transition-all cursor-pointer font-medium"
                >
                  Terminate Delivery
                </button>

              </motion.div>
            );
          })
        ) : (
          <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-slate-500 font-sans glass-panel rounded-2xl">
            No advertising campaigns match the filter settings. Create one!
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-sm p-6 overflow-hidden shadow-2xl glass-panel text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-indigo-400" />
                  <span className="font-display font-semibold text-sm text-white">Create Advertising Campaign</span>
                </div>
                
                <button
                  id="btn-close-campaign-modal"
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors animate-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form creation */}
              <form onSubmit={handleCreateCampaign} className="mt-4 space-y-4 font-sans">
                
                {/* Campaign name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Interactive Ad Title</label>
                  <input
                    id="create-campaign-name-input"
                    type="text"
                    required
                    placeholder="Enter short title (e.g. Winter Sale)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white px-3.5 py-2.5 transition-all"
                  />
                </div>

                {/* Target Channel platform */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Target Channel Channel</label>
                  <select
                    id="create-campaign-platform-selector"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white p-2.5 cursor-pointer"
                  >
                    <option value="Google">Google AdWords Search</option>
                    <option value="Facebook">Facebook Newsfeed Ads</option>
                    <option value="LinkedIn">LinkedIn Business Network</option>
                    <option value="Twitter">Twitter Promo Accs</option>
                    <option value="TikTok">TikTok Video Promos</option>
                  </select>
                </div>

                {/* Budget sum */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Funding Allotment (Budget)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-500 text-xs">$</span>
                    <input
                      id="create-campaign-budget-input"
                      type="number"
                      required
                      placeholder="5000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white pl-7 pr-35 py-2.5 font-mono"
                    />
                  </div>
                  <span className="text-[9.5px] text-slate-550 block font-mono">Recommended baseline starts at $1,000.00 limits</span>
                </div>

                <div className="pt-4 border-t border-slate-900 flex items-center justify-end gap-3.5">
                  <button
                    id="btn-cancel-campaign-creation"
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer select-none"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-confirm-campaign-creation"
                    type="submit"
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/10 cursor-pointer"
                  >
                    Deploy Marketing Ad
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
