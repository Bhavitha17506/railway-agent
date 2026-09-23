import React, { useState, useEffect } from 'react';
import { PriorityCard } from '../components/ReviewModal';
import { agentService } from '../services/agentService';
import { LoadingState } from '../components/ReviewModal';
import { ShieldAlert, AlertTriangle, Clock, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MaintenancePriorityView = () => {
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPriorities = async () => {
      try {
        const data = await agentService.getPriorities();
        setPriorities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPriorities();
  }, []);

  if (loading) return <LoadingState message="Calculating maintenance triage priorities..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Track Infrastructure Maintenance & Inspection Priority Triage
        </h2>
        <p className="text-xs text-slate-500">
          Risk-weighted triage engine assigning action priorities based on visual severity, vibration deltas, and historical growth velocity
        </p>
      </div>

      {/* Priority Levels SLA Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl">
          <span className="font-bold text-rose-900 block text-sm">CRITICAL (6h Window)</span>
          <p className="text-rose-700 text-[11px] mt-1">Immediate speed restriction & emergency track patrol dispatch.</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl">
          <span className="font-bold text-orange-900 block text-sm">HIGH (48h Window)</span>
          <p className="text-orange-700 text-[11px] mt-1">Physical ultrasonic rail verification and fastener check.</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
          <span className="font-bold text-amber-900 block text-sm">MEDIUM (14d Window)</span>
          <p className="text-amber-700 text-[11px] mt-1">Scheduled routine maintenance and sensor re-calibration.</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
          <span className="font-bold text-emerald-900 block text-sm">LOW (Routine Patrol)</span>
          <p className="text-emerald-700 text-[11px] mt-1">Corridor operates inside nominal baseline envelope.</p>
        </div>
      </div>

      {/* Priority Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {priorities.map((prio) => (
          <PriorityCard
            key={prio.id}
            priority={prio}
            onInspect={(p) => navigate(`/inspections?track_section=${p.track_section_code}`)}
          />
        ))}
      </div>
    </div>
  );
};
