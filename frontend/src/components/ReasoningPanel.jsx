import React from 'react';
import { Eye, Activity, History, Gauge, ShieldAlert, CheckCircle2, AlertTriangle, ArrowDown } from 'lucide-react';

export const ReasoningPanel = ({
  visionFinding = "Surface crack detected with 94.7% confidence along gauge corner.",
  sensorFinding = "Vibration spike (+18.4% above baseline) & Dynamic stress at 71 MPa.",
  historyFinding = "Previous inspection recorded smaller defect (+85.7% growth in 180 days).",
  deteriorationScore = 68,
  riskLevel = "HIGH",
  priorityLevel = "HIGH",
  actionRecommendation = "Schedule track ultrasonic test and visual manual inspection within 48 hours."
}) => {
  const steps = [
    {
      agent: "Vision Agent",
      icon: Eye,
      color: "text-emerald-700 bg-emerald-100 border-emerald-300",
      status: "Detected",
      finding: visionFinding,
      detail: "Localized Transverse Defect • Gauge Profile Contour"
    },
    {
      agent: "Sensor Agent",
      icon: Activity,
      color: "text-amber-700 bg-amber-100 border-amber-300",
      status: "Warning",
      finding: sensorFinding,
      detail: "Deviation: +18.4% • Acoustic Signature Shift"
    },
    {
      agent: "Historical Agent",
      icon: History,
      color: "text-amber-700 bg-amber-100 border-amber-300",
      status: "Warning",
      finding: historyFinding,
      detail: "Rate: 0.60 mm/month • Active Growth Cycle"
    },
    {
      agent: "Deterioration Agent",
      icon: Gauge,
      color: "text-orange-700 bg-orange-100 border-orange-300",
      status: "Scored",
      finding: `Composite Deterioration Index calculated at ${deteriorationScore}/100 (Watch / Elevated band).`,
      detail: "Multi-factor weighted index: Visual (35%) + Sensor (25%) + History (25%) + Recency (15%)"
    },
    {
      agent: "Risk Agent",
      icon: ShieldAlert,
      color: "text-rose-700 bg-rose-100 border-rose-300",
      status: "Elevated Attention",
      finding: `Risk categorized as ${riskLevel} based on multi-source evidence corroboration.`,
      detail: "Synthesized multi-modal factors into explainable safety rating"
    },
    {
      agent: "Priority Agent",
      icon: AlertTriangle,
      color: "text-rose-700 bg-rose-100 border-rose-300",
      status: "Priority Triage",
      finding: `Assigned inspection triage priority: ${priorityLevel}. ${actionRecommendation}`,
      detail: "Recommended 48-Hour Engineering Verification Window"
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
            AI Inspection Multi-Agent Reasoning Dossier
          </h4>
          <p className="text-xs text-slate-500">Transparent, explainable evidence & decision factors</p>
        </div>

        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
          Advisory Intelligence
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative">
              <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-all">
                <div className={`p-2 rounded-lg border ${step.color} shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{step.agent}</span>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500">{step.status}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 mt-1">{step.finding}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{step.detail}</p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="flex justify-center my-1 text-slate-300">
                  <ArrowDown className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
