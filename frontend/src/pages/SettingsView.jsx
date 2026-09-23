import React, { useState } from 'react';
import { Settings, Sliders, Database, Shield, Bell, CheckCircle2, Save } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export const SettingsView = () => {
  const [weights, setWeights] = useState({
    visual: 35,
    sensor: 25,
    history: 25,
    recency: 15
  });
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.75);
  const [enableDemoMode, setEnableDemoMode] = useState(true);
  const { addToast } = useNotifications();

  const handleSave = (e) => {
    e.preventDefault();
    addToast("System settings and deterioration weighting formula updated.", "success");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          System & AI Configuration Settings
        </h2>
        <p className="text-xs text-slate-500">
          Configure multi-agent decision thresholds, composite Deterioration Index weights, and database routing
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Deterioration Index Factor Weights (Section 20 of prompt) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-[#16A34A]" />
            <h3 className="text-sm font-bold text-slate-900">
              Deterioration Index Weighted Scoring Formula (0-100 Scale)
            </h3>
          </div>

          <p className="text-slate-600 text-[11px]">
            Adjust the contributing weights for the multi-source deterioration equation: $DI = w_v \cdot V + w_s \cdot S + w_h \cdot H + w_r \cdot R$. (Total must sum to 100%)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border">
              <label className="font-bold text-slate-800 flex justify-between">
                <span>Visual Defect Factor (V):</span>
                <span className="font-mono text-emerald-700">{weights.visual}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="60"
                value={weights.visual}
                onChange={(e) => setWeights({ ...weights, visual: Number(e.target.value) })}
                className="w-full mt-2"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border">
              <label className="font-bold text-slate-800 flex justify-between">
                <span>Sensor Deviation Factor (S):</span>
                <span className="font-mono text-emerald-700">{weights.sensor}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={weights.sensor}
                onChange={(e) => setWeights({ ...weights, sensor: Number(e.target.value) })}
                className="w-full mt-2"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border">
              <label className="font-bold text-slate-800 flex justify-between">
                <span>Historical Growth Factor (H):</span>
                <span className="font-mono text-emerald-700">{weights.history}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={weights.history}
                onChange={(e) => setWeights({ ...weights, history: Number(e.target.value) })}
                className="w-full mt-2"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border">
              <label className="font-bold text-slate-800 flex justify-between">
                <span>Inspection Recency Factor (R):</span>
                <span className="font-mono text-emerald-700">{weights.recency}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={weights.recency}
                onChange={(e) => setWeights({ ...weights, recency: Number(e.target.value) })}
                className="w-full mt-2"
              />
            </div>
          </div>
        </div>

        {/* AI Confidence & Demo Mode Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-5 h-5 text-[#16A34A]" />
            <h3 className="text-sm font-bold text-slate-900">
              AI Confidence Thresholds & Operational Mode
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Minimum AI Confidence Threshold for High-Priority Escalation:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.5"
                  max="0.99"
                  step="0.01"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="font-mono font-bold text-slate-900 w-12">
                  {(confidenceThreshold * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <label className="flex items-center gap-2 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableDemoMode}
                onChange={(e) => setEnableDemoMode(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-bold text-slate-800">
                Enable Synthetic Demo Ingestion & Physics Simulation Mode
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#16A34A] text-white font-bold shadow-md flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
