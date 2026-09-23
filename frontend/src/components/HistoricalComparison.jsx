import React, { useState } from 'react';
import { ArrowRight, TrendingUp, Calendar, AlertTriangle, Scale } from 'lucide-react';

export const HistoricalComparison = ({
  trackSection = "TRK-014",
  previousDate = "2026-03-20",
  currentDate = "2026-09-18",
  previousMetric = "4.2 mm",
  currentMetric = "7.8 mm",
  deltaPct = 85.7,
  metricName = "Crack Length",
  anomalyType = "Surface Crack",
  aiAssessment = "Accelerated growth trajectory observed. Surface fissure widening exceeds standard 0.2mm/month nominal threshold."
}) => {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Comparison Header */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-900">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Temporal Deterioration Comparison: {trackSection}
            </h4>
            <p className="text-xs text-slate-500">Side-by-side historical progression analysis (180-Day Delta)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
            Growth: +{deltaPct}%
          </span>
        </div>
      </div>

      {/* Split Comparison Slider Container */}
      <div className="relative w-full h-80 bg-slate-950 overflow-hidden select-none">
        {/* Previous Inspection Visual Layer (Left) */}
        <div className="absolute inset-0 w-full h-full bg-slate-800 flex items-center justify-center">
          <div className="w-[500px] h-[240px] bg-slate-700 rounded-lg relative overflow-hidden flex flex-col justify-center items-center shadow-lg">
            <div className="w-full h-16 bg-slate-400 border-y border-slate-500 flex items-center justify-center">
              <span className="text-[11px] font-mono text-slate-700 font-bold">UIC 60 Running Band (March 2026)</span>
            </div>
            {/* Small crack */}
            <div className="absolute left-[240px] top-[108px] w-10 h-3 border-b-2 border-slate-950 border-dashed transform -rotate-6" />
            <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[11px] px-2 py-1 rounded font-mono border border-slate-700">
              PRIOR INSPECTION ({previousDate})
            </div>
            <div className="absolute bottom-3 left-3 bg-emerald-950/90 text-emerald-200 text-xs px-2.5 py-1 rounded font-mono border border-emerald-800">
              {metricName}: {previousMetric}
            </div>
          </div>
        </div>

        {/* Current Inspection Visual Layer (Right - Clipped by Slider) */}
        <div
          className="absolute inset-0 w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden"
          style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
        >
          <div className="w-[500px] h-[240px] bg-slate-800 rounded-lg relative overflow-hidden flex flex-col justify-center items-center shadow-2xl border border-rose-900/50">
            <div className="w-full h-16 bg-slate-300 border-y border-slate-400 flex items-center justify-center">
              <span className="text-[11px] font-mono text-slate-700 font-bold">UIC 60 Running Band (September 2026)</span>
            </div>
            {/* Expanded crack with red contour box */}
            <div className="absolute left-[230px] top-[100px] w-24 h-6 border-b-2 border-red-600 border-dashed transform -rotate-12" />
            <div className="absolute left-[225px] top-[95px] w-28 h-10 border border-rose-500 bg-rose-500/20 rounded" />
            <div className="absolute top-3 right-3 bg-rose-950/90 text-rose-200 text-[11px] px-2 py-1 rounded font-mono border border-rose-800">
              CURRENT INSPECTION ({currentDate})
            </div>
            <div className="absolute bottom-3 right-3 bg-rose-950/90 text-rose-200 text-xs px-2.5 py-1 rounded font-mono border border-rose-800">
              {metricName}: {currentMetric} (+{deltaPct}%)
            </div>
          </div>
        </div>

        {/* Interactive Slider Divider Bar */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.8)]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -left-3.5 w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center text-xs font-bold border border-slate-300">
            ↔
          </div>
        </div>

        {/* Native Range input overlaid for seamless touch/mouse dragging */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        />
      </div>

      {/* Comparison Metrics Grid */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <span className="text-slate-500 block mb-1">Previous Baseline ({previousDate}):</span>
          <span className="text-sm font-black font-mono text-slate-800">{previousMetric}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Status: Moderate Surface Wear</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <span className="text-slate-500 block mb-1">Current Scan ({currentDate}):</span>
          <span className="text-sm font-black font-mono text-rose-600">{currentMetric}</span>
          <span className="text-[11px] text-rose-600 font-semibold block mt-0.5">Delta: +{deltaPct}% (+3.6mm Expansion)</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <span className="text-slate-500 block mb-1">Wear Velocity:</span>
          <span className="text-sm font-black font-mono text-amber-600">0.60 mm / Month</span>
          <span className="text-[11px] text-amber-700 block mt-0.5">Exceeds 0.20 mm/mo Standard Limit</span>
        </div>
      </div>

      {/* AI Explainability Banner */}
      <div className="p-3 bg-amber-50 border-t border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong className="font-bold">Historical Agent Finding:</strong> {aiAssessment}
          <span className="block text-[11px] text-amber-700/80 mt-0.5">
            Note: Dimensions and deltas are derived from calibrated edge-pixel scaling algorithms and demo datasets.
          </span>
        </p>
      </div>
    </div>
  );
};
