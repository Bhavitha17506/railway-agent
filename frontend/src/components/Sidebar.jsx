import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_NAVIGATION, ROLE_DETAILS } from '../config/rolePermissions';

export const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user, role, assignedSectionCount, isAdmin } = useAuth();

  const userRoleKey = (role || 'ENGINEER').toUpperCase();
  const navigationSections = ROLE_NAVIGATION[userRoleKey] || ROLE_NAVIGATION.ENGINEER;
  const roleConfig = ROLE_DETAILS[userRoleKey] || ROLE_DETAILS.ENGINEER;

  const getRoleAccentColor = () => {
    switch (userRoleKey) {
      case 'ADMIN': return 'bg-purple-600 text-purple-200 border-purple-500/30';
      case 'INSPECTOR': return 'bg-blue-600 text-blue-200 border-blue-500/30';
      case 'MAINTENANCE': return 'bg-amber-600 text-amber-200 border-amber-500/30';
      case 'VIEWER': return 'bg-slate-700 text-slate-200 border-slate-600';
      default: return 'bg-[#16A34A] text-emerald-200 border-emerald-500/30';
    }
  };

  const getActiveTabStyle = () => {
    switch (userRoleKey) {
      case 'ADMIN': return 'bg-purple-600 text-white shadow-purple-950/50';
      case 'INSPECTOR': return 'bg-blue-600 text-white shadow-blue-950/50';
      case 'MAINTENANCE': return 'bg-amber-600 text-white shadow-amber-950/50';
      case 'VIEWER': return 'bg-slate-700 text-white shadow-slate-900/50';
      default: return 'bg-[#16A34A] text-white shadow-emerald-950/50';
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-[#0F172A] text-slate-300 border-r border-slate-800 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-[#0B1120]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-[#16A34A] flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-900/40">
            <span className="text-xl font-black font-mono">RG</span>
          </div>
          {!isCollapsed && (
            <div className="leading-tight">
              <h1 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1">
                RailGuard <span className="text-[#16A34A] font-mono text-xs">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">v3.2 • {roleConfig.badgeLabel}</p>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationSections.map((sec, sIdx) => (
          <div key={sIdx}>
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                {sec.title}
              </p>
            )}
            <div className="space-y-1">
              {sec.items.map((item, iIdx) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={iIdx}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group relative ${
                        isActive
                          ? `${getActiveTabStyle()} shadow-md font-bold`
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      } ${isCollapsed ? 'justify-center' : ''}`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                    {!isCollapsed && item.badge && (
                      <span className={`ml-auto px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${getRoleAccentColor()}`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed Tooltip */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap hidden group-hover:block z-50 border border-slate-700">
                        {item.label}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Badge Footer */}
      <div className="p-3 border-t border-slate-800 bg-[#0B1120]/80">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-[#14532D] text-white font-bold flex items-center justify-center text-xs shrink-0 border border-emerald-500">
            {user?.first_name ? user.first_name[0] : (user?.username ? user.username[0].toUpperCase() : 'U')}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'Sarah Chen, P.E.'}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono truncate">
                <span className="text-emerald-400 font-bold">{roleConfig.badgeLabel}</span>
                <span>•</span>
                <span>{isAdmin ? 'All Network' : `${assignedSectionCount} Sec`}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
