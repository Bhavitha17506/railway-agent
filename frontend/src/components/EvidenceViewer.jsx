import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Layers, Eye, ShieldAlert } from 'lucide-react';
import { SeverityBadge, ConfidenceBar } from './StatusBadge';

export const EvidenceViewer = ({
  originalImage,
  annotatedImage,
  anomalyType = "Surface Crack",
  severity = "HIGH",
  confidence = 0.947,
  boundingBox = { x: 220, y: 240, width: 260, height: 140 },
  explanation,
  trackSection = "TRK-014",
  timestamp = "2026-09-18 08:32 UTC"
}) => {
  const [showAnnotated, setShowAnnotated] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.min(2.5, Math.max(0.8, prev + delta)));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Evidence Header */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100 text-[#14532D]">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Optical Computer Vision Evidence: {trackSection}
              <SeverityBadge severity={severity} />
            </h4>
            <p className="text-xs text-slate-500">Captured at {timestamp} • Gauge Corner Inspection Array</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAnnotated(!showAnnotated)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              showAnnotated
                ? 'bg-[#14532D] text-white border-[#14532D]'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {showAnnotated ? 'Annotated Overlays ON' : 'Raw Optical Frame'}
          </button>

          <button
            onClick={() => handleZoom(0.2)}
            className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.2)}
            className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="relative w-full h-80 bg-slate-900 overflow-hidden flex items-center justify-center p-4">
        {/* Render simulated high-fidelity railway track with defect overlay if no static file */}
        <div
          className="relative transition-transform duration-200 select-none cursor-grab"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Base Track Canvas */}
          <div className="w-[600px] h-[300px] bg-slate-800 rounded-lg relative overflow-hidden border border-slate-700 shadow-2xl flex flex-col justify-center">
            {/* Sleeper Tie */}
            <div className="absolute inset-x-8 top-8 bottom-8 bg-stone-700/80 rounded border-y-2 border-stone-600" />
            {/* Rail Base Flange */}
            <div className="absolute inset-x-0 h-32 bg-slate-700 border-y border-slate-600 shadow-inner" />
            {/* Rail Running Surface */}
            <div className="absolute inset-x-0 h-16 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 shadow-md border-y border-slate-400 flex items-center justify-center">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold opacity-40">
                UIC 60 Rail Running Band • Gauge Face
              </span>
            </div>

            {/* Crack / Defect Visualization */}
            <div className="absolute left-[240px] top-[135px] w-24 h-6 border-b-2 border-slate-900 border-dashed transform -rotate-12 opacity-90" />
            <div className="absolute left-[250px] top-[140px] w-16 h-3 bg-red-950/80 rounded-full blur-[1px]" />

            {/* AI Bounding Box & Annotation Overlay */}
            {showAnnotated && (
              <div
                className="absolute border-2 border-rose-500 bg-rose-500/15 rounded transition-all duration-300"
                style={{
                  left: `${boundingBox.x || 220}px`,
                  top: `${(boundingBox.y ? boundingBox.y / 2 : 110)}px`,
                  width: `${boundingBox.width || 200}px`,
                  height: `${boundingBox.height || 80}px`
                }}
              >
                <div className="absolute -top-6 left-0 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-t whitespace-nowrap shadow flex items-center gap-1 font-mono">
                  <ShieldAlert className="w-3 h-3" />
                  {anomalyType} • {(confidence * 100).toFixed(1)}%
                </div>
                <div className="absolute bottom-1 right-1 bg-slate-950/80 text-[10px] text-amber-300 px-1.5 py-0.5 rounded font-mono">
                  Length: 7.8mm • Severity: {severity}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Confidence Widget */}
        <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md border border-slate-800 text-white p-3 rounded-xl max-w-xs shadow-xl">
          <ConfidenceBar confidence={confidence} label="CV Detection Certainty" showExplanation={false} />
          <p className="text-[11px] text-slate-300 mt-2 line-clamp-2">
            {explanation || "Crack-like transverse fissure detected along the rail surface with high edge gradient."}
          </p>
        </div>
      </div>

      {/* Engineering Diagnostic Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 block">Anomaly Classification:</span>
          <span className="font-bold text-slate-900">{anomalyType}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Estimated Defect Area:</span>
          <span className="font-mono font-bold text-slate-900">28.4 mm² (±1.2mm)</span>
        </div>
        <div>
          <span className="text-slate-500 block">Physical Location:</span>
          <span className="font-mono font-bold text-slate-900">KP 14.200 (Gauge Face)</span>
        </div>
        <div>
          <span className="text-slate-500 block">Verification Status:</span>
          <span className="font-bold text-amber-700">Awaiting Licensed Engineer Signature</span>
        </div>
      </div>
    </div>
  );
};
