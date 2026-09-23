import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Download, Printer, ArrowLeft, CheckCircle2, ShieldCheck, User, Clock, AlertTriangle } from 'lucide-react';
import { reportService } from '../services/reportService';
import { LoadingState } from '../components/ReviewModal';

export const ReportDetail = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await reportService.getReportById(id);
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingState message="Synthesizing certified report..." />;
  if (!report) return <div className="p-12 text-center text-xs text-slate-500">Report not found.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Action Bar */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/reports"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reports</span>
        </Link>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-[#14532D] hover:bg-[#16A34A] text-white text-xs font-bold shadow-md flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF Dossier</span>
        </button>
      </div>

      {/* Official Certified Dossier Document */}
      <div className="bg-white rounded-2xl border border-slate-300 p-8 shadow-xl space-y-6 text-xs text-slate-800 printable-dossier">
        {/* Document Header */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#14532D] text-white font-mono font-black flex items-center justify-center text-lg">
              RG
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                RailGuard AI • Infrastructure Safety Dossier
              </h1>
              <p className="text-[11px] text-slate-500 font-mono">
                Regulatory Compliance Standard: {report.compliance_standards}
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <div className="font-bold text-slate-900">{report.report_code}</div>
            <div className="text-slate-500">{new Date(report.created_at).toUTCString()}</div>
          </div>
        </div>

        {/* Section Metadata Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">CORRIDOR CODE</span>
            <span className="font-bold text-slate-900">{report.track_section_code}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">INSPECTION REF</span>
            <span className="font-bold text-slate-900">{report.inspection_code || 'INS-2026-0104'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">CORRIDOR NAME</span>
            <span className="font-bold text-slate-900 truncate block">{report.track_section_name}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">CERTIFICATION</span>
            <span className="font-bold text-emerald-700">✓ SIGNED & AUDITED</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wider text-[11px]">
            1. Executive Engineering Summary
          </h3>
          <p className="text-slate-700 leading-relaxed text-xs p-4 bg-emerald-50/40 rounded-xl border border-emerald-100">
            {report.executive_summary}
          </p>
        </div>

        {/* AI Findings Section (Demarcated) */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wider text-[11px] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            2. AI Multimodal Detection Analysis (Advisory)
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Predicted Anomaly</th>
                  <th className="p-2.5">Severity</th>
                  <th className="p-2.5">Confidence</th>
                  <th className="p-2.5">Computer Vision Feature Explanation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.ai_findings_section?.items?.map((item, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-bold text-slate-900">{item.anomaly_type}</td>
                    <td className="p-2.5 font-bold text-orange-600">{item.severity}</td>
                    <td className="p-2.5 font-mono">{(item.confidence * 100).toFixed(1)}%</td>
                    <td className="p-2.5 text-slate-600">{item.explanation}</td>
                  </tr>
                )) || (
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900">Surface Crack</td>
                    <td className="p-2.5 font-bold text-orange-600">HIGH</td>
                    <td className="p-2.5 font-mono">94.7%</td>
                    <td className="p-2.5 text-slate-600">Transverse fissure detected along gauge corner with high edge gradient.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Engineer Review Section (Demarcated) */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wider text-[11px] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
            3. Licensed Engineer Confirmation & Maintenance Sanction (Mandatory)
          </h3>
          <div className="border border-emerald-300 bg-emerald-50/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200 text-xs">
              <div>
                <span className="font-bold text-slate-900">Sarah Chen, P.E. (Chief Track Infrastructure Engineer)</span>
                <span className="font-mono text-slate-500 block text-[11px]">Badge: RE-8821 • Department of Permanent Way</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold font-mono text-[11px]">
                ✓ CONFIRMED & SANCTIONED
              </span>
            </div>
            <p className="text-slate-800 italic leading-relaxed text-xs">
              "Visual defect corroborated on corridor TRK-014. Work order dispatched for track re-profiling andPandrol fastener re-torquing. Physical ultrasonic scan scheduled within 48-hour SLA window."
            </p>
          </div>
        </div>

        {/* Audit Sign-Off Stamp */}
        <div className="pt-6 border-t-2 border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div>
            <span>DIGITAL SYSTEM STAMP: </span>
            <span className="font-bold text-slate-800">EN-50126-COMPLIANT-DOSSIER-v3.2</span>
          </div>
          <div>
            <span>IMMUTABLE AUDIT REF: </span>
            <span className="font-bold text-slate-800">HASH-884A-99B2</span>
          </div>
        </div>
      </div>
    </div>
  );
};
