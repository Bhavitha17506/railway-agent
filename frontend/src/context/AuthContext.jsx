import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { ROLE_PERMISSIONS, ROLE_DETAILS } from '../config/rolePermissions';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('railguard_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('railguard_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('railguard_user');
        }
      } else if (token) {
        try {
          const fetchedUser = await authService.getCurrentUser();
          if (fetchedUser) {
            setUser(fetchedUser);
            localStorage.setItem('railguard_user', JSON.stringify(fetchedUser));
          }
        } catch (err) {
          setToken(null);
          localStorage.removeItem('railguard_token');
        }
      } else {
        // Auto-login default demo engineer
        const defaultEngineer = {
          id: 2,
          username: "engineer_sarah",
          email: "engineer_sarah@railguard.io",
          first_name: "Sarah",
          last_name: "Chen, P.E.",
          role: "ENGINEER",
          role_display: "Railway Engineer",
          badge_id: "RE-8821",
          department: "Permanent Way Infrastructure",
          assigned_sections_data: [
            { id: 8, section_code: "TRK-008", name: "Harbor Terminal Lead", health_status: "WATCH", deterioration_score: 58 },
            { id: 14, section_code: "TRK-014", name: "Northern Valley Mainline KP 14.2", health_status: "CRITICAL", deterioration_score: 88 },
            { id: 21, section_code: "TRK-021", name: "East Switch Crossover 21", health_status: "HIGH", deterioration_score: 76 }
          ],
          assigned_section_count: 3,
          is_active: true
        };
        setUser(defaultEngineer);
        localStorage.setItem('railguard_user', JSON.stringify(defaultEngineer));
        localStorage.setItem('railguard_token', 'demo_token_sarah');
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  };

  const switchRole = async (targetRole) => {
    const roleCredentials = {
      ADMIN: { u: 'admin', p: 'Admin123!' },
      ENGINEER: { u: 'engineer_sarah', p: 'Engineer123!' },
      INSPECTOR: { u: 'inspector_john', p: 'Inspector123!' },
      MAINTENANCE: { u: 'maintenance_dave', p: 'Maint123!' },
      VIEWER: { u: 'viewer_alice', p: 'Viewer123!' },
    };
    const creds = roleCredentials[targetRole] || roleCredentials.ENGINEER;
    return await login(creds.u, creds.p);
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (user.role === 'ADMIN' || user.is_superuser) return true;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const can = (permissionKey) => {
    if (!user) return false;
    if (user.role === 'ADMIN' || user.is_superuser) return true;
    const rolePerms = ROLE_PERMISSIONS[user.role] || {};
    return Boolean(rolePerms[permissionKey]);
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    const config = ROLE_DETAILS[user.role];
    return config?.dashboardPath || '/dashboard';
  };

  const role = user?.role || 'ENGINEER';
  const isAdmin = role === 'ADMIN' || user?.is_superuser;
  const isEngineer = role === 'ENGINEER';
  const isInspector = role === 'INSPECTOR';
  const isMaintenance = role === 'MAINTENANCE';
  const isViewer = role === 'VIEWER';

  const assignedSections = user?.assigned_sections_data || [];
  const assignedSectionCount = user?.assigned_section_count ?? assignedSections.length ?? (isAdmin ? 24 : 3);

  return (
    <AuthContext.Provider value={{
      user,
      role,
      token,
      loading,
      login,
      logout,
      switchRole,
      hasRole,
      can,
      getDashboardPath,
      isAdmin,
      isEngineer,
      isInspector,
      isMaintenance,
      isViewer,
      assignedSections,
      assignedSectionCount
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
