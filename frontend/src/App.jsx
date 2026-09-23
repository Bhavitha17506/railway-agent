import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { EngineerDashboard } from './pages/dashboards/EngineerDashboard';
import { InspectorDashboard } from './pages/dashboards/InspectorDashboard';
import { MaintenanceDashboard } from './pages/dashboards/MaintenanceDashboard';
import { ViewerDashboard } from './pages/dashboards/ViewerDashboard';
import { InspectionsList } from './pages/InspectionsList';
import { InspectionUpload } from './pages/InspectionUpload';
import { LiveCamera } from './pages/LiveCamera';
import { InspectionDetail } from './pages/InspectionDetail';
import { AnomaliesList } from './pages/AnomaliesList';
import { AnomalyDetail } from './pages/AnomalyDetail';
import { TrackMapView } from './pages/TrackMapView';
import { HistoricalRecords } from './pages/HistoricalRecords';
import { SensorSimulation } from './pages/SensorSimulation';
import { AIAgentsDashboard } from './pages/AIAgentsDashboard';
import { PredictionsView } from './pages/PredictionsView';
import { MaintenancePriorityView } from './pages/MaintenancePriorityView';
import { EngineerReviews } from './pages/EngineerReviews';
import { FeedbackView } from './pages/FeedbackView';
import { ReportsList } from './pages/ReportsList';
import { ReportDetail } from './pages/ReportDetail';
import { ModelPerformance } from './pages/ModelPerformance';
import { AuditLogsView } from './pages/AuditLogsView';
import { UserManagement } from './pages/UserManagement';
import { SettingsView } from './pages/SettingsView';
import { EdgeConceptView } from './pages/EdgeConceptView';

// Protected Route Wrapper with RBAC
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FDF4] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#16A34A]/20 border-t-[#16A34A] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role) && !user.is_superuser && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Login */}
            <Route path="/login" element={<Login />} />

            {/* Authenticated Operations Console Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Role-Specific Dashboards */}
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="engineer/dashboard" element={<EngineerDashboard />} />
              <Route path="inspector/dashboard" element={<InspectorDashboard />} />
              <Route path="maintenance/dashboard" element={<MaintenanceDashboard />} />
              <Route path="viewer/dashboard" element={<ViewerDashboard />} />
              
              {/* Inspections */}
              <Route path="inspections" element={<InspectionsList />} />
              <Route path="inspections/upload" element={<InspectionUpload />} />
              <Route path="inspections/live-camera" element={<LiveCamera />} />
              <Route path="inspections/:id" element={<InspectionDetail />} />

              {/* Anomalies */}
              <Route path="anomalies" element={<AnomaliesList />} />
              <Route path="anomalies/:id" element={<AnomalyDetail />} />

              {/* Spatial & Sensor Intelligence */}
              <Route path="track-map" element={<TrackMapView />} />
              <Route path="historical" element={<HistoricalRecords />} />
              <Route path="sensors" element={<SensorSimulation />} />

              {/* AI Multi-Agents */}
              <Route path="agents" element={<AIAgentsDashboard />} />
              <Route path="predictions" element={<PredictionsView />} />
              <Route path="maintenance-priority" element={<MaintenancePriorityView />} />

              {/* Governance, Reviews & Compliance */}
              <Route path="reviews" element={<EngineerReviews />} />
              <Route path="feedback" element={<FeedbackView />} />
              <Route path="reports" element={<ReportsList />} />
              <Route path="reports/:id" element={<ReportDetail />} />
              <Route path="model-performance" element={<ModelPerformance />} />
              <Route path="edge-concept" element={<EdgeConceptView />} />

              {/* Administration & Auditing */}
              <Route path="audit-logs" element={<AuditLogsView />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route path="settings" element={<SettingsView />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
