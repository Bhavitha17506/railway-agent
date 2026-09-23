import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Activity,
  FileCheck,
  MapPin,
  TrendingUp,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  History,
  Camera
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { KpiCard } from '../../components/KpiCard';
import { StatusBadge, SeverityBadge } from '../../components/StatusBadge';
import { TrackMap } from '../../components/TrackMap';
import { ReviewModal, LoadingState } from '../../components/ReviewModal';
import { inspectionService } from '../../services/inspectionService';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const EngineerDashboard = () => {
  const { user, assignedSections } = useAuth();
  const [data, setData] = useState(null);
  const [sections, setSections] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [historicalComparisons, setHistoricalComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const loadData = async () => {
    try {
      const [dashRes, trackRes, anomRes, histRes] = await Promise.all([
        inspectionService.getDashboardOverview(),
        inspectionService.getTrackSections(),
        inspectionService.getAnomalies(),
        inspectionService.getHistoricalComparisons()
      ]);
      setData(dashRes);
      setSections(trackRes);
      setAnomalies(anomRes);
      setHistoricalComparisons(histRes);
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

  if (loading) return <LoadingState message="Loading Engineering Decision Support Grid..." />;

  const kpis = data?.kpis || {};
  const deteriorating = data?.deteriorating_sections || [];
  const pendingReviews = anomalies.filter(a => !a.confirmed_by_engineer).slice(0, 5);

  // Filter sections to assigned sections (or top priority if none)
  const assignedCodes = (assignedSections && assignedSections.length > 0)
    ? assignedSections.map(s => s.section_code)
    : ['TRK-008', 'TRK-014', 'TRK-021'];

  const engineerAssignedSections = sections.filter(s => assignedCodes.includes(s.section_code));
  const activeSections = engineerAssignedSections.length > 0 ? engineerAssignedSections : sections.slice(0, 6);

  const deteriorationTrendData = [
    { month: 'Apr', trk014: 42, trk007: 48, trk021: 38 },
    { month: 'May', trk014: 51, trk007: 55, trk021: 45 },
    { month: 'Jun', trk014: 58, trk007: 62, trk021: 52 },
    { month: 'Jul', trk014: 69, trk007: 68, trk021: 61 },
    { month: 'Aug', trk014: 78, trk007: 74, trk021: 68 },
    { month: 'Sep', trk014: 88, trk007: 79, trk021: 76 },
  ];

  return (
    <div className="space-y-6">
      {/* Personalized Engineering Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#0F172A] via-[#14532D] to-[#0F172A] text-white p-6 rounded-2xl shadow-xl border border-emerald-900/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Decision Support & Advisory Console
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Good evening, {user?.first_name || 'Engineer Sarah'}
          </h2>
          <p className="text-xs text-emerald-200 mt-1">
            Here is the current condition of your assigned railway sections ({assignedCodes.join(', ')}).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Refresh Grid Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <Link
            to="/reviews"
            className="px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all"
          >
            <FileCheck className="w-4 h-4" />
            <span>Review Findings ({pendingReviews.length})</span>
          </Link>

          <Link
            to="/reports"
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shadow flex items-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Reports</span>
          </Link>
        </div>
      </div>

      {/* 5 Engineer KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard
          title="Critical Sections"
          value={sections.filter(s => s.health_status === 'CRITICAL').length || 1}
          subtitle="Immediate Action"
          icon={ShieldAlert}
          color="red"
        />
        <KpiCard
          title="High Priority"
          value={sections.filter(s => s.health_status === 'HIGH').length || 2}
          subtitle="48h Verification SLA"
          icon={AlertTriangle}
          color="amber"
        />
        <KpiCard
          title="Pending Reviews"
          value={kpis.pending_reviews ?? 4}
          subtitle="AI Findings Awaiting Sign-off"
          icon={FileCheck}
          color="blue"
        />
        <KpiCard
          title="Deteriorating Sections"
          value={deteriorating.length || 6}
          subtitle="Accelerating Wear"
          icon={Activity}
          color="amber"
        />
        <KpiCard
          title="Recent Anomalies"
          value={anomalies.length || 18}
          subtitle="Visual & Telemetry Signals"
          icon={Sparkles}
          color="navy"
        />
      </div>

      {/* Track Health Map (Assigned Railway Sections) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Assigned Railway Corridors Geospatial Map
            </h4>
            <p className="text-xs text-slate-500">Live health indexing across your assigned operational network</p>
          </div>
          <Link to="/track-map" className="text-xs font-bold text-[#16A34A] hover:underline flex items-center gap-1">
            Full Interactive Map <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <TrackMap sections={activeSections} />
      </div>

      {/* Priority Inspections & AI Findings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Inspections */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Priority Railway Sections</h4>
              <p className="text-xs text-slate-500">Sections requiring immediate engineering inspection</p>
            </div>
            <Link to="/maintenance-priority" className="text-xs font-bold text-[#16A34A] hover:underline">
              Triage Matrix →
            </Link>
          </div>

          <div className="space-y-3">
            {activeSections.map((sec, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{sec.section_code}</span>
                    <StatusBadge status={sec.health_status} />
                  </div>
                  <p className="text-slate-600 font-medium mt-1">{sec.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Speed Limit: {sec.max_speed_kmh} km/h • UIC 60 Continuous Rail</p>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-900 mb-1.5">
                    Score: <span className={sec.deterioration_score >= 75 ? 'text-rose-600' : 'text-amber-600'}>{sec.deterioration_score}/100</span>
                  </div>
                  <Link
                    to={`/inspections?track_section=${sec.section_code}`}
                    className="px-2.5 py-1 rounded bg-[#14532D] text-white hover:bg-[#16A34A] transition-all font-semibold inline-block"
                  >
                    View Scans
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engineer Review Queue */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Engineer Review Queue</h4>
              <p className="text-xs text-slate-500">AI multi-agent detections awaiting engineering confirmation</p>
            </div>
            <Link to="/reviews" className="text-xs font-bold text-[#16A34A] hover:underline">
              View All ({pendingReviews.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {pendingReviews.map((anom, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{anom.track_section_code || 'TRK-014'}</span>
                    <SeverityBadge severity={anom.severity} />
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                      AI Conf: {((anom.confidence || 0.94) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="font-bold text-slate-800">{anom.anomaly_type}</p>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{anom.explanation}</p>
                </div>

                <button
                  onClick={() => setSelectedReview(anom)}
                  className="px-3 py-1.5 rounded-lg bg-[#14532D] hover:bg-[#16A34A] text-white font-bold shrink-0 transition-all shadow text-xs"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deterioration Trend & Historical Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deterioration Trend Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Deterioration Progression Over Time</h4>
              <p className="text-xs text-slate-500">6-Month Composite Deterioration Index across critical corridors</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
              0-100 Index
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={deteriorationTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="trk014" stroke="#DC2626" strokeWidth={3} name="TRK-014 (Mainline)" />
                <Line type="monotone" dataKey="trk007" stroke="#EA580C" strokeWidth={2} name="TRK-007 (Curve)" />
                <Line type="monotone" dataKey="trk021" stroke="#F59E0B" strokeWidth={2} name="TRK-021 (Crossover)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Historical Comparison Matrix */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Historical Defect Growth & Wear Velocity</h4>
              <p className="text-xs text-slate-500">Sections where physical defect growth exceeds safety limits</p>
            </div>
            <Link to="/historical" className="text-xs font-bold text-[#16A34A] hover:underline flex items-center gap-1">
              Deep Compare <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {historicalComparisons.slice(0, 3).map((comp, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-slate-900">{comp.track_section_code || 'TRK-014'}</span>
                  <span className="font-mono text-rose-600 font-bold">Growth: +{comp.delta_percentage}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-lg border border-slate-100 text-center font-mono text-[11px] mb-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Baseline</span>
                    <strong className="text-slate-800">{comp.previous_value_mm} mm</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Current</span>
                    <strong className="text-rose-600">{comp.current_value_mm} mm</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Wear Rate</span>
                    <strong className="text-amber-600">{comp.wear_rate_mm_per_month} mm/mo</strong>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 italic">"{comp.ai_risk_assessment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal for quick sign-off */}
      {selectedReview && (
        <ReviewModal
          anomaly={selectedReview}
          isOpen={Boolean(selectedReview)}
          onClose={() => setSelectedReview(null)}
          onSuccess={() => {
            setSelectedReview(null);
            loadData();
          }}
        />
      )}
    </div>
  );
};
