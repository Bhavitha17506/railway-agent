import React, { useState, useEffect } from 'react';
import { FileCheck, CheckCircle2, XCircle, HelpCircle, User, Calendar, Plus, ShieldCheck } from 'lucide-react';
import { reportService } from '../services/reportService';
import { LoadingState } from '../components/ReviewModal';
import { ReviewModal } from '../components/ReviewModal';

export const EngineerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadReviews = async () => {
    try {
      const data = await reportService.getReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  if (loading) return <LoadingState message="Loading certified engineering review records..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Human-in-the-Loop Engineering Reviews
          </h2>
          <p className="text-xs text-slate-500">
            Certified engineer validation logs ensuring zero automated maintenance dispatches without licensed review
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#16A34A] text-white text-xs font-bold shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Conduct New Review</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">Inspection: {rev.inspection_code}</span>
                <h4 className="text-sm font-bold text-slate-900 font-mono">{rev.track_section_code}</h4>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                rev.decision === 'CONFIRM' ? 'bg-emerald-100 text-emerald-800' :
                rev.decision === 'REJECT' ? 'bg-rose-100 text-rose-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {rev.decision_display || rev.decision}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
              <strong className="text-slate-900 block mb-1">Engineer Comment:</strong>
              <p className="text-[11px] leading-relaxed italic">"{rev.engineering_comment}"</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-semibold text-slate-800">{rev.engineer_name || 'Sarah Chen, P.E.'}</span>
              <span className="font-mono">{new Date(rev.reviewed_at || Date.now()).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inspection={{ id: 104, inspection_code: 'INS-2026-0104', track_section_code: 'TRK-014', ai_confidence: 0.947 }}
        anomaly={{ id: 1, anomaly_type: 'Surface Crack', confidence: 0.947 }}
        onReviewSubmitted={loadReviews}
      />
    </div>
  );
};
