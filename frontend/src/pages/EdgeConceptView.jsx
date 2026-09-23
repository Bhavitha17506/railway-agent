import React, { useState } from 'react';
import { Cpu, Wifi, WifiOff, RefreshCw, CheckCircle2, HardDrive, Server, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export const EdgeConceptView = () => {
  const [syncState, setSyncState] = useState('ONLINE'); // ONLINE, OFFLINE, SYNCING, SYNC_COMPLETE
  const { addToast } = useNotifications();

  const handleSimulateSync = () => {
    setSyncState('SYNCING');
    setTimeout(() => {
      setSyncState('SYNC_COMPLETE');
      addToast("Edge buffer (42 frames) synchronized with Central Django Backend.", "success");
      setTimeout(() => setSyncState('ONLINE'), 3000);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Offline & Edge Processing Architecture Concept
        </h2>
        <p className="text-xs text-slate-500">
          Autonomous trackside edge inference on high-speed inspection trains with resilient local caching and central depot synchronization
        </p>
      </div>

      {/* State Simulator Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-700">Simulate Edge Connectivity State:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSyncState('ONLINE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                syncState === 'ONLINE' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              ONLINE
            </button>
            <button
              onClick={() => setSyncState('OFFLINE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                syncState === 'OFFLINE' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              OFFLINE (Cached)
            </button>
            <button
              onClick={handleSimulateSync}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                syncState === 'SYNCING' ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${syncState === 'SYNCING' ? 'animate-spin' : ''}`} />
              SYNC BATCH
            </button>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono font-bold text-xs ${
          syncState === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' :
          syncState === 'OFFLINE' ? 'bg-amber-100 text-amber-800' :
          syncState === 'SYNCING' ? 'bg-blue-100 text-blue-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          CURRENT STATE: {syncState}
        </span>
      </div>

      {/* Visual Architecture Flow Diagram */}
      <div className="bg-[#0F172A] text-white p-8 rounded-2xl shadow-xl border border-slate-800 space-y-6">
        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
          EDGE-TO-DEPOT INGESTION TOPOLOGY
        </span>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs text-center font-mono">
          <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-2">
            <Cpu className="w-6 h-6 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-white">Trackside Sensors</h4>
            <p className="text-[10px] text-slate-400 font-sans">High-speed optical camera & accelerometer</p>
          </div>

          <div className="flex items-center justify-center text-slate-500">
            <ArrowRight className="w-5 h-5 hidden md:block" />
          </div>

          <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-2">
            <HardDrive className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="font-bold text-white">Edge Inference Unit</h4>
            <p className="text-[10px] text-slate-400 font-sans">Local Jetson/NPU OpenCV model & SQLite cache</p>
          </div>

          <div className="flex items-center justify-center text-slate-500">
            <ArrowRight className="w-5 h-5 hidden md:block" />
          </div>

          <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-2">
            <Server className="w-6 h-6 text-sky-400 mx-auto" />
            <h4 className="font-bold text-white">Central Django HQ</h4>
            <p className="text-[10px] text-slate-400 font-sans">MySQL database, engineer review & report hub</p>
          </div>
        </div>
      </div>

      {/* Explanatory Blueprint Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs text-slate-700">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          Resilience in Remote Track Corridors
        </h3>
        <p className="leading-relaxed">
          In railway corridors traversing mountain tunnels or remote wilderness with zero cellular coverage, the train-mounted edge device performs localized real-time inference at 60–120 frames per second. Any detected crack anomalies and vibration spikes are buffered in an encrypted on-train SQLite database.
        </p>
        <p className="leading-relaxed">
          Upon reaching cellular coverage or entering the maintenance depot Wi-Fi network, the device automatically triggers an idempotent REST batch synchronization with the central Django backend.
        </p>
      </div>
    </div>
  );
};
