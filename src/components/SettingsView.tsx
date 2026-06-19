/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings as GearIcon, 
  User as UserIcon, 
  Key, 
  Copy, 
  Check, 
  Trash2, 
  RefreshCcw, 
  Sliders, 
  Sparkles, 
  Database,
  Moon,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsViewProps {
  currentRole: string;
}

interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  created: string;
}

export default function SettingsView({ currentRole }: SettingsViewProps) {
  // Simple operator details state
  const [operatorName, setOperatorName] = useState('Anes Bibo');
  const [operatorEmail, setOperatorEmail] = useState('anesbibo03@gmail.com');
  const [systemSyncHost, setSystemSyncHost] = useState('https://test-ingress-v2.main');

  // Custom styling settings state
  const [glowIntensity, setGlowIntensity] = useState<'subtle' | 'standard' | 'overglow'>('standard');
  const [accentHue, setAccentHue] = useState<'indigo' | 'purple' | 'emerald'>('indigo');
  const [enableCompactSidebar, setEnableCompactSidebar] = useState(false);

  // Mock API keys state
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    { id: 'key-1', name: 'Fsociety Crawler Client', key: 'aes_live_df9a0c1097eef84bcda', created: '2026-06-01' },
    { id: 'key-2', name: 'Web Analytics Webhook', key: 'aes_live_c10bf28da903befcb11', created: '2026-06-08' }
  ]);
  
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const handleGenerateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyLabel) return;

    // Generate standard mock hash
    const generatedHash = `aes_live_${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
    const newEntry: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyLabel,
      key: generatedHash,
      created: new Date().toISOString().split('T')[0]
    };

    setApiKeys([newEntry, ...apiKeys]);
    setNewKeyLabel('');
  };

  const handleCopyKey = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleRevokeKey = (id: string) => {
    if (confirm('Revoke this API Key? Clients utilizing this token will fail immediately.')) {
      setApiKeys(apiKeys.filter(k => k.id !== id));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-left">
      
      {/* LEFT 2 COLS: Profile settings & style sliders */}
      <div className="space-y-6 lg:col-span-2">
        
        {/* Settings Module */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl space-y-6"
          id="settings-profile-panel"
        >
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-indigo-400" />
            <h3 className="font-display font-semibold text-sm text-white">Operator Profile Configuration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-wider text-slate-400">OPERATOR NAME</label>
              <input
                id="settings-operator-name-input"
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white px-3.5 py-2.5 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-wider text-slate-400">OPERATOR BUSINESS EMAIL</label>
              <input
                id="settings-operator-email-input"
                type="email"
                value={operatorEmail}
                onChange={(e) => setOperatorEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white px-3.5 py-2.5 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-wider text-slate-400">INTEGRITY DOMAIN HOST</label>
              <input
                id="settings-operator-host-input"
                type="text"
                value={systemSyncHost}
                onChange={(e) => setSystemSyncHost(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white px-3.5 py-2.5 transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-wider text-slate-400">DASHBOARD PRIVILEGE LEVEL</label>
              <div className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-indigo-400 font-mono font-bold select-none">
                {currentRole} STATUS
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-900 flex justify-end">
            <button
              id="btn-settings-save-operator"
              onClick={() => alert('Operator profile configs saved successfully!')}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/5 transition-all select-none cursor-pointer"
            >
              Commit Profile Changes
            </button>
          </div>
        </motion.div>

        {/* Visual Styling options */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-2xl space-y-6"
          id="settings-visualizer-customizer"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <h3 className="font-display font-semibold text-sm text-white">Visual Customization Board</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Glow settings */}
            <div className="space-y-3">
              <span className="text-[10.5px] font-mono text-slate-450 uppercase block">CONSOLE RADIATIVE GLOW</span>
              
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900 border border-slate-850 rounded-xl">
                {(['subtle', 'standard', 'overglow'] as const).map((g) => (
                  <button
                    key={g}
                    id={`btn-glow-level-${g}`}
                    onClick={() => setGlowIntensity(g)}
                    className={`py-1.5 rounded-lg text-[10px] font-sans font-bold uppercase transition-all ${
                      glowIntensity === g 
                        ? 'bg-indigo-950/40 text-indigo-350 border border-indigo-500/30' 
                        : 'text-slate-500 hover:text-white border border-transparent'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Hue selector */}
            <div className="space-y-3">
              <span className="text-[10.5px] font-mono text-slate-450 uppercase block">TERMINAL COLOR PALETTE</span>
              
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900 border border-slate-850 rounded-xl">
                {(['indigo', 'purple', 'emerald'] as const).map((color) => (
                  <button
                    key={color}
                    id={`btn-hue-color-${color}`}
                    onClick={() => setAccentHue(color)}
                    className={`py-1.5 rounded-lg text-[10px] font-sans font-bold uppercase transition-all ${
                      accentHue === color 
                        ? 'bg-indigo-950/40 text-indigo-350 border border-indigo-500/30' 
                        : 'text-slate-500 hover:text-white border border-transparent'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="pt-2 border-t border-slate-900/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Visual styling preferences stored locally</span>
            <button
               id="btn-restore-defaults"
               onClick={() => {
                 setGlowIntensity('standard');
                 setAccentHue('indigo');
                 alert('Aesthetic presets reset to baseline');
               }}
               className="text-indigo-400 hover:text-indigo-300 font-bold"
            >
              Reset Prefs
            </button>
          </div>
        </motion.div>

      </div>

      {/* RIGHT 1 COL: API credentials */}
      <div className="space-y-6 lg:col-span-1">
        
        {/* Token manager panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="glass-panel p-5 rounded-2xl flex flex-col justify-between"
          id="settings-tokens-box"
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400 shrink-0" />
                <h3 className="font-display font-semibold text-sm text-white">OAuth & Service Tokens</h3>
              </div>
              <p className="text-[11px] text-slate-550 mt-1">
                Establish and copy API validation keys. Keep keys private.
              </p>
            </div>

            {/* Quick Generator form */}
            <form onSubmit={handleGenerateApiKey} className="space-y-2 pt-2 border-t border-slate-900">
              <label className="text-[10px] font-mono tracking-wider text-slate-450 uppercase block">TOKEN DESCRIPTION LABEL</label>
              <div className="flex gap-2">
                <input
                  id="settings-api-label-input"
                  type="text"
                  required
                  placeholder="e.g. Analytics core"
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white px-3.5 py-1.5 transition-all"
                />
                <button
                  id="btn-generate-api-key"
                  type="submit"
                  className="px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs shrink-0 select-none cursor-pointer"
                  title="Generate Token"
                >
                  Create
                </button>
              </div>
            </form>

            {/* List of active keys */}
            <div className="space-y-2.5 pt-4 border-t border-slate-900">
              <p className="text-[10px] font-mono tracking-wider font-bold text-slate-500 uppercase">ACTIVE ACCESS KEYS ({apiKeys.length})</p>
              
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {apiKeys.length > 0 ? (
                  apiKeys.map((key) => {
                    const isCopied = copiedKeyId === key.id;
                    return (
                      <div 
                        key={key.id} 
                        className="bg-slate-905 border border-slate-850 p-3 rounded-xl flex items-center justify-between gap-3 text-left"
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="text-xs font-semibold text-white truncate">{key.name}</p>
                          <p className="font-mono text-[9px] text-slate-500 truncate select-all">{key.key}</p>
                          <span className="text-[9px] text-slate-600 block mt-1 font-mono">Issued: {key.created}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 z-10">
                          {/* Copy button with check animation */}
                          <button
                            id={`settings-copy-btn-${key.id}`}
                            onClick={() => handleCopyKey(key.id, key.key)}
                            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                              isCopied 
                                ? 'bg-emerald-950/20 border-emerald-800 text-emerald-400' 
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                            title="Copy key value to clipboard"
                          >
                            {isCopied ? <Check className="w-3" /> : <Copy className="w-3" />}
                          </button>
                          
                          {/* Revoke button */}
                          <button
                            id={`settings-revoke-btn-${key.id}`}
                            onClick={() => handleRevokeKey(key.id)}
                            className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/40 flex items-center justify-center transition-all"
                            title="Revoke and cancel token"
                          >
                            <Trash2 className="w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center py-4 text-xs text-slate-500 font-sans">No keys configured.</p>
                )}
              </div>
            </div>
            
          </div>

          <div className="border-t border-slate-905 pt-5 text-left bg-indigo-950/10 border border-indigo-500/10 p-3.5 rounded-xl mt-4 flex gap-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold leading-none text-indigo-400 uppercase">CONSOLE ADVISORY</span>
              <p className="text-[9.5px] text-slate-450 leading-normal font-sans">
                Keys provide terminal access to cluster operations. Revoke tokens immediately if keys are leaked or compromised.
              </p>
            </div>
          </div>
        </motion.div>

      </div>

    </div>
  );
}
