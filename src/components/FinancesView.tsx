/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CreditCard as CardIcon, 
  Send, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  Filter,
  Plus,
  Coins,
  DollarSign,
  User as UserIcon,
  Search,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, TransactionStatus, User } from '../types';

interface FinancesViewProps {
  transactions: Transaction[];
  users: User[];
  onAddTransaction: (txn: Omit<Transaction, 'id' | 'date'>) => void;
}

type CardTheme = 'midnight' | 'cyber' | 'emerald';

export default function FinancesView({ transactions, users, onAddTransaction }: FinancesViewProps) {
  // Card customization stats
  const [cardTheme, setCardTheme] = useState<CardTheme>('midnight');
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Send money state
  const [receiverIdx, setReceiverIdx] = useState(0);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferCategory, setTransferCategory] = useState('Cloud Infrastructure');
  const [isProcessingTransfer, setIsProcessingTransfer] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Search/Filters
  const [txnSearch, setTxnSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TransactionStatus>('All');

  const filteredTxns = transactions.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(txnSearch.toLowerCase()) || 
                          t.userName.toLowerCase().includes(txnSearch.toLowerCase()) ||
                          t.category.toLowerCase().includes(txnSearch.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getCardGradient = () => {
    switch (cardTheme) {
      case 'cyber':
        return 'from-purple-900 via-indigo-950 to-slate-900 border-purple-500/30 shadow-purple-500/5';
      case 'emerald':
        return 'from-emerald-950 via-teal-950 to-slate-950 border-emerald-500/30 shadow-emerald-500/5';
      default:
        return 'from-slate-900 via-indigo-950 to-slate-950 border-indigo-500/30 shadow-indigo-500/5';
    }
  };

  const getCardAccentShadow = () => {
    switch (cardTheme) {
      case 'cyber': return 'shadow-[0_0_25px_rgba(168,85,247,0.15)]';
      case 'emerald': return 'shadow-[0_0_25px_rgba(16,185,129,0.15)]';
      default: return 'shadow-[0_0_25px_rgba(99,102,241,0.15)]';
    }
  };

  const handleSendMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(transferAmount);
    if (!amount || amount <= 0) return;

    setIsProcessingTransfer(true);
    setTransferSuccess(false);

    // Mock network delay
    setTimeout(() => {
      setIsProcessingTransfer(false);
      setTransferSuccess(true);
      
      const receiver = users[receiverIdx] || { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' };

      onAddTransaction({
        userName: receiver.name,
        userAvatar: receiver.avatar,
        category: transferCategory,
        amount: amount,
        status: TransactionStatus.SUCCESS,
        cardLast4: '4392'
      });

      // Reset send fields
      setTransferAmount('');
      
      // Keep notify active temporarily
      setTimeout(() => setTransferSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      
      {/* LEFT 1 COL: Card Customizer and Transfer form */}
      <div className="space-y-6 lg:col-span-1">
        
        {/* Virtual 3D Card Graphic */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl flex flex-col gap-5 border border-slate-800"
          id="billing-virtual-card-panel"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardIcon className="w-4 h-4 text-indigo-400" />
              <h3 className="font-display font-semibold text-xs text-white uppercase tracking-wider">Aether Platinum Card</h3>
            </div>
            
            {/* Theme switcher */}
            <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
              <button
                id="btn-card-theme-midnight"
                onClick={() => setCardTheme('midnight')}
                className={`w-3.5 h-3.5 rounded-full bg-indigo-500 border ${cardTheme === 'midnight' ? 'border-white' : 'border-transparent'}`}
                title="Midnight Theme"
              />
              <button
                id="btn-card-theme-cyber"
                onClick={() => setCardTheme('cyber')}
                className={`w-3.5 h-3.5 rounded-full bg-purple-500 border ${cardTheme === 'cyber' ? 'border-white' : 'border-transparent'}`}
                title="Cyber Theme"
              />
              <button
                id="btn-card-theme-emerald"
                onClick={() => setCardTheme('emerald')}
                className={`w-3.5 h-3.5 rounded-full bg-emerald-500 border ${cardTheme === 'emerald' ? 'border-white' : 'border-transparent'}`}
                title="Emerald Theme"
              />
            </div>
          </div>

          {/* Actual credit card */}
          <div className="perspective-1000 w-full h-[190px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
              id="credit-card-body-framer"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`w-full h-full rounded-2xl border p-5 flex flex-col justify-between relative transform-style-3d bg-gradient-to-br ${getCardGradient()} ${getCardAccentShadow()}`}
            >
              
              {/* CARD FRONT */}
              {!isFlipped ? (
                <div className="flex flex-col justify-between h-full backface-hidden">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">Premium Member</span>
                      <span className="font-display font-bold text-xs text-indigo-400">Anes Bibo</span>
                    </div>

                    <div className="w-10 h-7 rounded bg-slate-800/30 border border-white/10 flex items-center justify-center">
                      <span className="text-[10px] font-mono text-white/50 italic mr-1">visa</span>
                    </div>
                  </div>

                  {/* Metallic Chip details */}
                  <div className="w-8 h-6.5 rounded-md bg-gradient-to-br from-yellow-600 via-yellow-400 to-amber-700 border border-yellow-300/30 my-2 shadow shrink-0" />

                  {/* Card numbers with dummy spaces */}
                  <p className="font-mono text-sm tracking-[0.2em] text-white select-none whitespace-nowrap mt-1">
                    ••••  ••••  ••••  4392
                  </p>

                  <div className="flex justify-between items-end mt-1 text-[9px] font-mono">
                    <div>
                      <p className="text-slate-500 text-[8px] uppercase">EXP DATE</p>
                      <p className="text-white">09 / 31</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-[8px] uppercase">LIMIT ACCR</p>
                      <p className="text-emerald-400 font-bold">$150,000</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* CARD BACK */
                <div className="flex flex-col justify-between h-full backface-hidden rotate-y-180">
                  <div className="h-9 bg-slate-950 -mx-5 mt-1 border-y border-white/[0.02]"></div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 px-1">
                      <span>AUTHORIZED SIGNATURE</span>
                      <span>NOT VALID UNLESS SIGNED</span>
                    </div>
                    
                    <div className="bg-slate-900 border border-slate-800 h-8.5 rounded flex items-center justify-end px-3">
                      <span className="font-mono text-xs text-indigo-400 tracking-wider">314</span>
                    </div>
                  </div>

                  <p className="text-[7px] text-slate-500 leading-normal font-sans">
                    This card is electronic property of Aether Systems. Usage implies acceptance of terms. If found, please return to operator at console 02 terminal.
                  </p>
                </div>
              )}

            </motion.div>
          </div>

          <p className="text-[10px] text-slate-500 text-center font-mono leading-none">
            💡 Click on the card above to toggle view (Front / CVV Back)
          </p>
        </motion.div>

        {/* Send Money Quick transfer Form */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-5 rounded-2xl space-y-4"
          id="billing-transfer-form-panel"
        >
          <div>
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400 shrink-0" />
              <h3 className="font-display font-semibold text-sm text-white">Console Instant Despatcher</h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Wire immediate credits directly to project partners.
            </p>
          </div>

          {users.length > 0 && (
            <form onSubmit={handleSendMoney} className="space-y-4">
              {/* Operator Carousel chooser */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Destination Partner</label>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
                  {users.map((u, index) => (
                    <button
                      key={u.id}
                      id={`btn-select-transfer-partner-${index}`}
                      type="button"
                      onClick={() => setReceiverIdx(index)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all transition-colors shrink-0 ${
                        receiverIdx === index 
                          ? 'bg-indigo-650/15 border-indigo-500/40 text-white' 
                          : 'bg-slate-950/40 border-transparent hover:bg-slate-900 hover:text-slate-200 text-slate-400'
                      }`}
                    >
                      <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-800" />
                      <span className="text-[10px] font-medium truncate max-w-[64px] block mb-0.5 leading-none">{u.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount input */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Credit Amount</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 text-xs">$</span>
                    <input
                      id="transfer-amount-input"
                      type="number"
                      required
                      placeholder="0.00"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white pl-7 pr-3 py-2.5 transition-all font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Category Allocation</label>
                  <select
                    id="transfer-category-selector"
                    value={transferCategory}
                    onChange={(e) => setTransferCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white p-2.5 cursor-pointer font-sans"
                  >
                    <option value="Cloud Compute Network">Cloud Compute</option>
                    <option value="API Rate limits">API limits</option>
                    <option value="Database Cluster R&D">Database R&D</option>
                    <option value="Node Scale operations">Scale operations</option>
                  </select>
                </div>
              </div>

              {/* Action and feedback */}
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <button
                  id="btn-trigger-money-transfer"
                  type="submit"
                  disabled={isProcessingTransfer}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xl hover:shadow-emerald-500/5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessingTransfer ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Despatching credit packets...
                    </>
                  ) : (
                    <>
                     <Send className="w-3.5 h-3.5" /> Execute Despatch Transfer
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {transferSuccess && (
                     <motion.div
                       initial={{ opacity: 0, y: 5 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: 5 }}
                       className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10.5px] text-emerald-400 flex items-center gap-2"
                     >
                       <CheckCircle className="w-4 h-4 shrink-0" />
                       Transfer complete! Transferred packet added to core ledger.
                     </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </form>
          )}

        </motion.div>

      </div>

      {/* RIGHT 2 COLS: Ledger Book Table */}
      <div className="space-y-6 lg:col-span-2">
        <motion.div 
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="glass-panel p-6 rounded-2xl space-y-4"
          id="billing-ledger-ledger-panel"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold text-base text-white">Central Ledger System</h3>
              <p className="text-xs text-slate-500 mt-0.5">Audit log of system purchases and transfers.</p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="absolute inset-y-0 left-2.5 my-auto w-3.5 h-3.5 text-slate-500" />
                <input
                  id="ledger-search-input-field"
                  type="text"
                  placeholder="Filter txns..."
                  value={txnSearch}
                  onChange={(e) => setTxnSearch(e.target.value)}
                  className="bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-[11px] text-white pl-8 pr-3 py-1.5 transition-all max-w-[140px]"
                />
              </div>

              <select
                id="ledger-status-filter-selectbox"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 text-[11px] text-slate-350 rounded-xl px-2 py-1.5 cursor-pointer max-w-[130px] font-semibold"
              >
                <option value="All">All statuses</option>
                {Object.values(TransactionStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-900">
            <table className="w-full text-left border-collapse text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/40 text-slate-500 font-mono text-[9.5px] uppercase tracking-wider">
                  <th className="px-5 py-3 font-semibold">Consignor</th>
                  <th className="px-5 py-3 font-semibold">Ledger ID / Date</th>
                  <th className="px-5 py-3 font-semibold">Budget Category</th>
                  <th className="px-5 py-3 font-semibold">Terminal Ref</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Transfer Sum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/40">
                {filteredTxns.length > 0 ? (
                  filteredTxns.map((t) => {
                    const isSuccess = t.status === TransactionStatus.SUCCESS;
                    const isPending = t.status === TransactionStatus.PENDING;
                    
                    return (
                      <tr key={t.id} className="hover:bg-slate-900/10 transition-colors">
                        
                        {/* Partner Consignor */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <img src={t.userAvatar} alt="" className="w-7 h-7 rounded-full object-cover border border-slate-800 shrink-0" />
                            <span className="font-semibold text-white truncate max-w-[100px] block">{t.userName}</span>
                          </div>
                        </td>

                        {/* ID & Date */}
                        <td className="px-5 py-3.5">
                          <p className="font-mono text-[10.5px] font-bold text-slate-300 leading-none">{t.id}</p>
                          <span className="text-[9.5px] text-slate-500 font-mono block mt-1">{t.date}</span>
                        </td>

                        {/* Allocation */}
                        <td className="px-5 py-3.5 font-sans text-slate-300 truncate max-w-[124px]">
                          {t.category}
                        </td>

                        {/* Card Ref last 4 */}
                        <td className="px-5 py-3.5 font-mono text-[10px] text-slate-400">
                          •••• {t.cardLast4}
                        </td>

                        {/* Status Badge */}
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono leading-none ${
                            isSuccess ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' :
                            isPending ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' :
                            'bg-rose-500/10 text-rose-400 border border-rose-500/15'
                          }`}>
                            {t.status}
                          </span>
                        </td>

                        {/* Transfer amount */}
                        <td className="px-5 py-3.5 text-right">
                          <span className={`font-mono font-bold ${
                            isSuccess ? 'text-white' : 'text-slate-500'
                          }`}>
                            ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500 font-sans">
                      No matching transfer entries located in the local ledger database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-3 text-left">
              <p className="text-[9px] font-mono text-slate-550 uppercase">CONSOLIDATED ASSETS</p>
              <p className="text-base font-display font-semibold text-white mt-0.5">$394,402.00</p>
            </div>
            
            <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-3 text-left">
              <p className="text-[9px] font-mono text-slate-550 uppercase">TOTAL CLEARED OUTFLOW</p>
              <p className="text-base font-display font-semibold text-rose-400 mt-0.5">$21,324.50</p>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-900/60 border border-slate-850 rounded-xl p-3 text-left flex flex-col justify-center">
              <p className="text-[9px] font-mono text-slate-550 uppercase">SYSTEM TAX RATE FEE</p>
              <p className="text-base font-display font-semibold text-emerald-400 mt-0.5">0.02% <span className="text-[9px] font-mono font-normal text-slate-500">standard</span></p>
            </div>
          </div>

        </motion.div>
      </div>

    </div>
  );
}
