import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Cpu,
  Activity,
  Camera,
  FileCheck,
  AlertTriangle,
  Server,
  Settings,
  ScrollText,
  TrendingUp,
  RefreshCw,
  Plus,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { KpiCard } from '../../components/KpiCard';
import { AgentStatus } from '../../components/AgentStatus';
import { SeverityBadge, StatusBadge } from '../../components/StatusBadge';
import { LoadingState } from '../../components/ReviewModal';
import { inspectionService } from '../../services/inspectionService';
import { authService } from '../../services/authService';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [dash, users] = await Promise.all([
        inspectionService.getDashboardOverview(),
        authService.getUsers()
      ]);
      setDashboardData(dash);
      setUsersList(users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) return <LoadingState message="Connecting to System Administration Controller..." />;

  const kpis = dashboardData?.kpis || {};
  const trends = dashboardData?.inspection_trends || [];
  const anomalyDist = dashboardData?.anomaly_distribution || [];
  const agents = dashboardData?.agent_statuses || [];

  // Simulated Admin platform telemetry
  const userActivityData = [
    { hour: '08:00', active: 18, apiCalls: 240 },
    { hour: '10:00', active: 34, apiCalls: 890 },
    { hour: '12:00', active: 42, apiCalls: 1200 },
    { hour: '14:00', active: 38, apiCalls: 1050 },
    { hour: '16:00', active: 29, apiCalls: 780 },
    { hour: '18:00', active: 14, apiCalls: 310 },
  ];

  const systemEvents = [
    { time: '14:12:04', event: 'AI Vision Engine v3.2 model heartbeat verified', type: 'SYSTEM', status: 'OK' },
    { time: '14:08:19', event: 'New user registered: inspector_john (Role: Field Inspector)', type: 'SECURITY', status: 'INFO' },
    { time: '13:55:01', event: 'Automated backup of inspection database completed (569 KB)', type: 'BACKUP', status: 'OK' },
    { time: '13:30:22', event: 'Gantry Camera CAM-017 network timeout - switched to fallback', type: 'HARDWARE', status: 'WARNING' },
    { time: '12:45:11', event: 'High Deterioration flag dispatched for Section TRK-014', type: 'AI_AGENT', status: 'ALERT' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Admin Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-purple-900/40">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            System Administration & Platform Governance
          </div>
          <h2 className="text-2xl font-black tracking-tight">Platform Control Center</h2>
          <p className="text-xs text-slate-300 mt-1">
            Manage users, monitor 7-agent AI pipelines, track hardware cameras, and supervise system audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Refresh Platform Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <Link
            to="/users"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg shadow-purple-950/40 flex items-center gap-2 transition-all"
          >
            <Users className="w-4 h-4" />
            <span>Manage Users</span>
          </Link>

          <Link
            to="/settings"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 shadow flex items-center gap-2 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* 8 Admin KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Total Platform Users"
          value={usersList.length || 5}
          subtitle="5 Active Roles"
          icon={Users}
          color="navy"
        />
        <KpiCard
          title="Active Sessions"
          value={usersList.filter(u => u.is_active).length || 5}
          subtitle="100% Operational"
          icon={ShieldCheck}
          color="green"
        />
        <KpiCard
          title="Total Inspections"
          value={kpis.total_inspections_count ?? 104}
          subtitle="All Corridors"
          icon={Activity}
          color="blue"
        />
        <KpiCard
          title="Critical Anomalies"
          value={kpis.critical_issues ?? 3}
          subtitle="Needs Immediate Fix"
          icon={ShieldAlert}
          color="red"
        />
        <KpiCard
          title="AI Model Health"
          value={`${kpis.model_health_pct ?? 97.6}%`}
          subtitle="RailGuard-Vision-v3.2"
          icon={Cpu}
          color="green"
        />
        <KpiCard
          title="Active Cameras"
          value={kpis.active_cameras ?? 12}
          subtitle="11 Live / 1 Offline"
          icon={Camera}
          color="blue"
        />
        <KpiCard
          title="Pending Reviews"
          value={kpis.pending_reviews ?? 4}
          subtitle="Engineer Queue"
          icon={FileCheck}
          color="amber"
        />
        <KpiCard
          title="System Health"
          value="100% Online"
          subtitle="DB & Edge Ingestion OK"
          icon={Server}
          color="green"
        />
      </div>

      {/* Admin Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity & API Ingestion Throughput */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">User Activity & API Throughput</h4>
              <p className="text-xs text-slate-500">Live authenticated sessions vs REST requests</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded">
              Today
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userActivityData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="apiCallsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333EA" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs font-mono shadow-xl border border-slate-800">
                          <p className="font-bold text-purple-300 mb-1">{label}</p>
                          <p className="text-purple-400">Active Users: {payload[0]?.value}</p>
                          <p className="text-emerald-400">API Calls: {payload[1]?.value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="active" stroke="#9333EA" fillOpacity={1} fill="url(#apiCallsGrad)" name="Active Users" />
                <Line type="monotone" dataKey="apiCalls" stroke="#10B981" strokeWidth={2} name="API Calls" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Prediction & Inspection Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Inspection & AI Prediction Velocity</h4>
              <p className="text-xs text-slate-500">Patrol inspections vs multi-agent inference executions</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#16A34A] bg-emerald-50 px-2 py-1 rounded">
              7-Day Trend
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="inspections" fill="#6366F1" radius={[4, 4, 0, 0]} name="Inspections" />
                <Bar dataKey="anomalies" fill="#F43F5E" radius={[4, 4, 0, 0]} name="Anomalies Found" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* System Audit Events & Platform Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Events Feed (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">System & Governance Audit Events</h4>
              <p className="text-xs text-slate-500">Live platform logs, security events, and AI model invocations</p>
            </div>
            <Link to="/audit-logs" className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1">
              All Logs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {systemEvents.map((evt, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-700">
                      {evt.time}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-purple-700 uppercase">
                      {evt.type}
                    </span>
                  </div>
                  <p className="text-slate-800 font-medium">{evt.event}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                  evt.status === 'OK' ? 'bg-emerald-100 text-emerald-800' :
                  evt.status === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                  evt.status === 'ALERT' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {evt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Admin Operations (1 col) */}
        <div className="space-y-4 text-xs">
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
            <h4 className="font-bold text-purple-400 mb-2 uppercase tracking-wider text-[11px]">
              Platform Quick Controls
            </h4>
            <div className="space-y-2">
              <Link
                to="/users"
                className="w-full p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center justify-between transition-all"
              >
                <span>Users & Role Assignments</span>
                <Users className="w-4 h-4 text-purple-400" />
              </Link>
              <Link
                to="/audit-logs"
                className="w-full p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center justify-between transition-all"
              >
                <span>Compliance Audit Logs</span>
                <ScrollText className="w-4 h-4 text-purple-400" />
              </Link>
              <Link
                to="/model-performance"
                className="w-full p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center justify-between transition-all"
              >
                <span>AI Vision Metrics & Accuracy</span>
                <Cpu className="w-4 h-4 text-purple-400" />
              </Link>
              <Link
                to="/settings"
                className="w-full p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center justify-between transition-all"
              >
                <span>System Thresholds & SLA</span>
                <Settings className="w-4 h-4 text-purple-400" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h5 className="font-bold text-slate-900 text-xs mb-2">Admin Governance Protocol</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Admins supervise system security, user permissions, and multi-agent health without performing normal field inspection data entry.
            </p>
          </div>
        </div>
      </div>

      {/* 7-Agent Multi-Agent Topology */}
      <div>
        <AgentStatus agents={agents} />
      </div>
    </div>
  );
};
