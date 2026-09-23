import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FileCheck, FileText, ArrowLeft, ShieldAlert, Sparkles, Activity, History, Clock, CheckCircle2 } from 'lucide-react';
import { inspectionService } from '../services/inspectionService';
import { reportService } from '../services/reportService';
import { StatusBadge, SeverityBadge, ConfidenceBar } from '../components/StatusBadge';
import { EvidenceViewer } from '../components/EvidenceViewer';
import { ReasoningPanel } from '../components/ReasoningPanel';
import { HistoricalComparison } from '../components/HistoricalComparison';
import { ReviewModal, LoadingState } from '../components/ReviewModal';
import { useNotifications } from '../context/NotificationContext';

export const InspectionDetail = () => {
  const { id } = useParams();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const res = await inspectionService.getInspectionById(id);
      setInspection(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleGenerateReport = async () => {
    try {
      const res = await reportService.generateReport(inspection.id);
      addToast("Certified inspection report generated successfully!", "success");
      navigate(`/reports/${res.report?.id || 1}`);
    } catch (e) {
      addToast("Failed to generate report", "error");
    }
  };

  if (loading) return <LoadingState message="Loading certified inspection records..." />;
  if (!inspection) return <div className="p-12 text-center text-xs text-slate-500">Inspection not found.</div>;

  const primaryAnomaly = inspection.anomalies?.[0] || {
    anomaly_type: "Surface Crack",
    severity: inspection.risk_level || "HIGH",
    confidence: inspection.ai_confidence || 0.947,
    explanation: "Transverse surface fissure detected along gauge face with high edge gradient.",
    bounding_box: { x: 220, y: 240, width: 260, height: 140 }
  };

  return (
    <div className="space-y-6">
      {/* Back and Actions Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/inspections"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 font-mono tracking-tight">
                {inspection.inspection_code}
              </h2>
              <StatusBadge status={inspection.status} />
              <SeverityBadge severity={inspection.risk_level} />
            </div>
            <p className="text-xs text-slate-500">
              Corridor: <strong className="text-slate-800 font-mono">{inspection.track_section_code || inspection.track_section?.section_code}</strong> • Captured via {inspection.source}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReviewOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#16A34A] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all"
          >
            <FileCheck className="w-4 h-4" />
            <span>Engineer Review</span>
          </button>

          <button
            onClick={handleGenerateReport}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-sm flex items-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4 text-[#16A34A]" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Main Multi-Modal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Computer Vision Evidence */}
        <EvidenceViewer
          anomalyType={primaryAnomaly.anomaly_type}
          severity={primaryAnomaly.severity}
          confidence={primaryAnomaly.confidence}
          boundingBox={primaryAnomaly.bounding_box}
          explanation={primaryAnomaly.explanation}
          trackSection={inspection.track_section_code || "TRK-014"}
        />

        {/* 7-Agent AI Reasoning Breakdown */}
        <ReasoningPanel
          visionFinding={primaryAnomaly.explanation}
          deteriorationScore={inspection.track_section?.deterioration_score || 68}
          riskLevel={inspection.risk_level}
          priorityLevel={inspection.risk_level}
        />
      </div>

      {/* Historical Side-by-Side Comparison */}
      <div>
        <HistoricalComparison
          trackSection={inspection.track_section_code || "TRK-014"}
        />
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        inspection={inspection}
        anomaly={primaryAnomaly}
        onReviewSubmitted={loadData}
      />
    </div>
  );
};
