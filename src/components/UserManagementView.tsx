/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  X, 
  Mail, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Calendar,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, UserRole, UserStatus } from '../types';

interface UserManagementViewProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'joinDate'>) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

const mockAvatarsList = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
];

export default function UserManagementView({ users, onAddUser, onEditUser, onDeleteUser }: UserManagementViewProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | UserRole>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | UserStatus>('All');
  
  // Custom Addition Drawer state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.MEMBER);
  const [newStatus, setNewStatus] = useState<UserStatus>(UserStatus.ACTIVE);
  const [selectedAvatar, setSelectedAvatar] = useState(mockAvatarsList[0]);
  const [newSpent, setNewSpent] = useState('0');

  // Editing state
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Filters logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    onAddUser({
      name: newName,
      email: newEmail,
      role: newRole,
      avatar: selectedAvatar,
      status: newStatus,
      spent: Number(newSpent) || 0
    });

    // Reset Form
    setNewName('');
    setNewEmail('');
    setNewRole(UserRole.MEMBER);
    setNewStatus(UserStatus.ACTIVE);
    setNewSpent('0');
    setShowAddModal(false);
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    onEditUser(editingUser);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6" id="user-management-panel">
      
      {/* Search Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-lg text-white">Platform Directory Console</h2>
          <p className="text-xs text-slate-500 mt-0.5">Filter, configure, or register user accounts in the domain.</p>
        </div>

        <button
          id="btn-register-new-user"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xl hover:shadow-indigo-500/10 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Register New Account
        </button>
      </div>

      {/* Filtering Filters Row */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Table Search bar */}
        <div className="relative w-full md:max-w-xs shrink-0">
          <Search className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-slate-500" />
          <input
            id="user-table-search-input"
            type="text"
            placeholder="Search accounts by name/email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white pl-9 pr-4 py-2 transition-all font-sans"
          />
        </div>

        {/* Categories togglers */}
        <div className="flex flex-wrap items-center gap-3 w-full justify-start md:justify-end">
          
          {/* Role selector dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-2 py-1 rounded-xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase px-1">Role:</span>
            <select
              id="user-role-filter-dropdown"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="bg-transparent text-xs text-white focus:outline-none font-semibold cursor-pointer pr-1"
            >
              <option value="All">All Roles</option>
              {Object.values(UserRole).map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Status selector dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-2 py-1 rounded-xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase px-1">Status:</span>
            <select
              id="user-status-filter-dropdown"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-xs text-white focus:outline-none font-semibold cursor-pointer pr-1"
            >
              <option value="All">All statuses</option>
              {Object.values(UserStatus).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            Filtered: <strong>{filteredUsers.length}</strong> / {users.length}
          </span>
        </div>
      </div>

      {/* Main Table render block */}
      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto border border-slate-800">
        <table className="w-full text-left border-collapse text-xs min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Account Identity</th>
              <th className="px-6 py-4 font-semibold">Security Role</th>
              <th className="px-6 py-4 font-semibold">Connection Status</th>
              <th className="px-6 py-4 font-semibold font-mono">Reg. Date</th>
              <th className="px-6 py-4 font-semibold text-right">LTD Contribution</th>
              <th className="px-6 py-4 font-semibold text-center">Operation Settings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/40">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => {
                const isOnline = u.status === UserStatus.ACTIVE;
                const isIdle = u.status === UserStatus.IDLE;
                
                return (
                  <tr key={u.id} className="hover:bg-slate-900/10 transition-colors">
                    
                    {/* User profile detail details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-800" />
                        <div className="min-w-0">
                          <p className="font-display font-medium text-xs text-white leading-tight truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-sans leading-none truncate">
                            <Mail className="w-3 h-3 text-slate-600 shrink-0" /> {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-xl text-[10px] font-medium ${
                        u.role === UserRole.ADMIN ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                        u.role === UserRole.MANAGER ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                        u.role === UserRole.MEMBER ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-slate-800/50 text-slate-400 border border-slate-700/50'
                      }`}>
                        {u.role === UserRole.ADMIN ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        {u.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          isOnline ? 'bg-emerald-500 status-pulse-green' : 
                          isIdle ? 'bg-amber-400' : 'bg-slate-600'
                        }`}></span>
                        <span className="text-slate-300 font-mono text-[11px] leading-none shrink-0">{u.status}</span>
                      </span>
                    </td>

                    {/* Join Date */}
                    <td className="px-6 py-4 text-slate-500 font-mono text-[10.5px]">
                      {u.joinDate}
                    </td>

                    {/* Lifetime spent contribution */}
                    <td className="px-6 py-4 text-right font-mono font-bold text-white">
                      ${u.spent.toLocaleString()}
                    </td>

                    {/* Actions panel */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          id={`btn-edit-user-${u.id}`}
                          onClick={() => setEditingUser(u)}
                          className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:text-white text-slate-400 flex items-center justify-center transition-colors shrink-0"
                          title="Edit user parameters"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-delete-user-${u.id}`}
                          onClick={() => {
                            if (confirm(`Confirm deletion of user account: ${u.name}?`)) {
                              onDeleteUser(u.id);
                            }
                          }}
                          className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-rose-950/40 hover:border-rose-800 border border-slate-850 hover:text-rose-400 text-slate-400 flex items-center justify-center transition-colors shrink-0"
                          title="Delete account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-500 font-sans">
                  No registered members match the active consoles criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Drawer modal: Add New Account */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md p-6 overflow-hidden shadow-2xl glass-panel text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-400" />
                  <span className="font-display font-semibold text-sm text-white">Create Domain Account</span>
                </div>
                <button
                  id="btn-close-register-modal"
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Add form */}
              <form onSubmit={handleCreateUserSubmit} className="mt-4 space-y-4">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Account Name</label>
                  <input
                    id="add-user-name-input"
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white px-3.5 py-2.5 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Email Address</label>
                  <input
                    id="add-user-email-input"
                    type="email"
                    required
                    placeholder="Enter business email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white px-3.5 py-2.5 transition-all"
                  />
                </div>

                {/* Role and status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Initial Privilege</label>
                    <select
                      id="add-user-role-selector"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as UserRole)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white p-2.5 cursor-pointer"
                    >
                      {Object.values(UserRole).map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Connection Status</label>
                    <select
                      id="add-user-status-selector"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as UserStatus)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white p-2.5 cursor-pointer"
                    >
                      {Object.values(UserStatus).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* LTD Spends */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-400" /> Lifetime spend contribution
                  </label>
                  <input
                    id="add-user-spent-input"
                    type="number"
                    value={newSpent}
                    onChange={(e) => setNewSpent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white px-3.5 py-2.5 transition-all font-mono"
                  />
                </div>

                {/* Avatar selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block">Assign Cyber Persona (Avatar)</label>
                  <div className="flex items-center gap-3.5">
                    {mockAvatarsList.map((avatarUrl, idx) => (
                      <button
                        key={idx}
                        id={`btn-select-avatar-${idx}`}
                        type="button"
                        onClick={() => setSelectedAvatar(avatarUrl)}
                        className={`w-9 h-9 rounded-xl overflow-hidden shrink-0 transition-transform ${
                          selectedAvatar === avatarUrl 
                            ? 'ring-2 ring-indigo-500 scale-105' 
                            : 'opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-900 flex items-center justify-end gap-3">
                  <button
                    id="btn-cancel-register"
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold select-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-confirm-register"
                    type="submit"
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/10 cursor-pointer"
                  >
                    Complete Registration
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Edit Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md p-6 overflow-hidden shadow-2xl glass-panel text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <span className="font-display font-semibold text-sm text-white flex items-center gap-1.5">
                  Modify Account: <strong>{editingUser.name}</strong>
                </span>
                <button
                  id="btn-close-edit-modal"
                  onClick={() => setEditingUser(null)}
                  className="w-7 h-7 bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Edit form */}
              <form onSubmit={handleEditUserSubmit} className="mt-4 space-y-4">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Full Account Holder Name</label>
                  <input
                    id="edit-user-name-input"
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white px-3.5 py-2.5 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Active Email Address</label>
                  <input
                    id="edit-user-email-input"
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white px-3.5 py-2.5 transition-all"
                  />
                </div>

                {/* Role and status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Privilege Level</label>
                    <select
                      id="edit-user-role-selector"
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white p-2.5 cursor-pointer"
                    >
                      {Object.values(UserRole).map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Operational Status</label>
                    <select
                      id="edit-user-status-selector"
                      value={editingUser.status}
                      onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as UserStatus })}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white p-2.5 cursor-pointer"
                    >
                      {Object.values(UserStatus).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Spent */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Lifetime Contribution</label>
                  <input
                    id="edit-user-spent-input"
                    type="number"
                    value={editingUser.spent}
                    onChange={(e) => setEditingUser({ ...editingUser, spent: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white px-3.5 py-2.5 transition-all font-mono"
                  />
                </div>

                <div className="pt-4 border-t border-slate-900 flex items-center justify-end gap-3">
                  <button
                    id="btn-cancel-edit"
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-confirm-edit"
                    type="submit"
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/10 cursor-pointer"
                  >
                    Update Account
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
