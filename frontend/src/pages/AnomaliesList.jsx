import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Search, Filter, ShieldCheck, Eye, ArrowRight } from 'lucide-react';
import { SeverityBadge, ConfidenceBar } from '../components/StatusBadge';
import { LoadingState, EmptyState } from '../components/ReviewModal';
import { inspectionService } from '../services/inspectionService';

export const AnomaliesList = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadAnomalies = async () => {
    setLoading(true);
    try {
      const data = await inspectionService.getAnomalies({
        anomaly_type: typeFilter,
        severity: severityFilter,
        track_section: searchTerm
      });
      setAnomalies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnomalies();
  }, [typeFilter, severityFilter]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Detected Infrastructure Anomalies
        </h2>
        <p className="text-xs text-slate-500">
          Computer vision localized defects across rolling contact fatigue, corrosion, fastener looseness, and joint gaps
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadAnomalies()}
            placeholder="Search corridor (e.g. TRK-014)..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-700 focus:outline-none"
          >
            <option value="">All Anomaly Types</option>
            <option value="Surface Crack">Surface Crack</option>
            <option value="Rail Corrosion">Rail Corrosion</option>
            <option value="Fastener Abnormality">Fastener Abnormality</option>
            <option value="Joint Abnormality">Joint Abnormality</option>
            <option value="Surface Wear">Surface Wear</option>
            <option value="Track-bed Issue">Track-bed Issue</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-700 focus:outline-none"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Anomalies Grid */}
      {loading ? (
        <LoadingState message="Loading detected anomalies..." />
      ) : anomalies.length === 0 ? (
        <EmptyState title="No Anomalies Found" message="No anomalies matching the selected filters." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {anomalies.map((anom) => (
            <div
              key={anom.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Evidence Graphic Thumbnail */}
              <div className="h-40 bg-slate-900 relative overflow-hidden flex items-center justify-center p-4">
                <div className="w-full h-20 bg-slate-700 rounded relative overflow-hidden flex items-center justify-center">
                  <div className="w-full h-8 bg-slate-300 border-y border-slate-400" />
                  {/* Highlight Defect Box */}
                  <div className="absolute w-16 h-8 border-2 border-rose-500 bg-rose-500/20 rounded" />
                </div>

                <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[10px] px-2 py-0.5 rounded font-mono border border-slate-700">
                  {anom.track_section_code || 'TRK-014'}
                </div>

                <div className="absolute top-3 right-3">
                  <SeverityBadge severity={anom.severity} />
                </div>
              </div>

              {/* Anomaly Content */}
              <div className="p-5 flex-1 space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{anom.anomaly_type}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Inspection: {anom.inspection_code || `INS-2026-${anom.inspection}`}
                    </p>
                  </div>
                  {anom.confirmed_by_engineer && (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      ✓ Confirmed
                    </span>
                  )}
                </div>

                <ConfidenceBar confidence={anom.confidence} label="Detection Confidence" showExplanation={false} />

                <p className="text-slate-600 text-xs line-clamp-2">
                  {anom.explanation}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(anom.created_at || Date.now()).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/anomalies/${anom.id}`}
                    className="text-[#16A34A] hover:text-[#14532D] font-bold flex items-center gap-1"
                  >
                    Evidence & Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
