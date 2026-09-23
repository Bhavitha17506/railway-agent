import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { Activity, Thermometer, ShieldAlert, Cpu } from 'lucide-react';

export const SensorChart = ({ readings = [], baseline = {}, activeMetric = 'vibration_rms' }) => {
  const metricConfig = {
    vibration_rms: {
      label: 'Vibration RMS (m/s²)',
      color: '#16A34A',
      baselineKey: 'baseline_vibration_rms',
      defaultBaseline: 2.4,
      warnThreshold: 4.0,
      critThreshold: 6.5,
      unit: 'm/s²'
    },
    track_stress: {
      label: 'Dynamic Rail Stress (MPa)',
      color: '#EA580C',
      baselineKey: 'baseline_stress',
      defaultBaseline: 45.0,
      warnThreshold: 65.0,
      critThreshold: 85.0,
      unit: 'MPa'
    },
    rail_temperature: {
      label: 'Rail Temperature (°C)',
      color: '#0284C7',
      baselineKey: 'baseline_temperature',
      defaultBaseline: 22.0,
      warnThreshold: 45.0,
      critThreshold: 60.0,
      unit: '°C'
    },
    acoustic_db: {
      label: 'Ultrasonic Acoustic Level (dB)',
      color: '#8B5CF6',
      baselineKey: 'baseline_acoustic_db',
      defaultBaseline: 68.0,
      warnThreshold: 80.0,
      critThreshold: 90.0,
      unit: 'dB'
    }
  };

  const config = metricConfig[activeMetric] || metricConfig.vibration_rms;
  const baselineVal = baseline[config.baselineKey] || config.defaultBaseline;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#16A34A]" />
            Live Sensor Telemetry: {config.label}
          </h4>
          <p className="text-xs text-slate-500">Physics-correlated dynamic sensor stream (Simulated Real-Time)</p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-mono text-slate-600">
            <span className="w-2.5 h-0.5 bg-slate-400" /> Baseline: {baselineVal} {config.unit}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-amber-700">
            <span className="w-2.5 h-0.5 bg-amber-500" /> Warning: {config.warnThreshold} {config.unit}
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={readings} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900/95 border border-slate-800 text-white p-2.5 rounded-lg shadow-xl text-xs font-mono">
                      <p className="text-slate-400 mb-1">{label}</p>
                      <p className="text-emerald-400 font-bold">
                        {config.label}: {payload[0].value} {config.unit}
                      </p>
                      {data.is_anomaly && (
                        <p className="text-rose-400 font-bold mt-1 text-[11px]">
                          ⚠ SPIKE DETECTED (+{(((payload[0].value - baselineVal)/baselineVal)*100).toFixed(1)}%)
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Calibrated Baseline Reference Line */}
            <ReferenceLine y={baselineVal} stroke="#94A3B8" strokeDasharray="4 4" label={{ value: 'Baseline', fill: '#94A3B8', fontSize: 10 }} />
            {/* Warning Threshold Line */}
            <ReferenceLine y={config.warnThreshold} stroke="#EA580C" strokeDasharray="3 3" label={{ value: 'Warning', fill: '#EA580C', fontSize: 10 }} />
            
            <Line
              type="monotone"
              dataKey={activeMetric}
              stroke={config.color}
              strokeWidth={2.5}
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload.is_anomaly) {
                  return (
                    <circle key={props.key} cx={cx} cy={cy} r={5} fill="#DC2626" stroke="#FFFFFF" strokeWidth={2} />
                  );
                }
                return <circle key={props.key} cx={cx} cy={cy} r={2} fill={config.color} />;
              }}
              activeDot={{ r: 6, fill: config.color, stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
