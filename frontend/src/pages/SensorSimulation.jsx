import React, { useState, useEffect } from 'react';
import { Activity, Play, Square, AlertTriangle, RotateCcw, Zap, Thermometer, ShieldAlert, Cpu } from 'lucide-react';
import { SensorChart } from '../components/SensorChart';
import { sensorService } from '../services/sensorService';
import { useNotifications } from '../context/NotificationContext';
import { LoadingState } from '../components/ReviewModal';

export const SensorSimulation = () => {
  const [data, setData] = useState(null);
  const [activeMetric, setActiveMetric] = useState('vibration_rms');
  const [isSimulating, setIsSimulating] = useState(true);
  const [injectAnomaly, setInjectAnomaly] = useState(false);
  const [trackSection, setTrackSection] = useState('TRK-014');
  const [loading, setLoading] = useState(true);

  const { addToast } = useNotifications();

  const fetchReadings = async (inject = injectAnomaly) => {
    try {
      const res = await sensorService.getLiveReadings(trackSection, 20, inject);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings(injectAnomaly);
    let interval = null;
    if (isSimulating) {
      interval = setInterval(() => {
        fetchReadings(injectAnomaly);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, injectAnomaly, trackSection]);

  const handleInjectAnomaly = () => {
    const nextState = !injectAnomaly;
    setInjectAnomaly(nextState);
    fetchReadings(nextState);
    if (nextState) {
      addToast("High vibration spike & dynamic stress anomaly injected!", "warning");
    } else {
      addToast("Sensor parameters restored to nominal baseline.", "info");
    }
  };

  const handleReset = () => {
    setInjectAnomaly(false);
    fetchReadings(false);
    addToast("Sensor simulation reset to physical nominal baseline.", "info");
  };

  if (loading) return <LoadingState message="Connecting to IoT telemetry emulator..." />;

  const current = data?.current_metrics || {};
  const baseline = data?.baseline || {};

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Live IoT Trackbed Sensor Telemetry Simulation
          </h2>
          <p className="text-xs text-slate-500">
            Real-time physics-correlated telemetry: Vibration RMS, dynamic mechanical stress, temperature, and acoustic emissions
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={trackSection}
            onChange={(e) => setTrackSection(e.target.value)}
            className="p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
          >
            <option value="TRK-014">TRK-014 (Northern Valley KP 14.2)</option>
            <option value="TRK-007">TRK-007 (Coastal Freight Curve)</option>
            <option value="TRK-021">TRK-021 (East Switch Crossover)</option>
            <option value="TRK-003">TRK-003 (Central Express Tunnel)</option>
          </select>

          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              isSimulating ? 'bg-[#14532D] text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {isSimulating ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isSimulating ? 'STOP SIMULATION' : 'START SIMULATION'}
          </button>

          <button
            onClick={handleInjectAnomaly}
            className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              injectAnomaly
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {injectAnomaly ? 'ANOMALY ACTIVE' : 'INJECT ANOMALY'}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
            title="Reset to Baseline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Synthetic Notice Banner */}
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
        <Cpu className="w-4 h-4 text-[#16A34A] shrink-0" />
        <span className="font-semibold">
          NOTICE: Telemetry values are physics-correlated synthetic streams generated for demonstration and sensor agent training.
        </span>
      </div>

      {/* Live Readout Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveMetric('vibration_rms')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeMetric === 'vibration_rms'
              ? 'bg-white border-[#16A34A] ring-2 ring-emerald-500 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Vibration RMS</span>
          <h3 className="text-2xl font-black font-mono text-slate-900">{current.vibration_rms || 2.4} <span className="text-xs font-normal text-slate-500">m/s²</span></h3>
          <span className="text-[11px] text-slate-500 block mt-1">Baseline: {baseline.baseline_vibration_rms || 2.4} m/s²</span>
        </button>

        <button
          onClick={() => setActiveMetric('track_stress')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeMetric === 'track_stress'
              ? 'bg-white border-orange-500 ring-2 ring-orange-500 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Dynamic Stress</span>
          <h3 className="text-2xl font-black font-mono text-slate-900">{current.track_stress || 45.0} <span className="text-xs font-normal text-slate-500">MPa</span></h3>
          <span className="text-[11px] text-slate-500 block mt-1">Baseline: {baseline.baseline_stress || 45.0} MPa</span>
        </button>

        <button
          onClick={() => setActiveMetric('rail_temperature')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeMetric === 'rail_temperature'
              ? 'bg-white border-sky-500 ring-2 ring-sky-500 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Rail Temperature</span>
          <h3 className="text-2xl font-black font-mono text-slate-900">{current.rail_temperature || 22.0} <span className="text-xs font-normal text-slate-500">°C</span></h3>
          <span className="text-[11px] text-slate-500 block mt-1">Ambient: 20.4 °C</span>
        </button>

        <button
          onClick={() => setActiveMetric('acoustic_db')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeMetric === 'acoustic_db'
              ? 'bg-white border-purple-500 ring-2 ring-purple-500 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Acoustic Level</span>
          <h3 className="text-2xl font-black font-mono text-slate-900">{current.acoustic_db || 68.0} <span className="text-xs font-normal text-slate-500">dB</span></h3>
          <span className="text-[11px] text-slate-500 block mt-1">Ultrasonic Signature</span>
        </button>
      </div>

      {/* Live Recharts Chart */}
      <div>
        <SensorChart
          readings={data?.readings || []}
          baseline={baseline}
          activeMetric={activeMetric}
        />
      </div>
    </div>
  );
};
