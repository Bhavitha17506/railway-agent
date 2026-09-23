import React, { useState, useEffect } from 'react';
import {
  Wrench,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Calendar,
  ArrowRight,
  RefreshCw,
  HardHat,
  Sparkles,
  FileCheck,
  Check
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { KpiCard } from '../../components/KpiCard';
import { StatusBadge, SeverityBadge } from '../../components/StatusBadge';
import { LoadingState } from '../../components/ReviewModal';
import { inspectionService } from '../../services/inspectionService';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const MaintenanceDashboard = () => {
  const { user, assignedSections } = useAuth();
  const { addToast } = useNotifications();
  const [data, setData] = useState(null);
  const [sections, setSections] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Maintenance work order states
  const [workOrders, setWorkOrders] = useState([
    {
      id: "WO-8821",
      section_code: "TRK-014",
      title: "Surface Crack Gauge Corner Grinding & Inspection",
      severity: "HIGH",
      ai_confidence: 0.947,
      engineer_review: "Confirmed by Sarah Chen, P.E.",
      engineer_notes: "Visual defect corroborated on TRK-014. Work order dispatched for track re-profiling and clip tightening.",
      status: "OPEN",
      sla_hours: 48,
      assigned_crew: "Rapid Response Unit M-04",
      recommended_action: "Schedule detailed ultrasonic inspection & rail grinding."
    },
    {
      id: "WO-8819",
      section_code: "TRK-007",
      title: "Outer Rail Flange Wear Re-profiling",
      severity: "HIGH",
      ai_confidence: 0.912,
      engineer_review: "Confirmed by Sarah Chen, P.E.",
      engineer_notes: "Flange wear exceeding 6.2mm on curve. Immediate rail lubricator calibration required.",
      status: "IN_PROGRESS",
      sla_hours: 24,
      assigned_crew: "Heavy Track Machinery Unit 2",
      recommended_action: "Deploy mobile rail miller to restore standard UIC 60 crown profile."
    },
    {
      id: "WO-8814",
      section_code: "TRK-021",
      title: "Crossover Switch Point Fastener Replacement",
      severity: "HIGH",
      ai_confidence: 0.895,
      engineer_review: "Confirmed by Sarah Chen, P.E.",
      engineer_notes: "Pandrol clips loose on switch tongue heel block. Replace insulators.",
      status: "OPEN",
      sla_hours: 72,
      assigned_crew: "Switch & Signal Crew Alpha",
      recommended_action: "Torque check all fastening bolts and replace nylon insulators."
    },
    {
      id: "WO-8809",
      section_code: "TRK-018",
      title: "Viaduct Deck Expansion Joint Bolt Tightening",
      severity: "MEDIUM",
      ai_confidence: 0.875,
      engineer_review: "Confirmed by Sarah Chen, P.E.",
      engineer_notes: "Thermal expansion gap measured at 6.8mm. Verify torque specs.",
      status: "COMPLETED",
      sla_hours: 120,
      assigned_crew: "Structural Bridge Squad 1",
      recommended_action: "Replace worn elastomeric bearing pads."
    },
  ]);

  const loadData = async () => {
    try {
      const [dashRes, trackRes, anomRes] = await Promise.all([
        inspectionService.getDashboardOverview(),
        inspectionService.getTrackSections(),
        inspectionService.getAnomalies()
      ]);
      setData(dashRes);
      setSections(trackRes);
      setAnomalies(anomRes);
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

  const handleUpdateStatus = (woId, newStatus) => {
    setWorkOrders(prev => prev.map(w => w.id === woId ? { ...w, status: newStatus } : w));
    addToast(`Work Order ${woId} updated to ${newStatus}.`, "success");
  };

  if (loading) return <LoadingState message="Connecting to Maintenance Dispatch Grid..." />;

  const conditionOverview = [
    { name: "Healthy (0-24)", count: sections.filter(s => s.health_status === 'HEALTHY').length || 6, color: "#16A34A" },
    { name: "Normal (25-49)", count: sections.filter(s => s.health_status === 'NORMAL').length || 10, color: "#3B82F6" },
    { name: "Watch (50-74)", count: sections.filter(s => s.health_status === 'WATCH').length || 5, color: "#F59E0B" },
    { name: "High Priority (75-89)", count: sections.filter(s => s.health_status === 'HIGH').length || 2, color: "#EA580C" },
    { name: "Critical (90-100)", count: sections.filter(s => s.health_status === 'CRITICAL').length || 1, color: "#DC2626" },
  ];

  const maintenanceTrends = [
    { week: 'Wk 34', completed: 12, open: 18 },
    { week: 'Wk 35', completed: 15, open: 16 },
    { week: 'Wk 36', completed: 19, open: 14 },
    { week: 'Wk 37', completed: 22, open: 11 },
    { week: 'Wk 38', completed: 18, open: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Maintenance Top Operations Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-amber-900/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            Track Maintenance & Rapid Response Command
          </div>
          <h2 className="text-2xl font-black tracking-tight">Maintenance Work Requiring Attention</h2>
          <p className="text-xs text-amber-200 mt-1">
            Confirmed engineer work orders, scheduled track repairs, and component wear mitigations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Refresh Dispatch List"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <Link
            to="/maintenance-priority"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-lg shadow-amber-950/50 flex items-center gap-2 transition-all"
          >
            <Wrench className="w-4 h-4" />
            <span>Triage Priority Queue</span>
          </Link>
        </div>
      </div>

      {/* 6 Maintenance KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <KpiCard
          title="Critical Maintenance"
          value={1}
          subtitle="Immediate Halt / 80kmh"
          icon={ShieldAlert}
          color="red"
        />
        <KpiCard
          title="High Priority"
          value={3}
          subtitle="< 48h SLA"
          icon={AlertTriangle}
          color="amber"
        />
        <KpiCard
          title="Open Work Items"
          value={workOrders.filter(w => w.status === 'OPEN').length}
          subtitle="Ready for Dispatch"
          icon={Clock}
          color="blue"
        />
        <KpiCard
          title="In Progress"
          value={workOrders.filter(w => w.status === 'IN_PROGRESS').length}
          subtitle="Active on Track"
          icon={Wrench}
          color="amber"
        />
        <KpiCard
          title="Completed"
          value={workOrders.filter(w => w.status === 'COMPLETED').length + 18}
          subtitle="This Month"
          icon={CheckCircle2}
          color="green"
        />
        <KpiCard
          title="Overdue"
          value={0}
          subtitle="100% SLA Compliance"
          icon={Calendar}
          color="green"
        />
      </div>

      {/* Main Maintenance Priority Queue */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Maintenance Priority Queue</h4>
            <p className="text-xs text-slate-500">Confirmed AI & Engineer findings prioritized for field dispatch</p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
            Live Dispatch Queue
          </span>
        </div>

        <div className="space-y-4">
          {workOrders.map((wo) => (
            <div
              key={wo.id}
              className={`p-4 rounded-xl border transition-all ${
                wo.status === 'COMPLETED'
                  ? 'bg-slate-50 border-slate-200 opacity-75'
                  : wo.severity === 'HIGH'
                  ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-400/30'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-slate-900">{wo.section_code}</span>
                    <span className="font-mono text-xs text-slate-500">[{wo.id}]</span>
                    <SeverityBadge severity={wo.severity} />
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      AI Conf: {(wo.ai_confidence * 100).toFixed(1)}%
                    </span>
                    <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                      SLA: {wo.sla_hours}h
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-900 text-xs">{wo.title}</h5>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleUpdateStatus(wo.id, 'OPEN')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                      wo.status === 'OPEN'
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(wo.id, 'IN_PROGRESS')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                      wo.status === 'IN_PROGRESS'
                        ? 'bg-amber-600 text-white shadow'
                        : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(wo.id, 'COMPLETED')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                      wo.status === 'COMPLETED'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {/* Engineer Notes & Recommended Action Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200/80 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-0.5">
                    Engineer Review: Confirmed
                  </span>
                  <p className="text-[11px] text-slate-700 italic">"{wo.engineer_notes}"</p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Action Plan & Assigned Crew
                  </span>
                  <p className="text-[11px] font-semibold text-slate-900">{wo.recommended_action}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Assigned to: {wo.assigned_crew}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Condition Overview & Maintenance Trend Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Track Network Condition Overview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Track Infrastructure Condition Breakdown</h4>
              <p className="text-xs text-slate-500">Distribution of 24 railway network corridors across health bands</p>
            </div>
          </div>

          <div className="space-y-3">
            {conditionOverview.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-slate-800">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${(item.count / 24) * 100}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-6 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Velocity Trend (Completed vs Pending) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Maintenance Velocity Trend</h4>
              <p className="text-xs text-slate-500">Weekly completed repairs vs incoming work orders</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
              5-Week Window
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="week" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="completed" fill="#16A34A" radius={[4, 4, 0, 0]} name="Completed Repairs" />
                <Bar dataKey="open" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Pending Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
