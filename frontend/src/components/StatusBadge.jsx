import React from 'react';

export const StatusBadge = ({ status }) => {
  const map = {
    'HEALTHY': { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500', label: 'Healthy (0-24)' },
    'NORMAL': { bg: 'bg-green-100 text-green-800 border-green-300', dot: 'bg-green-500', label: 'Normal Wear' },
    'WATCH': { bg: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500', label: 'Watch / Elevated' },
    'HIGH': { bg: 'bg-orange-100 text-orange-800 border-orange-300', dot: 'bg-orange-500', label: 'High Priority' },
    'CRITICAL': { bg: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-500', label: 'Critical' },

    // Inspection Statuses
    'PROCESSING': { bg: 'bg-blue-100 text-blue-800 border-blue-300', dot: 'bg-blue-500 animate-pulse', label: 'Processing' },
    'AI_COMPLETE': { bg: 'bg-cyan-100 text-cyan-800 border-cyan-300', dot: 'bg-cyan-500', label: 'AI Analyzed' },
    'AWAITING_REVIEW': { bg: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500', label: 'Awaiting Review' },
    'REVIEWED': { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500', label: 'Reviewed' },
    'CLOSED': { bg: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-400', label: 'Closed' },

    // Agent Statuses
    'Active': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-300', dot: 'bg-emerald-500 animate-pulse', label: 'Active' },
    'Completed': { bg: 'bg-slate-50 text-slate-700 border-slate-300', dot: 'bg-slate-500', label: 'Completed' },
    'Warning': { bg: 'bg-amber-50 text-amber-700 border-amber-300', dot: 'bg-amber-500', label: 'Warning' },
  };

  const current = map[status] || { bg: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-400', label: status || 'Unknown' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg}`}>
      <span className={`w-2 h-2 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
};

export const SeverityBadge = ({ severity }) => {
  const map = {
    'CRITICAL': 'bg-rose-600 text-white',
    'HIGH': 'bg-orange-500 text-white',
    'MEDIUM': 'bg-amber-400 text-slate-900 font-semibold',
    'LOW': 'bg-emerald-600 text-white',
  };

  const style = map[severity?.toUpperCase()] || 'bg-slate-500 text-white';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${style}`}>
      {severity || 'INFO'}
    </span>
  );
};

export const ConfidenceBar = ({ confidence, label = "AI Confidence", showExplanation = true }) => {
  const pct = Math.round((confidence > 1 ? confidence : confidence * 100));
  
  let color = 'bg-emerald-500';
  let badgeText = 'High Confidence Visual Match';
  if (pct < 70) {
    color = 'bg-amber-500';
    badgeText = 'Moderate Confidence — Corroboration Required';
  }
  if (pct < 50) {
    color = 'bg-rose-500';
    badgeText = 'Low Confidence Visual Signal';
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-xs mb-1">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-mono font-bold text-slate-900">{pct}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showExplanation && (
        <p className="text-[11px] text-slate-500 mt-1 italic">
          "{badgeText}" (Statistical CV probability score, not a certified safety mandate)
        </p>
      )}
    </div>
  );
};
