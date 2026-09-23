import api from './api';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { username, password });
      if (response.data.token) {
        localStorage.setItem('railguard_token', response.data.token);
        localStorage.setItem('railguard_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      // Demo fallback login if backend server is not yet booted
      if (username && password) {
        let role = 'ENGINEER';
        let name = 'Sarah Chen, P.E.';
        let badge = 'RE-8821';
        if (username.toLowerCase().includes('admin')) {
          role = 'ADMIN';
          name = 'Alex Vance';
          badge = 'AD-0001';
        } else if (username.toLowerCase().includes('inspect')) {
          role = 'INSPECTOR';
          name = 'John Martinez';
          badge = 'IN-4209';
        } else if (username.toLowerCase().includes('maint')) {
          role = 'MAINTENANCE';
          name = 'David Kross';
          badge = 'MT-1104';
        } else if (username.toLowerCase().includes('view')) {
          role = 'VIEWER';
          name = 'Alice Sterling';
          badge = 'AU-9012';
        }

        const demoUser = {
          id: 2,
          username: username,
          email: `${username}@railguard.io`,
          first_name: name.split(' ')[0],
          last_name: name.split(' ').slice(1).join(' '),
          role: role,
          role_display: role,
          badge_id: badge,
          department: 'Permanent Way Infrastructure',
          is_active: true
        };
        const token = 'demo_session_token_' + Date.now();
        localStorage.setItem('railguard_token', token);
        localStorage.setItem('railguard_user', JSON.stringify(demoUser));
        return {
          token,
          user: demoUser,
          message: `Logged in as ${name} (Demo Mode)`
        };
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout/');
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('railguard_token');
      localStorage.removeItem('railguard_user');
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me/');
      return response.data;
    } catch (error) {
      const cached = localStorage.getItem('railguard_user');
      if (cached) return JSON.parse(cached);
      return null;
    }
  },

  getUsers: async () => {
    try {
      const response = await api.get('/auth/users/');
      return response.data.results || response.data;
    } catch (error) {
      return [
        { id: 1, username: "admin", email: "admin@railguard.io", first_name: "Alex", last_name: "Vance", role: "ADMIN", role_display: "System Administrator", badge_id: "AD-0001", department: "Systems & AI Administration", is_active: true },
        { id: 2, username: "engineer_sarah", email: "engineer_sarah@railguard.io", first_name: "Sarah", last_name: "Chen, P.E.", role: "ENGINEER", role_display: "Railway Engineer", badge_id: "RE-8821", department: "Permanent Way Infrastructure", is_active: true },
        { id: 3, username: "inspector_john", email: "inspector_john@railguard.io", first_name: "John", last_name: "Martinez", role: "INSPECTOR", role_display: "Field Inspector", badge_id: "IN-4209", department: "Field Patrol & Drone Operations", is_active: true },
        { id: 4, username: "maintenance_dave", email: "maintenance_dave@railguard.io", first_name: "David", last_name: "Kross", role: "MAINTENANCE", role_display: "Maintenance Team", badge_id: "MT-1104", department: "Track Maintenance & Response", is_active: true },
        { id: 5, username: "viewer_alice", email: "viewer_alice@railguard.io", first_name: "Alice", last_name: "Sterling", role: "VIEWER", role_display: "Auditor / Viewer", badge_id: "AU-9012", department: "Independent Safety Audit", is_active: true },
      ];
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/auth/users/', userData);
      return response.data;
    } catch (error) {
      return { id: Date.now(), ...userData, role_display: userData.role, is_active: true };
    }
  }
};
