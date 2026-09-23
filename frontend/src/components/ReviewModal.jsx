import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, FileCheck, ShieldAlert, X } from 'lucide-react';
import { reportService } from '../services/reportService';
import { useNotifications } from '../context/NotificationContext';

export const ReviewModal = ({ isOpen, onClose, inspection, anomaly, onReviewSubmitted }) => {
  const [decision, setDecision] = useState('CONFIRM');
  const [comment, setComment] = useState('');
  const [workOrder, setWorkOrder] = useState(true);
  const [speedRestriction, setSpeedRestriction] = useState(false);
  const [speedLimit, setSpeedLimit] = useState(80);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useNotifications();

  if (!isOpen || !inspection) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      addToast("Please provide engineering rationale comments.", "warning");
      return;
    }

    setSubmitting(true);
    try {
      await reportService.submitReview({
        inspection_id: inspection.id,
        anomaly_id: anomaly?.id,
        decision,
        engineering_comment: comment,
        work_order_required: workOrder,
        speed_restriction_required: speedRestriction,
        temporary_speed_limit_kmh: speedRestriction ? speedLimit : null
      });

      addToast(`Inspection ${inspection.inspection_code} review saved as ${decision}.`, 'success');
      if (onReviewSubmitted) onReviewSubmitted();
      onClose();
    } catch (err) {
      addToast("Failed to save review.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Human-in-the-Loop Governance
            </span>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#16A34A]" />
              Engineer Review & Work Order Authorization
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* AI Finding Recap */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-800">
                AI Finding: {anomaly?.anomaly_type || 'Surface Crack'}
              </span>
              <span className="font-mono text-emerald-700 font-bold">
                {Math.round((anomaly?.confidence || inspection?.ai_confidence || 0.94) * 100)}% Confidence
              </span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Corridor: <strong className="font-mono">{inspection.track_section_code || 'TRK-014'}</strong> • Inspection: <strong className="font-mono">{inspection.inspection_code}</strong>
            </p>
          </div>

          {/* Decision Selection Options */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">Select Engineering Decision:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDecision('CONFIRM')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  decision === 'CONFIRM'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>CONFIRM</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('REJECT')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  decision === 'REJECT'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-500 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>REJECT</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('NEEDS_FURTHER_INSPECTION')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  decision === 'NEEDS_FURTHER_INSPECTION'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <span className="text-[10px] leading-tight">FURTHER VERIFY</span>
              </button>
            </div>
          </div>

          {/* Mandatory Engineering Comment */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Engineering Rationale & Maintenance Prescription: <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Visual evidence appears consistent with rolling contact fatigue crack. Dispatch ultrasonic team for rail grinding."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Operational Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={workOrder}
                onChange={(e) => setWorkOrder(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-800 font-medium">Issue Track Maintenance Work Order</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={speedRestriction}
                onChange={(e) => setSpeedRestriction(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="text-slate-800 font-medium">Impose Temporary Emergency Speed Restriction</span>
            </label>

            {speedRestriction && (
              <div className="ml-6 flex items-center gap-2 mt-1">
                <span className="text-slate-500">Speed Limit:</span>
                <input
                  type="number"
                  value={speedLimit}
                  onChange={(e) => setSpeedLimit(Number(e.target.value))}
                  className="w-20 p-1 border rounded font-mono font-bold"
                />
                <span className="text-slate-500 font-mono">km/h</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#14532D] text-white hover:bg-[#16A34A] font-bold shadow-md transition-all"
            >
              {submitting ? 'Submitting...' : 'Sign & Certify Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const PriorityCard = ({ priority, onInspect }) => {
  const getStyle = (prio) => {
    switch (prio) {
      case 'CRITICAL': return { border: 'border-l-rose-500', bg: 'bg-rose-50/50', badge: 'bg-rose-600 text-white' };
      case 'HIGH': return { border: 'border-l-orange-500', bg: 'bg-orange-50/50', badge: 'bg-orange-500 text-white' };
      case 'MEDIUM': return { border: 'border-l-amber-500', bg: 'bg-amber-50/50', badge: 'bg-amber-400 text-slate-900 font-bold' };
      default: return { border: 'border-l-emerald-500', bg: 'bg-emerald-50/50', badge: 'bg-emerald-600 text-white' };
    }
  };

  const style = getStyle(priority.priority_level);

  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm border-l-4 ${style.border}`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Corridor</span>
          <h4 className="text-base font-black text-slate-900 font-mono">{priority.track_section_code}</h4>
          <p className="text-xs text-slate-600">{priority.track_section_name}</p>
        </div>
        <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${style.badge}`}>
          {priority.priority_level}
        </span>
      </div>

      <div className="my-3 space-y-1">
        {priority.contributing_reasons?.map((reason, idx) => (
          <div key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>{reason}</span>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="font-mono text-slate-500">SLA: {priority.dispatch_sla_hours} Hours</span>
        <button
          onClick={() => onInspect && onInspect(priority)}
          className="text-[#16A34A] font-bold hover:text-[#14532D]"
        >
          View Triage →
        </button>
      </div>
    </div>
  );
};

export const LoadingState = ({ message = "Loading railway infrastructure intelligence..." }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="w-10 h-10 border-4 border-[#16A34A]/20 border-t-[#16A34A] rounded-full animate-spin mb-3" />
    <p className="text-xs font-semibold text-slate-600">{message}</p>
  </div>
);

export const EmptyState = ({ title = "No records found", message = "No data matching your current filters.", actionText, onAction }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto my-6">
    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
      🔍
    </div>
    <h4 className="text-sm font-bold text-slate-900 mb-1">{title}</h4>
    <p className="text-xs text-slate-500 mb-4">{message}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold hover:bg-[#16A34A] transition-all"
      >
        {actionText}
      </button>
    )}
  </div>
);

export const ErrorState = ({ message = "An error occurred while loading data.", onRetry }) => (
  <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center max-w-md mx-auto my-6 text-xs">
    <ShieldAlert className="w-8 h-8 text-rose-600 mx-auto mb-2" />
    <h4 className="font-bold text-rose-900 mb-1">Service Communication Issue</h4>
    <p className="text-rose-700 mb-3">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700"
      >
        Retry
      </button>
    )}
  </div>
);
