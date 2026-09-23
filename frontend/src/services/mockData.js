// Rich realistic fallback demo dataset for RailGuard AI
export const mockDashboardData = {
  kpis: {
    critical_issues: 3,
    high_priority_inspections: 7,
    deteriorating_sections: 8,
    healthy_sections: 16,
    active_cameras: 12,
    pending_reviews: 4,
    pending_maintenance: 5,
    model_health_pct: 97.6,
    total_inspections_count: 128
  },
  inspection_trends: [
    { date: "Sep 12", inspections: 14, anomalies: 2, healthy_scans: 12 },
    { date: "Sep 13", inspections: 18, anomalies: 3, healthy_scans: 15 },
    { date: "Sep 14", inspections: 22, anomalies: 4, healthy_scans: 18 },
    { date: "Sep 15", inspections: 19, anomalies: 2, healthy_scans: 17 },
    { date: "Sep 16", inspections: 25, anomalies: 5, healthy_scans: 20 },
    { date: "Sep 17", inspections: 21, anomalies: 3, healthy_scans: 18 },
    { date: "Sep 18", inspections: 28, anomalies: 6, healthy_scans: 22 },
  ],
  anomaly_distribution: [
    { category: "Surface Crack", count: 34, severity: "HIGH", color: "#EF4444" },
    { category: "Rail Corrosion", count: 22, severity: "MEDIUM", color: "#F59E0B" },
    { category: "Fastener Abnormality", count: 18, severity: "MEDIUM", color: "#FACC15" },
    { category: "Joint Abnormality", count: 12, severity: "HIGH", color: "#EA580C" },
    { category: "Surface Wear & Spalling", count: 15, severity: "LOW", color: "#3B82F6" },
    { category: "Track-bed Scouring", count: 8, severity: "HIGH", color: "#DC2626" },
    { category: "Foreign Object", count: 4, severity: "CRITICAL", color: "#991B1B" },
  ],
  deteriorating_sections: [
    { section_code: "TRK-014", name: "Northern Valley Mainline KP 14.2", score: 88, status: "CRITICAL", trend: "+12%" },
    { section_code: "TRK-007", name: "Coastal Freight Curve KP 7.8", score: 79, status: "HIGH", trend: "+8%" },
    { section_code: "TRK-021", name: "East Switch Crossover 21", score: 76, status: "HIGH", trend: "+14%" },
    { section_code: "TRK-003", name: "Central Express Tunnel Approach", score: 68, status: "WATCH", trend: "+4%" },
    { section_code: "TRK-018", name: "Highland Viaduct Deck Segment", score: 62, status: "WATCH", trend: "+6%" },
    { section_code: "TRK-009", name: "Suburban Junction KP 9.1", score: 54, status: "WATCH", trend: "+2%" },
  ],
  agent_statuses: [
    {
      id: "agent-vision",
      name: "Vision Agent",
      role: "Computer Vision Defect Extraction",
      status: "Active",
      last_run: "24s ago",
      latency_ms: 142,
      confidence_avg: 94.8,
      tasks_completed: 1284,
      description: "Analyzes optical feeds for crack, fastener, and surface abnormalities."
    },
    {
      id: "agent-sensor",
      name: "Sensor Agent",
      role: "IoT Telemetry Analysis",
      status: "Active",
      last_run: "3s ago",
      latency_ms: 18,
      confidence_avg: 96.2,
      tasks_completed: 8540,
      description: "Evaluates vibration RMS, dynamic stress, and thermal expansion baselines."
    },
    {
      id: "agent-historical",
      name: "Historical Agent",
      role: "Deterioration Trend Tracker",
      status: "Active",
      last_run: "1m ago",
      latency_ms: 35,
      confidence_avg: 91.5,
      tasks_completed: 942,
      description: "Compares prior inspection records to compute defect growth rates."
    },
    {
      id: "agent-deterioration",
      name: "Deterioration Agent",
      role: "Composite Health Scoring (0-100)",
      status: "Active",
      last_run: "1m ago",
      latency_ms: 22,
      confidence_avg: 93.0,
      tasks_completed: 942,
      description: "Weights visual, sensor, and historical parameters into Deterioration Index."
    },
    {
      id: "agent-risk",
      name: "Risk Agent",
      role: "Multi-Evidence Risk Synthesis",
      status: "Active",
      last_run: "1m ago",
      latency_ms: 45,
      confidence_avg: 92.4,
      tasks_completed: 942,
      description: "Synthesizes multi-agent signals into explainable risk classification."
    },
    {
      id: "agent-priority",
      name: "Priority Agent",
      role: "Maintenance Triage Engine",
      status: "Active",
      last_run: "1m ago",
      latency_ms: 15,
      confidence_avg: 95.7,
      tasks_completed: 942,
      description: "Assigns actionable inspection triage priority (CRITICAL/HIGH/MED/LOW)."
    },
    {
      id: "agent-report",
      name: "Report Agent",
      role: "Executive Dossier Synthesis",
      status: "Active",
      last_run: "5m ago",
      latency_ms: 210,
      confidence_avg: 98.1,
      tasks_completed: 312,
      description: "Generates audit-ready compliance dossiers clearly separating AI vs Engineer findings."
    }
  ]
};

export const mockTrackSections = [
  { id: 1, section_code: "TRK-001", name: "Northern Valley Mainline - Segment 01", line_type: "MAIN_LINE", start_km: 0.0, end_km: 5.0, latitude: 37.7749, longitude: -122.4194, health_status: "HEALTHY", deterioration_score: 12, max_speed_kmh: 160 },
  { id: 2, section_code: "TRK-002", name: "Northern Valley Mainline - Segment 02", line_type: "MAIN_LINE", start_km: 5.0, end_km: 10.0, latitude: 37.7850, longitude: -122.4100, health_status: "HEALTHY", deterioration_score: 18, max_speed_kmh: 160 },
  { id: 3, section_code: "TRK-003", name: "Central Express Tunnel Approach", line_type: "HIGH_SPEED", start_km: 10.0, end_km: 15.2, latitude: 37.7950, longitude: -122.4000, health_status: "WATCH", deterioration_score: 68, max_speed_kmh: 200 },
  { id: 7, section_code: "TRK-007", name: "Coastal Freight Curve KP 7.8", line_type: "FREIGHT_CORRIDOR", start_km: 35.0, end_km: 42.0, latitude: 37.8350, longitude: -122.3600, health_status: "HIGH", deterioration_score: 79, max_speed_kmh: 80 },
  { id: 9, section_code: "TRK-009", name: "Suburban Junction KP 9.1", line_type: "SUBURBAN", start_km: 0.0, end_km: 4.2, latitude: 37.7650, longitude: -122.4250, health_status: "WATCH", deterioration_score: 54, max_speed_kmh: 110 },
  { id: 14, section_code: "TRK-014", name: "Northern Valley Mainline KP 14.2", line_type: "MAIN_LINE", start_km: 23.0, end_km: 28.0, latitude: 37.7150, longitude: -122.4750, health_status: "CRITICAL", deterioration_score: 88, max_speed_kmh: 140 },
  { id: 18, section_code: "TRK-018", name: "Highland Viaduct Deck Segment", line_type: "HIGH_SPEED", start_km: 23.0, end_km: 27.5, latitude: 37.6750, longitude: -122.5150, health_status: "WATCH", deterioration_score: 62, max_speed_kmh: 190 },
  { id: 21, section_code: "TRK-021", name: "East Switch Crossover 21", line_type: "SWITCH_YARD", start_km: 0.0, end_km: 1.8, latitude: 37.6450, longitude: -122.5450, health_status: "HIGH", deterioration_score: 76, max_speed_kmh: 45 },
];

export const mockInspections = [
  {
    id: 104,
    inspection_code: "INS-2026-0104",
    track_section: 14,
    track_section_code: "TRK-014",
    track_section_name: "Northern Valley Mainline KP 14.2",
    inspector_name: "John Martinez",
    inspection_date: "2026-09-18T08:30:00Z",
    source: "PATROL_TRAIN",
    status: "AWAITING_REVIEW",
    risk_level: "HIGH",
    ai_confidence: 0.9470,
    anomalies_count: 2,
    created_at: "2026-09-18T08:32:00Z"
  },
  {
    id: 103,
    inspection_code: "INS-2026-0103",
    track_section: 7,
    track_section_code: "TRK-007",
    track_section_name: "Coastal Freight Curve KP 7.8",
    inspector_name: "John Martinez",
    inspection_date: "2026-09-17T14:15:00Z",
    source: "DRONE",
    status: "REVIEWED",
    risk_level: "HIGH",
    ai_confidence: 0.9320,
    anomalies_count: 1,
    created_at: "2026-09-17T14:18:00Z"
  },
  {
    id: 102,
    inspection_code: "INS-2026-0102",
    track_section: 21,
    track_section_code: "TRK-021",
    track_section_name: "East Switch Crossover 21",
    inspector_name: "John Martinez",
    inspection_date: "2026-09-17T09:40:00Z",
    source: "FIXED_CAM",
    status: "REVIEWED",
    risk_level: "HIGH",
    ai_confidence: 0.9150,
    anomalies_count: 1,
    created_at: "2026-09-17T09:45:00Z"
  },
  {
    id: 101,
    inspection_code: "INS-2026-0101",
    track_section: 3,
    track_section_code: "TRK-003",
    track_section_name: "Central Express Tunnel Approach",
    inspector_name: "Sarah Chen, P.E.",
    inspection_date: "2026-09-16T16:20:00Z",
    source: "MANUAL",
    status: "REVIEWED",
    risk_level: "MEDIUM",
    ai_confidence: 0.9580,
    anomalies_count: 1,
    created_at: "2026-09-16T16:25:00Z"
  },
  {
    id: 100,
    inspection_code: "INS-2026-0100",
    track_section: 1,
    track_section_code: "TRK-001",
    track_section_name: "Northern Valley Mainline - Segment 01",
    inspector_name: "John Martinez",
    inspection_date: "2026-09-16T11:10:00Z",
    source: "PATROL_TRAIN",
    status: "CLOSED",
    risk_level: "LOW",
    ai_confidence: 0.9750,
    anomalies_count: 0,
    created_at: "2026-09-16T11:12:00Z"
  }
];

export const mockAnomalies = [
  {
    id: 1,
    inspection: 104,
    inspection_code: "INS-2026-0104",
    track_section_code: "TRK-014",
    anomaly_type: "Surface Crack",
    severity: "HIGH",
    confidence: 0.9470,
    bounding_box: { x: 220, y: 240, width: 260, height: 140 },
    explanation: "Transverse fissure detected along the rail gauge corner with pronounced edge gradient.",
    recommended_action: "Perform physical ultrasonic verification and track geometry check.",
    confirmed_by_engineer: false,
    created_at: "2026-09-18T08:32:00Z"
  },
  {
    id: 2,
    inspection: 103,
    inspection_code: "INS-2026-0103",
    track_section_code: "TRK-007",
    anomaly_type: "Rail Corrosion",
    severity: "MEDIUM",
    confidence: 0.8920,
    bounding_box: { x: 180, y: 310, width: 320, height: 110 },
    explanation: "Oxidation and pitting corrosion detected on the rail web and base flange.",
    recommended_action: "Schedule sandblasting and protective anti-corrosion coating.",
    confirmed_by_engineer: true,
    created_at: "2026-09-17T14:18:00Z"
  },
  {
    id: 3,
    inspection: 102,
    inspection_code: "INS-2026-0102",
    track_section_code: "TRK-021",
    anomaly_type: "Fastener Abnormality",
    severity: "MEDIUM",
    confidence: 0.9150,
    bounding_box: { x: 300, y: 190, width: 150, height: 130 },
    explanation: "Pandrol clip displaced from sleeper fixture shoulder point.",
    recommended_action: "Dispatch trackman for immediate fastener re-torquing.",
    confirmed_by_engineer: true,
    created_at: "2026-09-17T09:45:00Z"
  }
];

export const mockCameras = [
  { id: 1, camera_code: "CAM-014", track_section_code: "TRK-014", name: "Overhead Optical Array CAM-014", location_description: "Overhead Gantry KP 14.2", resolution: "4K 120fps High-Speed", is_active: true, stream_url: "simulated://feed/cam-014" },
  { id: 2, camera_code: "CAM-007", track_section_code: "TRK-007", name: "Curve Continuous Gauge CAM-007", location_description: "Curve KP 7.8 Gantry", resolution: "4K High-Speed Optical", is_active: true, stream_url: "simulated://feed/cam-007" },
  { id: 3, camera_code: "CAM-021", track_section_code: "TRK-021", name: "Switch Position Optical CAM-021", location_description: "Crossover 21 Throat", resolution: "1080p 60fps Optical", is_active: true, stream_url: "simulated://feed/cam-021" },
  { id: 4, camera_code: "CAM-003", track_section_code: "TRK-003", name: "Tunnel Portal High-Res CAM-003", location_description: "Tunnel Entrance Portal", resolution: "1080p 60fps Night-Vision", is_active: true, stream_url: "simulated://feed/cam-003" },
];

export const mockHistoricalComparisons = [
  {
    id: 1,
    track_section_code: "TRK-014",
    previous_value_mm: 4.2,
    current_value_mm: 7.8,
    delta_percentage: 85.71,
    time_elapsed_days: 180,
    wear_rate_mm_per_month: 0.60,
    ai_risk_assessment: "Accelerated growth trajectory observed. Surface fissure widening exceeds standard 0.2mm/month nominal threshold."
  }
];

export const mockAuditLogs = [
  { id: 1, username: "engineer_sarah", user_role: "ENGINEER", action: "ENGINEER_REVIEW_CONFIRM", target_model: "EngineerReview", ip_address: "127.0.0.1", timestamp: "2026-09-18T10:14:22Z", details: { inspection: "INS-2026-0104", decision: "CONFIRM", work_order: true } },
  { id: 2, username: "inspector_john", user_role: "INSPECTOR", action: "MEDIA_UPLOAD", target_model: "InspectionMedia", ip_address: "127.0.0.1", timestamp: "2026-09-18T08:30:15Z", details: { file: "patrol_scan_trk014.jpg", size: "4.2MB" } },
  { id: 3, username: "engineer_sarah", user_role: "ENGINEER", action: "AI_INFERENCE_EXECUTED", target_model: "AIPrediction", ip_address: "127.0.0.1", timestamp: "2026-09-18T08:32:05Z", details: { model: "RailGuard-Vision-v3.2", confidence: "94.7%" } },
  { id: 4, username: "admin", user_role: "ADMIN", action: "USER_LOGIN", target_model: "User", ip_address: "127.0.0.1", timestamp: "2026-09-18T07:45:00Z", details: { auth: "TokenAuth" } },
];
