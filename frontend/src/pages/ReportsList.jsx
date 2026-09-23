import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Eye, Plus, CheckCircle2, ShieldCheck } from 'lucide-react';
import { reportService } from '../services/reportService';
import { LoadingState } from '../components/ReviewModal';

export const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await reportService.getReports();
        setReports(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingState message="Loading certified infrastructure dossiers..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Certified Railway Infrastructure Dossiers & Reports
          </h2>
          <p className="text-xs text-slate-500">
            EN 50126 compliant safety reports clearly segregating AI computer vision predictions from engineer-signed maintenance mandates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                  {rep.report_code}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Certified Sign-Off
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-1">{rep.title}</h4>
              <p className="text-slate-600 leading-relaxed text-[11px] line-clamp-3 mb-3">
                {rep.executive_summary}
              </p>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-500 space-y-0.5">
                <div>Standard: {rep.compliance_standards}</div>
                <div>Corridor: <strong className="text-slate-800">{rep.track_section_code}</strong></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                {new Date(rep.created_at || Date.now()).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  to={`/reports/${rep.id}`}
                  className="px-3 py-1.5 rounded-lg bg-[#14532D] text-white hover:bg-[#16A34A] font-bold flex items-center gap-1.5 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Dossier</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
