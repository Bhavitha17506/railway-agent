import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  Camera,
  ClipboardList,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  RefreshCw,
  HardHat,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { KpiCard } from '../../components/KpiCard';
import { StatusBadge, SeverityBadge } from '../../components/StatusBadge';
import { LoadingState } from '../../components/ReviewModal';
import { inspectionService } from '../../services/inspectionService';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const InspectorDashboard = () => {
  const { user, assignedSections } = useAuth();
  const [inspections, setInspections] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [inspRes, trackRes] = await Promise.all([
        inspectionService.getInspections(),
        inspectionService.getTrackSections()
      ]);
      setInspections(inspRes);
      setSections(trackRes);
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

  if (loading) return <LoadingState message="Connecting to Field Patrol Console..." />;

  const assignedCodes = (assignedSections && assignedSections.length > 0)
    ? assignedSections.map(s => s.section_code)
    : ['TRK-014', 'TRK-015'];

  const inspectorAssignedSections = sections.filter(s => assignedCodes.includes(s.section_code));
  const activeSections = inspectorAssignedSections.length > 0 ? inspectorAssignedSections : sections.slice(0, 4);

  const myRecentInspections = inspections.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Inspector Top Field Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-blue-900/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <HardHat className="w-3.5 h-3.5 text-blue-400" />
            Field Patrol & Data Acquisition Console
          </div>
          <h2 className="text-2xl font-black tracking-tight">Today's Field Inspections</h2>
          <p className="text-xs text-blue-200 mt-1">
            Assigned inspection corridors: <strong className="text-white font-mono">{assignedCodes.join(', ')}</strong> • Mobile ingest ready.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Refresh Field List"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <Link
            to="/inspections/upload"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-950/50 flex items-center gap-2 transition-all group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>+ Start Inspection</span>
          </Link>

          <Link
            to="/inspections/upload"
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 shadow flex items-center gap-2 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Evidence</span>
          </Link>

          <Link
            to="/inspections/live-camera"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow flex items-center gap-2 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>Capture Image</span>
          </Link>
        </div>
      </div>

      {/* 5 Field Inspector KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard
          title="Today's Inspections"
          value={4}
          subtitle="Scheduled Patrol Scans"
          icon={ClipboardList}
          color="blue"
        />
        <KpiCard
          title="Assigned Sections"
          value={assignedCodes.length}
          subtitle={assignedCodes.join(', ')}
          icon={MapPin}
          color="navy"
        />
        <KpiCard
          title="Pending Uploads"
          value={2}
          subtitle="Awaiting Ingest Sync"
          icon={UploadCloud}
          color="amber"
        />
        <KpiCard
          title="Completed Inspections"
          value={inspections.filter(i => i.status === 'REVIEWED' || i.status === 'AI_COMPLETE').length || 98}
          subtitle="Certified Scans"
          icon={CheckCircle2}
          color="green"
        />
        <KpiCard
          title="Open Findings"
          value={6}
          subtitle="Anomalies Found Today"
          icon={AlertTriangle}
          color="amber"
        />
      </div>

      {/* Field Actions Quick Panel & Assigned Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Track Sections Cards (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Assigned Patrol Corridors</h4>
              <p className="text-xs text-slate-500">Track sections assigned to your field inspection schedule</p>
            </div>
            <Link to="/track-map" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              View Map <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeSections.map((sec, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-slate-900">{sec.section_code}</span>
                  <StatusBadge status={sec.health_status} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{sec.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">KP {sec.start_km} - {sec.end_km} • Speed: {sec.max_speed_kmh} km/h</p>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/80">
                  <Link
                    to={`/inspections/upload?section=${sec.section_code}`}
                    className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-center text-xs flex items-center justify-center gap-1.5 transition-all shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Scan Section</span>
                  </Link>
                  <Link
                    to={`/inspections/live-camera?track=${sec.section_code}`}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all"
                    title="Open Live Optical Stream"
                  >
                    <Camera className="w-4 h-4 text-emerald-600" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / Field Quick Upload Box (1 col) */}
        <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
              <Camera className="w-3 h-3 text-blue-400" />
              Live Edge Capture
            </div>
            <h4 className="font-extrabold text-white text-sm mb-1">Trackside Optical Stream</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Connect directly to high-speed trackside gantry cameras to capture optical frames with instant edge AI defect localization.
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800">
            <Link
              to="/inspections/live-camera"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 text-xs transition-all shadow"
            >
              <Camera className="w-4 h-4" />
              <span>Launch Live Camera Center</span>
            </Link>

            <Link
              to="/inspections/upload"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center justify-center gap-2 text-xs transition-all border border-slate-700"
            >
              <UploadCloud className="w-4 h-4 text-blue-400" />
              <span>Upload Video / Images</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Field Inspection Logs */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Recent Field Inspection Ingests</h4>
            <p className="text-xs text-slate-500">History of patrol scans, media uploads, and AI inference results</p>
          </div>
          <Link to="/inspections" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            All Field Inspections <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Inspection ID</th>
                <th className="py-2.5 px-3">Corridor</th>
                <th className="py-2.5 px-3">Source Type</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">AI Confidence</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myRecentInspections.map((insp, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{insp.inspection_code}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{insp.track_section_code || 'TRK-014'}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                      {insp.source}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={insp.status} />
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                    {((insp.ai_confidence || 0.94) * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/inspections/${insp.id}`}
                      className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-blue-900 hover:text-white transition-all font-semibold inline-block"
                    >
                      View Scan
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
