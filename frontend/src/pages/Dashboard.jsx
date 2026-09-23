import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { EngineerDashboard } from './dashboards/EngineerDashboard';
import { InspectorDashboard } from './dashboards/InspectorDashboard';
import { MaintenanceDashboard } from './dashboards/MaintenanceDashboard';
import { ViewerDashboard } from './dashboards/ViewerDashboard';

export const Dashboard = () => {
  const { role } = useAuth();
  const userRoleKey = (role || 'ENGINEER').toUpperCase();

  switch (userRoleKey) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'INSPECTOR':
      return <InspectorDashboard />;
    case 'MAINTENANCE':
      return <MaintenanceDashboard />;
    case 'VIEWER':
      return <ViewerDashboard />;
    case 'ENGINEER':
    default:
      return <EngineerDashboard />;
  }
};

export default Dashboard;
