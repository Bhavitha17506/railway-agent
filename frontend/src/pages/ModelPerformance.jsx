import React, { useState, useEffect } from 'react';
import { BarChart3, Bot, CheckCircle2, ShieldAlert, Sparkles, TrendingUp, Layers } from 'lucide-react';
import { agentService } from '../services/agentService';
import { LoadingState } from '../components/ReviewModal';

export const ModelPerformance = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await agentService.getModelMetrics();
        setMetrics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingState message="Calculating model performance benchmark metrics..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          AI Model Evaluation & Quality Benchmarks
        </h2>
        <p className="text-xs text-slate-500">
          Supervised computer vision evaluation and human-in-the-loop consensus metrics (Demo Benchmark Dataset)
        </p>
      </div>

      {/* Model Version Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">ACTIVE MODEL</span>
          <h3 className="text-base font-bold text-slate-900 font-mono">{metrics?.model_name || 'RailGuard-Vision-Multimodal-v3.2'}</h3>
          <p className="text-slate-500 font-mono mt-0.5">Evaluation Dataset: {metrics?.dataset_version || 'RailNet-Synthetic-2026.Q3'}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold">
            F1 Score: {metrics?.f1_score || 0.935}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-mono font-bold">
            Accuracy: {metrics?.accuracy ? `${(metrics.accuracy * 100).toFixed(1)}%` : '95.1%'}
          </span>
        </div>
      </div>

      {/* 4 Primary Machine Learning Evaluation Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block mb-1">Precision</span>
          <h3 className="text-2xl font-black font-mono text-slate-900">{((metrics?.precision || 0.942) * 100).toFixed(1)}%</h3>
          <p className="text-[11px] text-slate-500 mt-1">Defect bounding accuracy</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block mb-1">Recall / Sensitivity</span>
          <h3 className="text-2xl font-black font-mono text-slate-900">{((metrics?.recall || 0.928) * 100).toFixed(1)}%</h3>
          <p className="text-[11px] text-slate-500 mt-1">True defect localization rate</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block mb-1">Human Agreement</span>
          <h3 className="text-2xl font-black font-mono text-[#16A34A]">{metrics?.human_agreement_pct || 93.48}%</h3>
          <p className="text-[11px] text-emerald-700 mt-1">Engineer confirmed decisions</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block mb-1">Total Inferences</span>
          <h3 className="text-2xl font-black font-mono text-slate-900">{metrics?.total_predictions || 1420}</h3>
          <p className="text-[11px] text-slate-500 mt-1">{metrics?.reviewed_predictions || 890} Reviewed</p>
        </div>
      </div>

      {/* Confusion Matrix & Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-3 mb-4 border-b border-slate-100">
          Confusion & Classification Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <span className="text-emerald-900 font-bold block mb-1">True Positives ({metrics?.confirmed_count || 832})</span>
            <p className="text-[11px] text-emerald-700 font-sans">AI correctly identified defect and certified by engineer.</p>
          </div>

          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl">
            <span className="text-rose-900 font-bold block mb-1">False Positives ({metrics?.rejected_count || 38})</span>
            <p className="text-[11px] text-rose-700 font-sans">Surface artifact misidentified as defect and rejected during human review.</p>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
            <span className="text-amber-900 font-bold block mb-1">Borderline Cases ({metrics?.further_inspection_count || 20})</span>
            <p className="text-[11px] text-amber-700 font-sans">Flagged for secondary physical ultrasonic track patrol.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
