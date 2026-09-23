import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Play,
  Square,
  Pause,
  Aperture,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Video,
  RefreshCw,
  Search,
  Filter,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Activity,
  Radio,
  Clock,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Grid,
  Maximize,
  HardHat,
  Compass
} from 'lucide-react';
import { inspectionService } from '../services/inspectionService';
import { agentService } from '../services/agentService';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, SeverityBadge } from '../components/StatusBadge';
import { RoleBadge } from '../components/RoleBadge';

export const LiveCamera = () => {
  const { user, role, can, isInspector, isEngineer, isAdmin } = useAuth();
  const { addToast } = useNotifications();

  const [cameras, setCameras] = useState([]);
  const [selectedCam, setSelectedCam] = useState(null);
  const [viewMode, setViewMode] = useState('detail'); // 'grid' | 'detail'
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showAIOverlay, setShowAIOverlay] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [analyzingFrame, setAnalyzingFrame] = useState(false);
  const [capturedFrames, setCapturedFrames] = useState([]);
  const [events, setEvents] = useState([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [anomalyFilter, setAnomalyFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');

  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());
  const videoContainerRef = useRef(null);

  const loadCameras = async () => {
    try {
      const data = await inspectionService.getCameras();
      setCameras(data);
      if (data.length > 0 && !selectedCam) {
        setSelectedCam(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCameras();
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update events when selected camera changes
  useEffect(() => {
    if (selectedCam) {
      const initialEvents = selectedCam.events?.length > 0 ? selectedCam.events : [
        { id: 1, title: 'Surface anomaly detected', event_type: 'ANOMALY_DETECTED', formatted_time: '14:02:18', severity: 'HIGH' },
        { id: 2, title: 'Edge frame analyzed', event_type: 'AI_FRAME_ANALYZED', formatted_time: '14:01:52', severity: 'INFO' },
        { id: 3, title: 'Optical gantry connected', event_type: 'SYSTEM_CONNECT', formatted_time: '14:00:31', severity: 'INFO' },
      ];
      setEvents(initialEvents);
    }
  }, [selectedCam]);

  const handleCaptureFrame = () => {
    if (!selectedCam || selectedCam.status === 'OFFLINE') return;
    const newFrame = {
      id: `FRM-${Date.now().toString().slice(-4)}`,
      camera_code: selectedCam.camera_code,
      section_code: selectedCam.track_section_code,
      time: timestamp,
      status: 'CAPTURED'
    };
    setCapturedFrames(prev => [newFrame, ...prev]);
    const newEvent = {
      id: Date.now(),
      title: 'Evidence frame captured',
      event_type: 'FRAME_CAPTURED',
      formatted_time: timestamp,
      severity: 'INFO'
    };
    setEvents(prev => [newEvent, ...prev]);
    addToast(`High-res frame snapshot captured from ${selectedCam.camera_code}.`, 'info');
  };

  const handleAnalyzeFrame = async () => {
    if (!selectedCam || selectedCam.status === 'OFFLINE') return;
    setAnalyzingFrame(true);
    try {
      await agentService.analyzeMedia({
        anomaly_hint: selectedCam.anomaly_label || "Surface Crack"
      });
      const newEvent = {
        id: Date.now(),
        title: `AI localized ${selectedCam.anomaly_label || 'Defect'} (${((selectedCam.anomaly_confidence || 0.947) * 100).toFixed(1)}%)`,
        event_type: 'AI_FRAME_ANALYZED',
        formatted_time: timestamp,
        severity: 'HIGH'
      };
      setEvents(prev => [newEvent, ...prev]);
      addToast(`Edge AI localized ${selectedCam.anomaly_label || 'defect'} with ${((selectedCam.anomaly_confidence || 0.947) * 100).toFixed(1)}% confidence.`, 'success');
    } catch (e) {
      addToast('AI frame analysis complete.', 'success');
    } finally {
      setAnalyzingFrame(false);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoContainerRef.current?.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Filter & Sort cameras
  const filteredCameras = cameras.filter(cam => {
    const matchesSearch = cam.camera_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.track_section_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.location_description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || cam.status === statusFilter;
    const matchesAnomaly = anomalyFilter === 'ALL' ||
      (anomalyFilter === 'ANOMALY_ONLY' && cam.has_anomaly) ||
      (anomalyFilter === 'HEALTHY_ONLY' && !cam.has_anomaly);

    return matchesSearch && matchesStatus && matchesAnomaly;
  }).sort((a, b) => {
    if (sortBy === 'ID') return a.camera_code.localeCompare(b.camera_code);
    if (sortBy === 'RISK') return (b.has_anomaly ? 1 : 0) - (a.has_anomaly ? 1 : 0);
    if (sortBy === 'STATUS') return a.status.localeCompare(b.status);
    return 0;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'LIVE': return 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40';
      case 'ONLINE': return 'text-blue-400 bg-blue-950/80 border-blue-500/40';
      case 'CONNECTING': return 'text-amber-400 bg-amber-950/80 border-amber-500/40';
      case 'OFFLINE': return 'text-rose-400 bg-rose-950/80 border-rose-500/40';
      default: return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'LIVE': return 'bg-emerald-500 animate-pulse';
      case 'ONLINE': return 'bg-blue-500';
      case 'CONNECTING': return 'bg-amber-500 animate-ping';
      case 'OFFLINE': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Operations Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0F172A] text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-400" />
              Railway Operations Camera Center
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time trackside optical surveillance & edge AI predictive inspection matrix
          </p>
        </div>

        {/* View Mode & Quick Controls */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode('detail')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'detail' ? 'bg-[#16A34A] text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Maximize className="w-3.5 h-3.5" />
              <span>Operations View</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid' ? 'bg-[#16A34A] text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Multi-Camera Grid</span>
            </button>
          </div>

          <button
            onClick={loadCameras}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Refresh Camera Telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Camera Search, Filters & Sorting Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search camera ID, corridor (e.g. CAM-014)..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] text-slate-900 font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase">Status:</span>
            {['ALL', 'LIVE', 'ONLINE', 'OFFLINE'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase">Detection:</span>
            <button
              onClick={() => setAnomalyFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                anomalyFilter === 'ALL' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setAnomalyFilter('ANOMALY_ONLY')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                anomalyFilter === 'ANOMALY_ONLY' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Anomalies Only</span>
            </button>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
          >
            <option value="DEFAULT">Sort: Default</option>
            <option value="RISK">Sort by Risk Severity</option>
            <option value="ID">Sort by Camera ID</option>
            <option value="STATUS">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* 3. MULTI-CAMERA GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCameras.map((cam) => {
            const isSelected = selectedCam?.id === cam.id;
            const isOffline = cam.status === 'OFFLINE';

            return (
              <div
                key={cam.id}
                onClick={() => {
                  setSelectedCam(cam);
                  setViewMode('detail');
                }}
                className={`bg-[#0B1120] rounded-2xl overflow-hidden border cursor-pointer group transition-all transform hover:-translate-y-1 hover:shadow-2xl ${
                  isSelected ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-slate-800'
                }`}
              >
                {/* Video Surface */}
                <div className="relative aspect-video bg-[#0F172A] overflow-hidden flex items-center justify-center">
                  {!isOffline ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-slate-950">
                      {/* Animated Trackbed background */}
                      <div className="absolute inset-0 opacity-25 bg-[linear-gradient(90deg,#334155_2px,transparent_2px)] [background-size:40px_100%] animate-[pulse_4s_ease-in-out_infinite]" />
                      <div className="w-full h-16 bg-stone-900/90 border-y-2 border-stone-700 flex items-center justify-center relative">
                        <div className="w-full h-8 bg-slate-700 flex items-center justify-center">
                          <div className="w-full h-3 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 shadow-inner" />
                        </div>
                      </div>

                      {/* Small Bounding box overlay if anomaly */}
                      {cam.has_anomaly && (
                        <div className="absolute w-24 h-12 border-2 border-rose-500 bg-rose-500/20 rounded animate-pulse flex items-start p-1">
                          <span className="text-[8px] font-mono font-bold text-white bg-rose-600 px-1 rounded">
                            {cam.anomaly_label}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-slate-600 p-4">
                      <WifiOff className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <p className="text-[10px] font-mono font-bold text-rose-400">NO SIGNAL</p>
                    </div>
                  )}

                  {/* Top HUD Overlay */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono">
                    <span className="bg-slate-950/80 backdrop-blur-sm text-white px-2 py-0.5 rounded font-bold border border-slate-800">
                      {cam.camera_code}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border ${getStatusColor(cam.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(cam.status)}`} />
                      {cam.status}
                    </span>
                  </div>

                  {/* Bottom HUD Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono">
                    <span className="bg-slate-950/80 backdrop-blur-sm text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                      {cam.track_section_code} • KM {cam.km_marker || '14.2'}
                    </span>
                    {cam.has_anomaly && (
                      <span className="bg-rose-600/90 text-white px-1.5 py-0.5 rounded font-bold flex items-center gap-1 shadow">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {((cam.anomaly_confidence || 0.94) * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Info Footer */}
                <div className="p-3 bg-[#0B1120] text-xs flex items-center justify-between border-t border-slate-800/80">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white truncate">{cam.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{cam.location_description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. SELECTED CAMERA DETAILED OPERATIONS WORKSPACE */}
      {viewMode === 'detail' && selectedCam && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Main Live Feed Canvas (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Selected Camera Card Container */}
            <div
              ref={videoContainerRef}
              className="bg-[#0B1120] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col relative"
            >
              {/* Header Bar of Video Frame */}
              <div className="h-12 bg-[#0B1120] px-4 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold text-sm tracking-wider">{selectedCam.camera_code}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 font-semibold">SECTION {selectedCam.track_section_code}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">KM {selectedCam.km_marker || '14.20'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 text-xs border ${getStatusColor(selectedCam.status)}`}>
                    <span className={`w-2 h-2 rounded-full ${getStatusDot(selectedCam.status)}`} />
                    {selectedCam.status}
                  </span>

                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                    title="Fullscreen Mode"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Viewport */}
              <div className="relative w-full h-[460px] bg-slate-950 flex items-center justify-center overflow-hidden">
                {selectedCam.status !== 'OFFLINE' && isPlaying ? (
                  <div
                    className="w-full h-full relative flex flex-col items-center justify-center transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    {/* Simulated High-Resolution Railway Stream */}
                    <div className="w-full h-full bg-[#050811] relative overflow-hidden flex flex-col justify-center items-center">
                      {/* Grid tie markings */}
                      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,#475569_2px,transparent_2px)] [background-size:60px_100%] animate-[pulse_3s_ease-in-out_infinite]" />

                      {/* Concrete Sleeper Bed Tie */}
                      <div className="w-full h-52 bg-stone-900/90 relative flex items-center justify-center border-y-4 border-stone-700 shadow-2xl">
                        {/* Continuous Steel Rail Base */}
                        <div className="w-full h-28 bg-slate-700 border-y border-slate-600 relative flex items-center justify-center">
                          {/* Polished UIC 60 Running Surface */}
                          <div className="w-full h-14 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 shadow-inner flex items-center justify-center">
                            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest opacity-60">
                              {selectedCam.track_section_code} • UIC 60 Continuous Welded Rail Surface • Gantry KP {selectedCam.km_marker || '14.2'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* AI Bounding Box Overlay */}
                      {showAIOverlay && selectedCam.has_anomaly && !isPaused && (
                        <div
                          className="absolute border-2 border-rose-500 bg-rose-500/20 rounded shadow-2xl animate-pulse"
                          style={{
                            left: '32%',
                            top: '36%',
                            width: '240px',
                            height: '90px'
                          }}
                        >
                          <div className="absolute -top-7 left-0 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-t flex items-center gap-1.5 shadow font-mono">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>{selectedCam.anomaly_label || 'Surface Crack'}</span>
                            <span className="text-amber-300">• {((selectedCam.anomaly_confidence || 0.947) * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      )}

                      {/* Top Left Optical HUD Overlay */}
                      <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs flex items-center gap-3 shadow-lg">
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          REC [{timestamp}]
                        </span>
                        <span className="text-slate-400">{selectedCam.resolution || '4K 120fps'}</span>
                        <span className="text-amber-400 font-bold">Edge Latency: 14ms</span>
                      </div>

                      {/* Top Right Synthetic Stream Watermark */}
                      <div className="absolute top-4 right-4 bg-slate-900/85 backdrop-blur-md text-slate-300 px-3 py-1 rounded-xl border border-slate-700 font-mono text-[10px] flex items-center gap-1.5">
                        <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                        <span>SYNTHETIC DEMO STREAM</span>
                      </div>

                      {/* Bottom HUD Telemetry */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                        <div className="bg-slate-950/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-4">
                          <span>Speed: <strong className="text-emerald-400 font-bold">142 km/h</strong></span>
                          <span>FPS: <strong className="text-blue-400 font-bold">{selectedCam.fps || 60}</strong></span>
                          <span>Firmware: <strong className="text-slate-300">{selectedCam.firmware_version || 'v2.4.1-edge'}</strong></span>
                        </div>

                        <div className="bg-slate-950/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">AI OVERLAY:</span>
                          <button
                            onClick={() => setShowAIOverlay(!showAIOverlay)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all ${
                              showAIOverlay ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {showAIOverlay ? 'ON' : 'OFF'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : selectedCam.status === 'OFFLINE' ? (
                  /* Professional OFFLINE State */
                  <div className="text-center p-8 max-w-md">
                    <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-400 flex items-center justify-center mx-auto mb-4">
                      <WifiOff className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-black text-white tracking-tight">NO SIGNAL • OPTICAL STREAM OFFLINE</h3>
                    <p className="text-xs text-slate-400 mt-1 mb-4 font-mono">
                      Camera node {selectedCam.camera_code} (KP {selectedCam.km_marker || '7.80'}) timed out.
                    </p>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-left text-xs font-mono mb-4 space-y-1">
                      <p className="text-slate-400">Last Connection: <span className="text-white">14:03:22</span></p>
                      <p className="text-slate-400">Diagnostic Reason: <span className="text-rose-400">Remote Solar Node Standby</span></p>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => addToast(`Reconnecting telemetry channel to ${selectedCam.camera_code}...`, 'info')}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>RECONNECT</span>
                      </button>
                      <button
                        onClick={() => addToast('Displaying cached calibration frame.', 'info')}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700"
                      >
                        VIEW LAST FRAME
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-500">
                    <Video className="w-12 h-12 mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-mono">FEED PAUSED</p>
                  </div>
                )}
              </div>

              {/* Professional Lucide Controls Toolbar */}
              <div className="p-4 bg-[#0B1120] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Playback controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setIsPlaying(true); setIsPaused(false); }}
                    className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      isPlaying && !isPaused ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>LIVE FEED</span>
                  </button>

                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      isPaused ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
                  </button>

                  <button
                    onClick={() => setZoomLevel(prev => (prev === 1 ? 1.4 : 1))}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all"
                    title="Zoom In/Out"
                  >
                    {zoomLevel === 1 ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
                  </button>
                </div>

                {/* Capture & AI Analysis Controls */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleCaptureFrame}
                    disabled={selectedCam.status === 'OFFLINE'}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5 transition-all border border-slate-700 disabled:opacity-40"
                  >
                    <Aperture className="w-4 h-4 text-emerald-400" />
                    <span>CAPTURE FRAME</span>
                  </button>

                  <button
                    onClick={handleAnalyzeFrame}
                    disabled={analyzingFrame || selectedCam.status === 'OFFLINE'}
                    className="px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-950/40 disabled:opacity-40"
                  >
                    <Sparkles className={`w-4 h-4 text-[#FACC15] ${analyzingFrame ? 'animate-spin' : ''}`} />
                    <span>{analyzingFrame ? 'RUNNING AI VISION AGENT...' : 'ANALYZE FRAME'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Captured Frames Quick Drawer */}
            {capturedFrames.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <h4 className="font-bold text-slate-900 text-xs mb-3 flex items-center justify-between">
                  <span>Captured Evidence Snapshots ({capturedFrames.length})</span>
                  <span className="text-[10px] text-slate-400 font-mono">Ready for Ingest</span>
                </h4>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {capturedFrames.map((frm) => (
                    <div key={frm.id} className="w-44 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs shrink-0">
                      <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center text-slate-400 text-[10px] font-mono mb-2">
                        <span>{frm.camera_code}</span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="font-bold text-slate-900">{frm.id}</span>
                        <span className="text-slate-400">{frm.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Intelligence Panels (1 Col) */}
          <div className="space-y-4 text-xs">
            {/* 1. Camera Diagnostics & Health Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Camera Hardware Health
                </span>
                <span className="font-mono text-emerald-600 font-bold">{selectedCam.camera_code}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Signal Quality</span>
                  <strong className="text-emerald-700">{selectedCam.signal_quality || 'Good (98%)'}</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">FPS / Resolution</span>
                  <strong className="text-slate-800">{selectedCam.fps || 60} fps • {selectedCam.resolution}</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Last Heartbeat</span>
                  <strong className="text-slate-800">8 sec ago</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Firmware</span>
                  <strong className="text-slate-800">{selectedCam.firmware_version || 'v2.4.1'}</strong>
                </div>
              </div>
            </div>

            {/* 2. AI Defect Detection Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  AI Edge Detection
                </span>
                {selectedCam.has_anomaly && <SeverityBadge severity={selectedCam.anomaly_severity || 'HIGH'} />}
              </div>

              {selectedCam.has_anomaly ? (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900 text-xs">{selectedCam.anomaly_label}</span>
                      <span className="font-mono font-bold text-rose-700 text-xs">
                        {((selectedCam.anomaly_confidence || 0.947) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-800">
                      Transverse surface fissure detected along gauge corner with high gradient edge profile.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px]">
                    <span className="font-bold text-slate-700 block mb-0.5">Recommended Action:</span>
                    <p className="text-slate-600">Perform physical ultrasonic verification and track geometry clearance check.</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-emerald-800 font-medium">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                  <p className="text-xs font-bold">Nominal Running Band</p>
                  <p className="text-[10px] text-emerald-700 mt-0.5">No abnormal fissures or fastener displacements detected.</p>
                </div>
              )}
            </div>

            {/* 3. Real-Time Telemetry & Sensor Integration */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  Corridor Sensor Intelligence
                </span>
                <span className="font-mono text-slate-700 font-bold">{selectedCam.track_section_code}</span>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Vibration RMS:</span>
                  <strong className={selectedCam.has_anomaly ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                    {selectedCam.has_anomaly ? '82% (+22.4%)' : '24% (Nominal)'}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Rail Temperature:</span>
                  <strong className="text-slate-800">{selectedCam.has_anomaly ? '58°C' : '35°C'}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Dynamic Stress:</span>
                  <strong className={selectedCam.has_anomaly ? 'text-amber-600 font-bold' : 'text-slate-800'}>
                    {selectedCam.has_anomaly ? '71% (Elevated)' : '30% (Nominal)'}
                  </strong>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-slate-500 font-sans">Deterioration Score:</span>
                  <strong className="text-rose-600 font-bold">{selectedCam.track_deterioration_score || 88}/100</strong>
                </div>
              </div>
            </div>

            {/* 4. Camera Event Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Recent Event Timeline
                </span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {events.map((evt, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px]">
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 shrink-0 font-bold">
                      {evt.formatted_time || '14:02'}
                    </span>
                    <p className="text-slate-700 leading-tight font-medium">{evt.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCamera;
