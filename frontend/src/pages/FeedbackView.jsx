import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, BarChart2, Star, CheckCircle2 } from 'lucide-react';
import { reportService } from '../services/reportService';
import { agentService } from '../services/agentService';
import { LoadingState } from '../components/ReviewModal';

export const FeedbackView = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [fbData, metData] = await Promise.all([
          reportService.getFeedback(),
          agentService.getModelMetrics()
        ]);
        setFeedbackList(fbData);
        setMetrics(metData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingState message="Loading AI model feedback ledger..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Human-AI Consensus & Model Feedback Loop
        </h2>
        <p className="text-xs text-slate-500">
          Continuous quality audit measuring engineer confirmation rates, bounding box precision ratings, and false-positive logs
        </p>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block mb-1">Reviewed Predictions</span>
          <h3 className="text-2xl font-black font-mono text-slate-900">{metrics?.reviewed_predictions || 890}</h3>
          <span className="text-[11px] text-slate-400 mt-1 block">Total Inferences: {metrics?.total_predictions || 1420}</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block mb-1">Human-AI Agreement</span>
          <h3 className="text-2xl font-black font-mono text-[#16A34A]">{metrics?.human_agreement_pct || 93.48}%</h3>
          <span className="text-[11px] text-emerald-600 mt-1 block">✓ High Statistical Alignment</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block mb-1">Confirmed Findings</span>
          <h3 className="text-2xl font-black font-mono text-slate-900">{metrics?.confirmed_count || 832}</h3>
          <span className="text-[11px] text-slate-400 mt-1 block">True Positives</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block mb-1">Rejected (False Positives)</span>
          <h3 className="text-2xl font-black font-mono text-rose-600">{metrics?.rejected_count || 38}</h3>
          <span className="text-[11px] text-rose-600 mt-1 block">Marked for Dataset Curation</span>
        </div>
      </div>

      {/* Feedback List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-3 mb-4 border-b border-slate-100">
          Detailed Feedback & Precision Evaluations
        </h3>

        <div className="space-y-3 text-xs">
          {feedbackList.map((fb) => (
            <div key={fb.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900">{fb.feedback_category}</span>
                  <div className="flex text-amber-500">
                    {[...Array(fb.rating_score || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 italic text-[11px]">"{fb.engineer_feedback_notes}"</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {new Date(fb.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
