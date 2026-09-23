import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, ArrowUpDown, ChevronLeft, ChevronRight, Eye, ShieldAlert, UploadCloud } from 'lucide-react';
import { StatusBadge, SeverityBadge } from '../components/StatusBadge';
import { LoadingState, EmptyState } from '../components/ReviewModal';
import { inspectionService } from '../services/inspectionService';
import { Link, useSearchParams } from 'react-router-dom';

export const InspectionsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || searchParams.get('track_section') || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');

  const loadInspections = async () => {
    setLoading(true);
    try {
      const data = await inspectionService.getInspections({
        search: searchTerm,
        status: statusFilter,
        risk_level: riskFilter
      });
      setInspections(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInspections();
  }, [statusFilter, riskFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadInspections();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Inspection Management Records</h2>
          <p className="text-xs text-slate-500">
            Automated patrol runs, drone scans, trackside optical captures, and manual field assessments
          </p>
        </div>

        <Link
          to="/inspections/upload"
          className="px-4 py-2 rounded-xl bg-[#14532D] hover:bg-[#16A34A] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all"
        >
          <UploadCloud className="w-4 h-4" />
          <span>New Inspection Upload</span>
        </Link>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by inspection ID (e.g. INS-2026-0104) or corridor..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] text-slate-900"
          />
        </form>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-semibold focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="PROCESSING">Processing</option>
            <option value="AI_COMPLETE">AI Complete</option>
            <option value="AWAITING_REVIEW">Awaiting Review</option>
            <option value="REVIEWED">Reviewed & Certified</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-semibold focus:outline-none"
          >
            <option value="">All Risk Levels</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>

          <button
            onClick={loadInspections}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Inspections Table */}
      {loading ? (
        <LoadingState message="Querying inspection database records..." />
      ) : inspections.length === 0 ? (
        <EmptyState
          title="No Inspections Found"
          message="Try changing search queries or upload a new patrol scan."
          actionText="Upload Inspection"
          onAction={() => window.location.href = '/inspections/upload'}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Inspection ID</th>
                  <th className="py-3 px-4">Corridor Code</th>
                  <th className="py-3 px-4">Inspection Date</th>
                  <th className="py-3 px-4">Source Channel</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">AI Confidence</th>
                  <th className="py-3 px-4">Anomalies</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inspections.map((insp) => (
                  <tr key={insp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <Link to={`/inspections/${insp.id}`} className="text-[#14532D] hover:underline">
                        {insp.inspection_code}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-800">{insp.track_section_code}</span>
                      <span className="block text-[11px] text-slate-500 truncate max-w-[140px]">{insp.track_section_name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {new Date(insp.inspection_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                        {insp.source}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={insp.status} />
                    </td>
                    <td className="py-3 px-4">
                      <SeverityBadge severity={insp.risk_level} />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {Math.round(Number(insp.ai_confidence || 0.94) * 100)}%
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {insp.anomalies_count || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/inspections/${insp.id}`}
                        className="px-2.5 py-1 rounded bg-[#14532D] text-white hover:bg-[#16A34A] font-semibold transition-all inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {inspections.length} recorded inspections</span>
            <div className="flex items-center gap-1">
              <button disabled className="p-1 rounded border bg-white disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button disabled className="p-1 rounded border bg-white disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
