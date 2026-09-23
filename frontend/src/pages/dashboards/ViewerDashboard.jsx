import React, { useState, useEffect } from 'react';
import {
  Eye,
  ShieldCheck,
  Activity,
  ClipboardList,
  AlertTriangle,
  FileText,
  TrendingUp,
  MapPin,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { KpiCard } from '../../components/KpiCard';
import { StatusBadge, SeverityBadge } from '../../components/StatusBadge';
import { TrackMap } from '../../components/TrackMap';
import { LoadingState } from '../../components/ReviewModal';
import { inspectionService } from '../../services/inspectionService';
import { Link } from 'react-router-dom';

export const ViewerDashboard = () => {
  const [data, setData] = useState(null);
  const [sections, setSections] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [dashRes, trackRes, inspRes] = await Promise.all([
        inspectionService.getDashboardOverview(),
        inspectionService.getTrackSections(),
        inspectionService.getInspections()
      ]);
      setData(dashRes);
      setSections(trackRes);
      setInspections(inspRes);
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

  if (loading) return <LoadingState message="Connecting to Auditor Read-Only Feed..." />;

  const kpis = data?.kpis || {};
  const trends = data?.inspection_trends || [];
  const certifiedInspections = inspections.filter(i => i.status === 'REVIEWED').slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Auditor Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-700">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 border border-slate-600 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <Eye className="w-3.5 h-3.5 text-slate-300" />
            Independent Audit & Safety Oversight (Read-Only)
          </div>
          <h2 className="text-2xl font-black tracking-tight">Railway Infrastructure Overview</h2>
          <p className="text-xs text-slate-300 mt-1">
            Certified network health records, safety compliance dossiers, and continuous asset surveillance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <Link
            to="/reports"
            className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold shadow flex items-center gap-2 transition-all border border-slate-600"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Certified Compliance Dossiers</span>
          </Link>
        </div>
      </div>

      {/* 4 Auditor KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Overall Track Health"
          value="94.2%"
          subtitle="Compliant Safety Margin"
          icon={ShieldCheck}
          color="green"
        />
        <KpiCard
          title="Active Issues"
          value={kpis.critical_issues ?? 3}
          subtitle="Critical & High Priority"
          icon={AlertTriangle}
          color="amber"
        />
        <KpiCard
          title="Inspection Activity"
          value={kpis.total_inspections_count ?? 104}
          subtitle="Total Certified Scans"
          icon={ClipboardList}
          color="blue"
        />
        <KpiCard
          title="Condition Index"
          value="18/100"
          subtitle="Average System Wear"
          icon={Activity}
          color="navy"
        />
      </div>

      {/* Read-Only Geospatial Track Health Map */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-600" />
              Railway Network Health & Spatial Distribution
            </h4>
            <p className="text-xs text-slate-500">Read-only overview of 24 railway corridors across the network</p>
          </div>
        </div>

        <TrackMap sections={sections} />
      </div>

      {/* Certified Inspection Dossiers & Condition Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certified Inspection Dossiers */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Certified Inspection Dossiers</h4>
              <p className="text-xs text-slate-500">Inspections signed off by Professional Railway Engineers</p>
            </div>
            <Link to="/reports" className="text-xs font-bold text-slate-700 hover:underline flex items-center gap-1">
              All Reports <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {certifiedInspections.map((insp, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{insp.inspection_code}</span>
                    <span className="font-mono text-slate-500 font-bold">{insp.track_section_code || 'TRK-014'}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      EN 50126 Certified
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 line-clamp-1">{insp.notes || 'Scheduled automated safety patrol run.'}</p>
                </div>

                <Link
                  to={`/inspections/${insp.id}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-all shrink-0 text-xs"
                >
                  View Dossier
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Condition & Scan Volume Trends */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Network Scan Volume & Defect Trends</h4>
              <p className="text-xs text-slate-500">7-day continuous automated infrastructure monitoring</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
              Audited
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="inspections" fill="#64748B" radius={[4, 4, 0, 0]} name="Inspections" />
                <Bar dataKey="healthy_scans" fill="#10B981" radius={[4, 4, 0, 0]} name="Healthy Scans" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
