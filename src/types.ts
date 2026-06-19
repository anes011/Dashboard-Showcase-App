/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  MEMBER = 'Member',
  VIEWER = 'Viewer'
}

export enum UserStatus {
  ACTIVE = 'Active',
  IDLE = 'Idle',
  OFFLINE = 'Offline'
}

export enum TransactionStatus {
  SUCCESS = 'Success',
  PENDING = 'Pending',
  FAILED = 'Failed'
}

export enum CampaignStatus {
  RUNNING = 'Running',
  PAUSED = 'Paused',
  COMPLETED = 'Completed'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: UserStatus;
  joinDate: string;
  spent: number;
}

export interface Transaction {
  id: string;
  userName: string;
  userAvatar: string;
  category: string;
  date: string;
  amount: number;
  status: TransactionStatus;
  cardLast4: string;
}

export interface Campaign {
  id: string;
  name: string;
  budget: number;
  spent: number;
  reach: number;
  conversions: number;
  cpc: number;
  status: CampaignStatus;
  platform: 'Google' | 'Facebook' | 'LinkedIn' | 'Twitter' | 'TikTok';
}

export interface StatItem {
  title: string;
  value: string;
  change: number; // percentage, e.g. +12.4
  changeType: 'increase' | 'decrease' | 'neutral';
  timeframe: string;
  sparkline: number[];
}

export type ActiveTab = 'dashboard' | 'users' | 'finance' | 'marketing' | 'settings';
