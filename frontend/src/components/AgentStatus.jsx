import React from 'react';
import { Bot, Cpu, CheckCircle2, AlertTriangle, Clock, Zap } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const AgentStatus = ({ agents = [] }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#16A34A]" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">Multi-Agent AI Pipeline Orchestration</h4>
            <p className="text-xs text-slate-500">Autonomous specialized perception & synthesis agents</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          7/7 Agents Operational
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {agents.map((agent, idx) => (
          <div
            key={agent.id || idx}
            className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h5 className="text-xs font-bold text-slate-900">{agent.name}</h5>
                <p className="text-[11px] text-slate-500 truncate max-w-[140px]">{agent.role}</p>
              </div>
              <StatusBadge status={agent.status} />
            </div>

            <p className="text-[11px] text-slate-600 line-clamp-2 my-2">
              {agent.description || agent.findings_summary}
            </p>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {agent.last_run || `${agent.latency_ms || 45}ms`}
              </span>
              <span className="font-semibold text-emerald-700">
                {agent.confidence_avg ? `${agent.confidence_avg}% Conf` : 'Active'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
