import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldCheck, UserCheck, School, Building2, User, Eye } from 'lucide-react';

interface RoleSwitcherBarProps {
  onNavigateToDashboard?: () => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({ onNavigateToDashboard }) => {
  const { role, loginAs, currentUser } = useAuth();

  const roles: { id: UserRole | 'guest'; label: string; icon: any; color: string }[] = [
    { id: 'admin', label: 'Super Admin', icon: ShieldCheck, color: 'bg-emerald-600 text-white' },
    { id: 'coach', label: 'Coach', icon: UserCheck, color: 'bg-lime-500 text-forest-950 font-bold' },
    { id: 'school_admin', label: 'School Admin', icon: School, color: 'bg-blue-600 text-white' },
    { id: 'society_manager', label: 'Society Manager', icon: Building2, color: 'bg-amber-600 text-white' },
    { id: 'customer', label: 'Customer / Parent', icon: User, color: 'bg-purple-600 text-white' },
    { id: 'guest', label: 'Public Visitor', icon: Eye, color: 'bg-slate-700 text-slate-200' },
  ];

  return (
    <div className="bg-forest-900 border-b border-forest-700 px-4 py-2 sticky top-0 z-50 text-xs no-print shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-lime-neon animate-pulse"></span>
          <span className="font-semibold text-slate-300">Active Persona:</span>
          <span className="text-lime-400 font-bold uppercase tracking-wider">{role.replace('_', ' ')}</span>
          {currentUser && (
            <span className="text-slate-400 hidden sm:inline">({currentUser.name})</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 hidden md:inline mr-1">Switch Role:</span>
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  loginAs(r.id);
                  if (onNavigateToDashboard && r.id !== 'guest') {
                    onNavigateToDashboard();
                  }
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                  isActive
                    ? `${r.color} shadow-sm ring-2 ring-lime-400/50 scale-105`
                    : 'bg-forest-800 text-slate-300 hover:bg-forest-700 hover:text-white'
                }`}
                title={`Switch to ${r.label}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
