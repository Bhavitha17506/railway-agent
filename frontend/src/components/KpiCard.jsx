import React from 'react';

export const KpiCard = ({ title, value, subtitle, icon: Icon, trend, color = 'green', badge }) => {
  const colorStyles = {
    green: 'border-l-4 border-l-[#16A34A] text-[#14532D]',
    red: 'border-l-4 border-l-rose-500 text-rose-800',
    amber: 'border-l-4 border-l-amber-500 text-amber-800',
    blue: 'border-l-4 border-l-blue-500 text-blue-800',
    navy: 'border-l-4 border-l-[#0F172A] text-slate-800',
  };

  return (
    <div className={`bg-white rounded-xl p-5 shadow-sm border border-slate-200/80 transition-all hover:shadow-md ${colorStyles[color] || colorStyles.green}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">{value}</h3>
        </div>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-100">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
        <span className="truncate">{subtitle}</span>
        {trend && (
          <span className={`font-semibold ml-2 font-mono ${trend.startsWith('+') ? 'text-rose-600' : 'text-emerald-600'}`}>
            {trend}
          </span>
        )}
        {badge && (
          <span className="ml-2 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
