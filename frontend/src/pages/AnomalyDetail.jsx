import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, ShieldCheck, FileCheck } from 'lucide-react';
import { inspectionService } from '../services/inspectionService';
import { EvidenceViewer } from '../components/EvidenceViewer';
import { ReasoningPanel } from '../components/ReasoningPanel';
import { LoadingState } from '../components/ReviewModal';
import { SeverityBadge } from '../components/StatusBadge';

export const AnomalyDetail = () => {
  const { id } = useParams();
  const [anomaly, setAnomaly] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnomaly = async () => {
      try {
        const data = await inspectionService.getAnomalyById(id);
        setAnomaly(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAnomaly();
  }, [id]);

  if (loading) return <LoadingState message="Loading anomaly evidence matrix..." />;
  if (!anomaly) return <div className="p-12 text-center text-xs text-slate-500">Anomaly record not found.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/anomalies"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {anomaly.anomaly_type}
              </h2>
              <SeverityBadge severity={anomaly.severity} />
            </div>
            <p className="text-xs text-slate-500">
              Anomaly #{anomaly.id} • Corridor: <strong className="font-mono">{anomaly.track_section_code || 'TRK-014'}</strong>
            </p>
          </div>
        </div>

        <Link
          to={`/inspections/${anomaly.inspection || 104}`}
          className="px-4 py-2 rounded-xl bg-[#14532D] text-white hover:bg-[#16A34A] text-xs font-bold shadow-sm"
        >
          View Full Inspection Dossier
        </Link>
      </div>

      {/* Evidence & Reasoning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EvidenceViewer
          anomalyType={anomaly.anomaly_type}
          severity={anomaly.severity}
          confidence={anomaly.confidence}
          boundingBox={anomaly.bounding_box}
          explanation={anomaly.explanation}
          trackSection={anomaly.track_section_code || "TRK-014"}
        />

        <ReasoningPanel
          visionFinding={anomaly.explanation}
          deteriorationScore={68}
          riskLevel={anomaly.severity}
          priorityLevel={anomaly.severity}
          actionRecommendation={anomaly.recommended_action}
        />
      </div>
    </div>
  );
};
