import React, { useState, useEffect } from 'react';
import { Bot, Cpu, Zap, Activity, Clock, ShieldCheck, ArrowRight, Layers, Eye } from 'lucide-react';
import { AgentStatus } from '../components/AgentStatus';
import { ReasoningPanel } from '../components/ReasoningPanel';
import { inspectionService } from '../services/inspectionService';
import { LoadingState } from '../components/ReviewModal';

export const AIAgentsDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await inspectionService.getDashboardOverview();
        setDashboardData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingState message="Connecting to Multi-Agent Orchestrator..." />;

  const agents = dashboardData?.agent_statuses || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Multi-Agent AI Perception & Synthesis Architecture
        </h2>
        <p className="text-xs text-slate-500">
          Decoupled, explainable agent topology executing asynchronous perception and consensus-driven decision synthesis
        </p>
      </div>

      {/* Multi-Agent Architecture Topology Map Banner */}
      <div className="bg-[#0F172A] text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <span className="text-[11px] font-mono font-bold tracking-wider text-[#FACC15] uppercase block mb-1">
          ORCHESTRATED MULTI-AGENT PIPELINE
        </span>
        <h3 className="text-base font-bold text-white mb-4">
          Hierarchical Multi-Agent Execution Flow (DAG)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-emerald-400 font-bold block mb-1">1. Perception Tier</span>
            <ul className="text-slate-300 text-[11px] space-y-1">
              <li>• Vision Agent (OpenCV)</li>
              <li>• Sensor Agent (Telemetry)</li>
              <li>• Historical Agent (Delta)</li>
            </ul>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-amber-400 font-bold block mb-1">2. Health Scoring</span>
            <ul className="text-slate-300 text-[11px] space-y-1">
              <li>• Deterioration Agent (0-100)</li>
              <li>• Weighted Factor Matrix</li>
              <li>• Recency Multipliers</li>
            </ul>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-rose-400 font-bold block mb-1">3. Triage & Risk</span>
            <ul className="text-slate-300 text-[11px] space-y-1">
              <li>• Risk Synthesis Agent</li>
              <li>• Priority Triage Engine</li>
              <li>• SLA Window Allocation</li>
            </ul>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-sky-400 font-bold block mb-1">4. Human Governance</span>
            <ul className="text-slate-300 text-[11px] space-y-1">
              <li>• Report Dossier Agent</li>
              <li>• Engineer Review Sign-Off</li>
              <li>• Regulatory Audit Logging</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Agents Operational Grid */}
      <div>
        <AgentStatus agents={agents} />
      </div>

      {/* Example Reasoning Panel */}
      <div>
        <ReasoningPanel />
      </div>
    </div>
  );
};
