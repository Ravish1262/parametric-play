import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, X, Bell, Shield, User, School, Building2, 
  Dumbbell, Phone, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { role, currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.notifications) {
          setNotifications(data.notifications);
          setUnreadCount(data.notifications.filter((n: NotificationItem) => !n.is_read).length);
        }
      })
      .catch(() => {});
  }, [currentTab]);

  const markAllRead = () => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'schools', label: 'School Sports' },
    { id: 'societies', label: 'Residential Societies' },
    { id: 'personal-training', label: 'Personal Training' },
    { id: 'find-coach', label: 'Find a Coach' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const getDashboardLabel = () => {
    switch (role) {
      case 'admin': return { label: 'Admin Dashboard', tab: 'dashboard-admin', icon: Shield, color: 'border-emerald-500 text-emerald-400' };
      case 'coach': return { label: 'Coach Portal', tab: 'dashboard-coach', icon: Dumbbell, color: 'border-lime-500 text-lime-400' };
      case 'school_admin': return { label: 'School Portal', tab: 'dashboard-school', icon: School, color: 'border-blue-500 text-blue-400' };
      case 'society_manager': return { label: 'Society Portal', tab: 'dashboard-society', icon: Building2, color: 'border-amber-500 text-amber-400' };
      case 'customer': return { label: 'My Bookings', tab: 'dashboard-customer', icon: User, color: 'border-purple-500 text-purple-400' };
      default: return null;
    }
  };

  const dashboardInfo = getDashboardLabel();

  return (
    <header className="sticky top-8 z-40 bg-forest-950/90 backdrop-blur-md border-b border-forest-800 shadow-xl no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forest-800 to-forest-900 border border-lime-500/40 flex items-center justify-center shadow-lg shadow-lime-500/10 group-hover:border-lime-400 transition-all">
              <svg className="w-7 h-7 text-lime-400 transform group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-lime-400 transition-colors">PARAMETRIC</span>
                <span className="font-heading font-extrabold text-xl tracking-tight text-lime-400">PLAY</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Sports Coaching • 3 Integrated Solutions
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-lime-400 bg-forest-900 border border-lime-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-forest-900/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-lg bg-forest-900/80 border border-forest-700 text-slate-300 hover:text-white hover:border-lime-500/50 transition-all relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-lime-500 text-forest-950 rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-forest-900 border border-forest-700 rounded-xl shadow-2xl z-50 p-3 overflow-hidden">
                  <div className="flex items-center justify-between pb-2 border-b border-forest-800">
                    <span className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-lime-400" /> Notifications
                    </span>
                    <button 
                      onClick={markAllRead}
                      className="text-xs text-lime-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-forest-800 py-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No new notifications</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div key={n.id} className="py-2.5 px-2 hover:bg-forest-850 rounded text-left transition-colors">
                          <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.message}</p>
                          <span className="text-[9px] text-slate-500 mt-1 inline-block">{n.created_at || 'Just now'}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Dashboard Button */}
            {dashboardInfo && (
              <button
                onClick={() => onNavigate(dashboardInfo.tab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border bg-forest-900/90 hover:bg-forest-850 transition-all ${dashboardInfo.color}`}
              >
                <dashboardInfo.icon className="w-4 h-4" />
                <span>{dashboardInfo.label}</span>
              </button>
            )}

            {/* Quick Action Button */}
            <button
              onClick={() => onNavigate('personal-training')}
              className="bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-lime-500/20 transition-all hover:scale-105"
            >
              <span>Book Training</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            {dashboardInfo && (
              <button
                onClick={() => onNavigate(dashboardInfo.tab)}
                className={`p-2 rounded-lg border bg-forest-900 ${dashboardInfo.color}`}
                title={dashboardInfo.label}
              >
                <dashboardInfo.icon className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-forest-900 border border-forest-700 text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-forest-900 border-b border-forest-800 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentTab === item.id
                  ? 'bg-lime-500 text-forest-950 font-bold'
                  : 'text-slate-200 hover:bg-forest-800'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-forest-800 flex flex-col gap-2">
            {dashboardInfo && (
              <button
                onClick={() => {
                  onNavigate(dashboardInfo.tab);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-forest-800 border border-forest-600 rounded-lg text-sm font-semibold text-lime-400 flex items-center justify-center gap-2"
              >
                <dashboardInfo.icon className="w-4 h-4" />
                <span>Open {dashboardInfo.label}</span>
              </button>
            )}
            <button
              onClick={() => {
                onNavigate('personal-training');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-lime-500 text-forest-950 font-bold rounded-lg text-sm text-center shadow-md"
            >
              Book Personal Training (₹2,000/mo)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
