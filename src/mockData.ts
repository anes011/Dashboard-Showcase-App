/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, UserRole, UserStatus, Transaction, TransactionStatus, Campaign, CampaignStatus, StatItem } from './types';

export const initialStats: StatItem[] = [
  {
    title: 'Total Monthly Revenue',
    value: '$142,384.50',
    change: 14.2,
    changeType: 'increase',
    timeframe: 'vs last month',
    sparkline: [120, 125, 122, 131, 128, 135, 142]
  },
  {
    title: 'Active Platform Users',
    value: '18,492',
    change: 8.5,
    changeType: 'increase',
    timeframe: 'vs last week',
    sparkline: [16.2, 16.8, 17.1, 17.5, 17.9, 18.2, 18.492]
  },
  {
    title: 'Conversion Average Rate',
    value: '3.42%',
    change: -1.8,
    changeType: 'decrease',
    timeframe: 'vs last month',
    sparkline: [3.55, 3.52, 3.49, 3.44, 3.46, 3.40, 3.42]
  },
  {
    title: 'Active Marketing Ad Spend',
    value: '$8,420.00',
    change: 4.2,
    changeType: 'increase',
    timeframe: 'vs yesterday',
    sparkline: [7.8, 8.0, 8.1, 8.3, 8.2, 8.35, 8.42]
  }
];

export const initialUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Sarah Connor',
    email: 'sarah.c@skyline.io',
    role: UserRole.ADMIN,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    status: UserStatus.ACTIVE,
    joinDate: '2023-01-15',
    spent: 12500
  },
  {
    id: 'USR-002',
    name: 'David Lightman',
    email: 'wargames@norad.gov',
    role: UserRole.MANAGER,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    status: UserStatus.ACTIVE,
    joinDate: '2023-03-22',
    spent: 8900
  },
  {
    id: 'USR-003',
    name: 'Elliot Alderson',
    email: 'fsociety@mrrobot.net',
    role: UserRole.MEMBER,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    status: UserStatus.ACTIVE,
    joinDate: '2024-05-10',
    spent: 4500
  },
  {
    id: 'USR-004',
    name: 'Trinity Knight',
    email: 'trinity@zion.org',
    role: UserRole.MEMBER,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    status: UserStatus.IDLE,
    joinDate: '2024-02-18',
    spent: 6200
  },
  {
    id: 'USR-005',
    name: 'Miles Dyson',
    email: 'miles.dyson@cyberdyne.global',
    role: UserRole.VIEWER,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    status: UserStatus.OFFLINE,
    joinDate: '2023-11-04',
    spent: 1200
  },
  {
    id: 'USR-006',
    name: 'Suzuha Amane',
    email: 'suzuha@divergence.net',
    role: UserRole.MEMBER,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    status: UserStatus.OFFLINE,
    joinDate: '2025-06-01',
    spent: 3200
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'TXN-9021',
    userName: 'Trinity Knight',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    category: 'Cloud Servers',
    date: '2026-06-09 22:30',
    amount: 1420.00,
    status: TransactionStatus.SUCCESS,
    cardLast4: '4392'
  },
  {
    id: 'TXN-9022',
    userName: 'Sarah Connor',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    category: 'API Usage Rate',
    date: '2026-06-09 18:45',
    amount: 3254.50,
    status: TransactionStatus.SUCCESS,
    cardLast4: '8841'
  },
  {
    id: 'TXN-9023',
    userName: 'Elliot Alderson',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    category: 'SaaS License',
    date: '2026-06-08 14:12',
    amount: 150.00,
    status: TransactionStatus.PENDING,
    cardLast4: '1021'
  },
  {
    id: 'TXN-9024',
    userName: 'David Lightman',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    category: 'WOPR Cloud Compute',
    date: '2026-06-07 11:05',
    amount: 12450.00,
    status: TransactionStatus.FAILED,
    cardLast4: '7721'
  },
  {
    id: 'TXN-9025',
    userName: 'Miles Dyson',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    category: 'Neural Processor R&D',
    date: '2026-06-05 09:20',
    amount: 4500.00,
    status: TransactionStatus.SUCCESS,
    cardLast4: '9905'
  }
];

export const initialCampaigns: Campaign[] = [
  {
    id: 'CMP-001',
    name: 'Summer Developer Booster',
    budget: 15000,
    spent: 12450,
    reach: 125000,
    conversions: 4230,
    cpc: 2.94,
    status: CampaignStatus.RUNNING,
    platform: 'Google'
  },
  {
    id: 'CMP-002',
    name: 'SaaS Black Friday Hype',
    budget: 35000,
    spent: 35000,
    reach: 480000,
    conversions: 18920,
    cpc: 1.85,
    status: CampaignStatus.COMPLETED,
    platform: 'Facebook'
  },
  {
    id: 'CMP-003',
    name: 'Enterprise Referral Pitch',
    budget: 10000,
    spent: 4200,
    reach: 22000,
    conversions: 840,
    cpc: 5.00,
    status: CampaignStatus.RUNNING,
    platform: 'LinkedIn'
  },
  {
    id: 'CMP-004',
    name: 'Cloud Security Masterclass',
    budget: 5000,
    spent: 4820,
    reach: 95000,
    conversions: 2110,
    cpc: 2.28,
    status: CampaignStatus.RUNNING,
    platform: 'Twitter'
  },
  {
    id: 'CMP-005',
    name: 'Next-Gen Cyber Hackathon',
    budget: 12000,
    spent: 1000,
    reach: 34000,
    conversions: 620,
    cpc: 1.61,
    status: CampaignStatus.PAUSED,
    platform: 'TikTok'
  }
];

export const chartRevenueData = [
  { name: 'Jan', revenue: 94000, target: 80000, users: 12000 },
  { name: 'Feb', revenue: 105000, target: 85000, users: 13400 },
  { name: 'Mar', revenue: 102000, target: 90000, users: 13900 },
  { name: 'Apr', revenue: 125000, target: 100000, users: 15200 },
  { name: 'May', revenue: 131000, target: 110000, users: 16800 },
  { name: 'Jun', revenue: 142384, target: 115000, users: 18492 }
];

export const trafficSourceData = [
  { name: 'Organic Search', value: 45, color: '#6366f1' }, // indigo-500
  { name: 'Direct Traffic', value: 25, color: '#3b82f6' }, // blue-500
  { name: 'Paid Campaigns', value: 18, color: '#10b981' }, // emerald-500
  { name: 'Social Networks', value: 12, color: '#eab308' }  // yellow-500
];

export const systemActivityLogs = [
  { id: 'ACT-1', user: 'Sarah Connor', action: 'Approved transaction TXN-9022', time: '12 mins ago', type: 'security' },
  { id: 'ACT-2', user: 'System Auto-Scale', action: 'Scaled web pods to 8 instances', time: '42 mins ago', type: 'system' },
  { id: 'ACT-3', user: 'Elliot Alderson', action: 'Created new API key "fsociety_main"', time: '2 hours ago', type: 'developer' },
  { id: 'ACT-4', user: 'David Lightman', action: 'Updated campaign CMP-003 budget', time: '5 hours ago', type: 'settings' }
];
