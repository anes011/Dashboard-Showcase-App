/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Percent, 
  Activity, 
  Layers, 
  Cpu, 
  HardDrive, 
  CheckCircle,
  HelpCircle,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { StatItem, User, Campaign, Transaction } from '../types';
import { chartRevenueData, trafficSourceData, systemActivityLogs } from '../mockData';

interface DashboardViewProps {
  stats: StatItem[];
  users: User[];
  campaigns: Campaign[];
  transactions: Transaction[];
  onNavigate: (tab: string) => void;
}

export default function DashboardView({ stats, users, campaigns, transactions, onNavigate }: DashboardViewProps) {
  const [chartMetric, setChartMetric] = useState<'revenue' | 'users'>('revenue');
  const [chartTimeframe, setChartTimeframe] = useState<'hourly' | 'weekly' | 'monthly'>('monthly');

  // Sparkline mini SVG Renderer
  const renderSparkline = (points: number[], colorClass: string) => {
    const maxVal = Math.max(...points);
    const minVal = Math.min(...points);
    const range = maxVal - minVal || 1;
    const width = 100;
    const height = 40;
    
    const svgPoints = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - minVal) / range) * (height - 4) - 2;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-24 h-10 select-none pb-1" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          className={colorClass}
          points={svgPoints}
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        {stats.map((stat, i) => {
          const isUp = stat.changeType === 'increase';
          const isDown = stat.changeType === 'decrease';
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700/80 hover:bg-slate-900/20 transition-all cursor-default group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-[11px] font-sans font-medium uppercase tracking-wider">{stat.title}</p>
                  <p className="text-2xl font-display font-semibold text-white mt-1 group-hover:text-indigo-250 transition-colors">
                    {stat.value}
                  </p>
                </div>
                
                <div className={`p-2 rounded-xl border ${
                  i === 0 ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                  i === 1 ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                  i === 2 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  {i === 0 && <DollarSign className="w-4 h-4" />}
                  {i === 1 && <Users className="w-4 h-4" />}
                  {i === 2 && <Percent className="w-4 h-4" />}
                  {i === 3 && <Activity className="w-4 h-4" />}
                </div>
              </div>

              <div className="flex items-end justify-between mt-6">
                <div className="flex flex-col">
                  <span className={`inline-flex items-center gap-1 text-xs font-mono font-bold ${
                    isUp ? 'text-emerald-400' : isDown ? 'text-rose-400' : 'text-slate-400'
                  }`}>
                    {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : isDown ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                    {isUp ? '+' : ''}{stat.change}%
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 font-sans">
                    {stat.timeframe}
                  </span>
                </div>

                {/* Sparkling mini chart */}
                <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                  {renderSparkline(
                    stat.sparkline, 
                    isUp ? 'text-emerald-500' : isDown ? 'text-rose-500' : 'text-indigo-400'
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 2. Main Performance Chart Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Main graph */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-2xl glass-panel-glow lg:col-span-2 space-y-6"
          id="main-fiancial-chart-panel"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <h3 className="font-display font-semibold text-sm text-white">Consolidated Enterprise Metrics</h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Visualizing system revenues, projection lines, and active user registrations.
              </p>
            </div>

            {/* Graphic controls */}
            <div className="flex items-center gap-3">
              {/* Metric Select */}
              <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
                <button
                  id="dashboard-metric-toggle-revenue"
                  onClick={() => setChartMetric('revenue')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-sans font-bold uppercase tracking-wider transition-all ${
                    chartMetric === 'revenue' 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Revenue
                </button>
                <button
                  id="dashboard-metric-toggle-users"
                  onClick={() => setChartMetric('users')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-sans font-bold uppercase tracking-wider transition-all ${
                    chartMetric === 'users' 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Active Users
                </button>
              </div>

              {/* Timeframes */}
              <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
                {(['hourly', 'weekly', 'monthly'] as const).map((t) => (
                  <button
                    key={t}
                    id={`dashboard-timeframe-toggle-${t}`}
                    onClick={() => setChartTimeframe(t)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-mono transition-all ${
                      chartTimeframe === t
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-500 hover:text-white border border-transparent'
                    }`}
                  >
                    {t.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Core Chart Render Panel */}
          <div className="h-80 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              {chartMetric === 'revenue' ? (
                <AreaChart data={chartRevenueData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#475569" 
                    fontSize={10} 
                    fontFamily="var(--font-mono)" 
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={10} 
                    fontFamily="var(--font-mono)"
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#020617', 
                      borderColor: '#1e293b', 
                      borderRadius: '12px',
                      color: 'white',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Completed Invoiced Revenue"
                    stroke="#6366f1" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="target" 
                    name="Original Baseline Target"
                    stroke="#06b6d4" 
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    fillOpacity={1} 
                    fill="url(#colorTarget)" 
                  />
                </AreaChart>
              ) : (
                <BarChart data={chartRevenueData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} fontFamily="var(--font-mono)" />
                  <YAxis stroke="#475569" fontSize={10} fontFamily="var(--font-mono)" tickFormatter={(value) => value.toLocaleString()} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="users" name="Active Subscribers" fill="#a855f7" radius={[4, 4, 0, 0]}>
                    {chartRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 5 ? '#a855f7' : '#6366f1'} opacity={index === 5 ? 1 : 0.75} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Current Revenue Segment
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-dotted border-t border-indigo-400"></span> Target Path Projection
              </span>
            </div>
            <p>Data refreshed: Real-time telemetry connection is stable</p>
          </div>
        </motion.div>

        {/* Right 1 Col: Traffic source donut */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="glass-panel p-6 rounded-2xl flex flex-col justify-between"
          id="traffic-donut-panel"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <h3 className="font-display font-semibold text-sm text-white">Acquisition Sources</h3>
              </div>
              <HelpCircle className="w-3.5 h-3.5 text-slate-500 hover:text-white cursor-pointer" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Device & channel distribution.</p>
          </div>

          {/* Pie Chart display */}
          <div className="h-44 w-full relative flex items-center justify-center my-4 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={78}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Centered overall label */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-display font-semibold text-xl text-white">100%</span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">Channel Score</span>
            </div>
          </div>

          {/* Legends */}
          <div className="space-y-2">
            {trafficSourceData.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: channel.color }}></span>
                  <span className="truncate">{channel.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{channel.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* 3. Bottom Row: System monitor panels and Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 1 Col: Cyber System Monitor */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-2xl flex flex-col justify-between"
          id="system-telemetry-status-panel"
        >
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h3 className="font-display font-semibold text-sm text-white">Service Health Matrix</h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Live core container reports.</p>
          </div>

          <div className="space-y-4 my-6">
            {/* CPU Unit */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Node API Load (v8 thread)</span>
                <span className="text-white">42%</span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            {/* Storage Drive */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Memory (SSD Pool allocation)</span>
                <span className="text-white">68%</span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            {/* Network load */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Network Ingress Throughput</span>
                <span className="text-white">12.5 MB/s</span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full status-pulse-green" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-3 flex items-center justify-between text-[10px] font-mono text-emerald-400">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> All Services Nominal
            </span>
            <span className="text-slate-600">Response: 14ms</span>
          </div>
        </motion.div>

        {/* Right 2 Cols: Activity Logs and critical actions */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-4"
          id="system-activity-logs"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="font-display font-semibold text-sm text-white">System Activity Stream</h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Audit logs of the past 24 hours.</p>
            </div>

            <button 
              id="dashboard-activity-stream-open-management"
              onClick={() => onNavigate('users')}
              className="px-3 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 rounded-xl text-[10px] font-medium text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Manage Users <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 font-medium">User Account</th>
                  <th className="py-2.5 font-medium">Action Event</th>
                  <th className="py-2.5 font-medium">Interval Time</th>
                  <th className="py-2.5 font-medium text-right">Trigger Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 font-sans">
                {systemActivityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 font-semibold text-white">{log.user}</td>
                    <td className="py-3 text-slate-300">
                      <span className="truncate max-w-xs block">{log.action}</span>
                    </td>
                    <td className="py-3 text-slate-500 font-mono text-[10px]">{log.time}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-mono leading-none ${
                        log.type === 'security' ? 'bg-indigo-950/20 text-indigo-400 border border-indigo-500/20' :
                        log.type === 'system' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/10' :
                        log.type === 'developer' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/15' :
                        'bg-rose-500/10 text-rose-300 border border-rose-500/15'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>

    </div>
  );
}
