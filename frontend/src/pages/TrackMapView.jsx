import React, { useState, useEffect } from 'react';
import { TrackMap } from '../components/TrackMap';
import { inspectionService } from '../services/inspectionService';
import { LoadingState } from '../components/ReviewModal';
import { Map, Navigation, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const TrackMapView = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const data = await inspectionService.getTrackSections();
        setSections(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadTracks();
  }, []);

  if (loading) return <LoadingState message="Loading geospatial track network..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Interactive Geospatial Track Infrastructure Map
        </h2>
        <p className="text-xs text-slate-500">
          Geospatial corridor surveillance with real-time Deterioration Index (0-100) overlay and speed limit tracking
        </p>
      </div>

      <div>
        <TrackMap sections={sections} />
      </div>

      {/* Grid of Track Corridors */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider text-xs">
          Monitored Corridor Segments ({sections.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {sections.map((sec) => (
            <div
              key={sec.id}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-slate-900">{sec.section_code}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  sec.health_status === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                  sec.health_status === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                  sec.health_status === 'WATCH' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {sec.health_status}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] truncate mb-2">{sec.name}</p>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between font-mono text-[10px] text-slate-500">
                <span>Deterioration: <strong className="text-slate-900">{sec.deterioration_score}/100</strong></span>
                <span>Max: {sec.max_speed_kmh} km/h</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
