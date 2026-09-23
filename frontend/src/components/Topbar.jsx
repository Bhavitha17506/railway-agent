import React, { useState } from 'react';
import { Search, Bell, ShieldCheck, ChevronDown, LogOut, User, Sparkles, AlertTriangle, ExternalLink, MapPin, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Link, useNavigate } from 'react-router-dom';
import { RoleBadge } from './RoleBadge';
import { ROLE_DETAILS } from '../config/rolePermissions';

export const Topbar = ({ isSidebarCollapsed }) => {
  const { user, role, logout, switchRole, assignedSectionCount, isAdmin, getDashboardPath } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/inspections?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRoleSelect = async (targetRole) => {
    await switchRole(targetRole);
    setShowUserMenu(false);
    navigate(ROLE_DETAILS[targetRole]?.dashboardPath || '/dashboard');
  };

  const roleConfig = ROLE_DETAILS[role] || ROLE_DETAILS.ENGINEER;

  // Filter notifications relevant to current role
  const roleFilteredNotifications = notifications.filter(n => {
    if (role === 'ADMIN') return true;
    if (role === 'ENGINEER') return n.type === 'engineer' || n.type === 'anomaly' || n.type === 'review';
    if (role === 'INSPECTOR') return n.type === 'inspection' || n.type === 'upload' || n.type === 'camera';
    if (role === 'MAINTENANCE') return n.type === 'maintenance' || n.type === 'anomaly';
    if (role === 'VIEWER') return n.type === 'summary';
    return true;
  });

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-30 transition-all duration-300 flex items-center justify-between px-6 ${
        isSidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Global Search Bar */}
      <form onSubmit={handleSearch} className="relative max-w-md w-full hidden md:block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${role === 'INSPECTOR' ? 'assigned corridors, upload scans...' : 'inspections, corridors (e.g. TRK-014), anomalies...'}`}
          className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition-all"
        />
      </form>

      {/* Right Action Icons & User Menu */}
      <div className="flex items-center gap-3.5 ml-auto">
        {/* Assigned Section Badge Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isAdmin ? '24 Track Corridors (Admin)' : `${assignedSectionCount} Assigned Corridors`}</span>
        </div>

        {/* Role Badge Indicator */}
        <div className="hidden lg:block">
          <RoleBadge role={role} size="md" />
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative transition-all"
            title="Operational Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center font-mono animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in duration-150">
              <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{roleConfig.badgeLabel} Alerts</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-[#16A34A] hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {(roleFilteredNotifications.length > 0 ? roleFilteredNotifications : notifications).map(n => (
                  <Link
                    key={n.id}
                    to={n.link}
                    onClick={() => setShowNotifications(false)}
                    className={`block p-3 hover:bg-slate-50 transition-all text-xs ${!n.read ? 'bg-emerald-50/40' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{n.message}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-all text-left"
          >
            <div className="w-8 h-8 rounded-full bg-[#14532D] text-white flex items-center justify-center font-bold text-xs">
              {user?.first_name ? user.first_name[0] : (user?.username ? user.username[0].toUpperCase() : 'U')}
            </div>
            <div className="hidden md:block leading-tight">
              <p className="text-xs font-bold text-slate-900">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'Sarah Chen, P.E.'}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                {user?.badge_id || 'RE-8821'} • {roleConfig.badgeLabel}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 p-2 text-xs animate-in fade-in duration-150">
              <div className="p-3 bg-slate-50 rounded-xl mb-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900">{user?.first_name} {user?.last_name || ''}</p>
                  <RoleBadge role={role} size="sm" showIcon={false} />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{user?.email || `${user?.username}@railguard.io`}</p>
                <p className="text-[10px] font-mono text-emerald-700 font-semibold mt-1">
                  {isAdmin ? 'Full Network Oversight' : `${assignedSectionCount} Assigned Corridors`}
                </p>
              </div>

              {/* Fast 5-Role Switcher */}
              <div className="py-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                  Switch Role Persona (Demo)
                </span>
                
                <button
                  onClick={() => handleRoleSelect('ADMIN')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all ${
                    role === 'ADMIN' ? 'bg-purple-50 text-purple-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    1. System Administrator
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">admin</span>
                </button>

                <button
                  onClick={() => handleRoleSelect('ENGINEER')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all ${
                    role === 'ENGINEER' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    2. Railway Engineer
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">engineer</span>
                </button>

                <button
                  onClick={() => handleRoleSelect('INSPECTOR')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all ${
                    role === 'INSPECTOR' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    3. Field Inspector
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">inspector</span>
                </button>

                <button
                  onClick={() => handleRoleSelect('MAINTENANCE')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all ${
                    role === 'MAINTENANCE' ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    4. Maintenance Team
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">maint</span>
                </button>

                <button
                  onClick={() => handleRoleSelect('VIEWER')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all ${
                    role === 'VIEWER' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    5. Auditor / Viewer
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">viewer</span>
                </button>
              </div>

              <div className="border-t border-slate-100 my-1 pt-1">
                <button
                  onClick={logout}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
