import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, ShieldAlert, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';
import { agentService } from '../services/agentService';
import { SeverityBadge, ConfidenceBar } from '../components/StatusBadge';
import { LoadingState } from '../components/ReviewModal';
import { Link } from 'react-router-dom';

export const PredictionsView = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await agentService.getPredictions();
        setPredictions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingState message="Querying AI prediction log..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          AI Advisory Predictions & Model Inferences
        </h2>
        <p className="text-xs text-slate-500">
          Historical log of computer vision defect detections and multi-modal risk predictions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {predictions.map((pred) => (
          <div
            key={pred.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 text-xs"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">{pred.model_version}</span>
                <h4 className="text-sm font-bold text-slate-900">{pred.predicted_anomaly_type}</h4>
                <p className="text-[11px] font-mono text-slate-600">
                  Corridor: {pred.track_section_code} • {pred.inspection_code}
                </p>
              </div>
              <SeverityBadge severity={pred.severity} />
            </div>

            <ConfidenceBar confidence={pred.confidence} label="Prediction Confidence" />

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
              <strong className="text-slate-900 block mb-1">Evidence Summary:</strong>
              <p className="text-[11px] leading-relaxed">{pred.evidence_summary}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-mono text-slate-400">
                Generated: {new Date(pred.created_at || Date.now()).toLocaleDateString()}
              </span>
              <Link
                to={`/inspections/${pred.id || 104}`}
                className="text-[#16A34A] hover:text-[#14532D] font-bold flex items-center gap-1"
              >
                Inspect Finding <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
