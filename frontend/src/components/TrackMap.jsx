import React, { useState } from 'react';
import { MapPin, ShieldAlert, Activity, Navigation, ArrowRight, X, Gauge, ShieldCheck } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Link } from 'react-router-dom';

export const TrackMap = ({ sections = [], onSelectSection, selectedSectionId }) => {
  const [activeSection, setActiveSection] = useState(
    sections.find(s => s.id === selectedSectionId) || sections[0] || null
  );

  const handleMarkerClick = (section) => {
    setActiveSection(section);
    if (onSelectSection) onSelectSection(section);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CRITICAL': return { bg: 'bg-rose-500', ring: 'ring-rose-300', text: 'text-rose-600', fill: '#EF4444' };
      case 'HIGH': return { bg: 'bg-orange-500', ring: 'ring-orange-300', text: 'text-orange-600', fill: '#F97316' };
      case 'WATCH': return { bg: 'bg-amber-400', ring: 'ring-amber-200', text: 'text-amber-600', fill: '#FBBF24' };
      case 'NORMAL': return { bg: 'bg-emerald-400', ring: 'ring-emerald-200', text: 'text-emerald-600', fill: '#34D399' };
      case 'HEALTHY': return { bg: 'bg-emerald-600', ring: 'ring-emerald-300', text: 'text-emerald-700', fill: '#059669' };
      default: return { bg: 'bg-slate-400', ring: 'ring-slate-200', text: 'text-slate-600', fill: '#94A3B8' };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm relative flex flex-col h-[520px]">
      {/* Map Control Bar */}
      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#16A34A]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Geospatial Track Infrastructure Network (Synthetic Corridor)
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Healthy</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Watch</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /> Critical</span>
        </div>
      </div>

      {/* Interactive Synthetic Vector Canvas Map */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden p-6 select-none flex items-center justify-center">
        {/* Synthetic Topology Grid Lines */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* High-Speed Corridor Line SVG */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Main Track Line Graphic */}
          <path
            d="M 60 420 Q 220 360, 360 260 T 640 180 T 880 90"
            fill="none"
            stroke="#334155"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 60 420 Q 220 360, 360 260 T 640 180 T 880 90"
            fill="none"
            stroke="#16A34A"
            strokeWidth="3"
            strokeDasharray="6,6"
          />
          
          {/* Spur Branch */}
          <path
            d="M 360 260 Q 480 340, 720 380"
            fill="none"
            stroke="#475569"
            strokeWidth="6"
            strokeDasharray="4,4"
          />
        </svg>

        {/* Interactive Track Section Marker Nodes */}
        <div className="relative w-full h-full z-10">
          {sections.map((sec, idx) => {
            const colors = getStatusColor(sec.health_status);
            // Distribute markers along synthetic track line
            const leftPct = 8 + (idx * 11) % 84;
            const topPct = 82 - (idx * 9) % 72;

            const isSelected = activeSection?.id === sec.id;

            return (
              <button
                key={sec.id || idx}
                onClick={() => handleMarkerClick(sec)}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 focus:outline-none`}
              >
                <div className={`relative flex items-center justify-center`}>
                  {/* Ping animation for critical nodes */}
                  {sec.health_status === 'CRITICAL' && (
                    <span className="absolute w-8 h-8 rounded-full bg-rose-500 opacity-75 animate-ping" />
                  )}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-[10px] text-white shadow-lg transition-transform ${colors.bg} ${
                      isSelected ? 'ring-4 ring-white scale-125 z-20' : 'hover:scale-110'
                    }`}
                  >
                    {sec.section_code.replace('TRK-', '')}
                  </div>
                </div>

                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-950/95 text-white text-[11px] rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl border border-slate-700 z-30">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>{sec.section_code}</span>
                    <span className={`text-[10px] font-mono ${colors.text}`}>{sec.deterioration_score}/100</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{sec.name}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Section Slide-over Detail Drawer */}
        {activeSection && (
          <div className="absolute bottom-4 right-4 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-slate-200 z-30 transition-all">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Corridor Detail</span>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  {activeSection.section_code}
                  <StatusBadge status={activeSection.health_status} />
                </h4>
              </div>
              <button
                onClick={() => setActiveSection(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium mt-2">{activeSection.name}</p>

            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Deterioration Index</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {activeSection.deterioration_score}/100
                </span>
              </div>

              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Speed Rating</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {activeSection.max_speed_kmh || 140} km/h
                </span>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-600 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
              <strong className="text-amber-900">Latest Finding: </strong>
              {activeSection.deterioration_score > 65
                ? "Surface Crack localized with 94.7% confidence. Engineer review pending."
                : "Nominal trackbed condition. Standard scheduled patrol active."}
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
              <Link
                to={`/inspections?track_section=${activeSection.section_code}`}
                className="text-xs font-bold text-[#16A34A] hover:text-[#14532D] flex items-center gap-1"
              >
                View Inspections <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to={`/sensors?track_section=${activeSection.section_code}`}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Live Telemetry
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
