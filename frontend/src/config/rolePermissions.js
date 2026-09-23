import {
  LayoutDashboard,
  Users,
  ClipboardList,
  UploadCloud,
  Camera,
  AlertTriangle,
  Map,
  History,
  Activity,
  Bot,
  Sparkles,
  ShieldAlert,
  FileCheck,
  MessageSquare,
  FileText,
  BarChart3,
  ScrollText,
  Settings,
  Cpu,
  Wrench
} from 'lucide-react';

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  ENGINEER: 'ENGINEER',
  INSPECTOR: 'INSPECTOR',
  MAINTENANCE: 'MAINTENANCE',
  VIEWER: 'VIEWER'
};

export const ROLE_DETAILS = {
  ADMIN: {
    title: "System Administrator",
    badgeLabel: "Platform Admin",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    headerGreeting: "System Administration & Platform Control",
    headerSubtext: "Platform user governance, AI agent diagnostics, operational cameras, and compliance audit logs.",
    dashboardPath: "/admin/dashboard",
    description: "Full platform management, AI model diagnostics, audit logs, and user access control."
  },
  ENGINEER: {
    title: "Railway Engineer",
    badgeLabel: "Railway Engineer",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    headerGreeting: "Good evening, Engineer",
    headerSubtext: "Here is the current condition of your assigned railway sections.",
    dashboardPath: "/engineer/dashboard",
    description: "AI findings verification, historical deterioration progression, and engineering sign-offs."
  },
  INSPECTOR: {
    title: "Field Inspector",
    badgeLabel: "Field Inspector",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    headerGreeting: "Today's Field Inspections",
    headerSubtext: "Capture optical evidence, ingest patrol scans, and monitor live trackside streams.",
    dashboardPath: "/inspector/dashboard",
    description: "Rapid data collection, mobile evidence upload, and trackside camera capture."
  },
  MAINTENANCE: {
    title: "Maintenance Team",
    badgeLabel: "Maintenance Crew",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    headerGreeting: "Maintenance Work Requiring Attention",
    headerSubtext: "Triage confirmed engineering work orders, track repairs, and verify geometry clearances.",
    dashboardPath: "/maintenance/dashboard",
    description: "Actionable work queue, component replacement tracking, and track condition monitoring."
  },
  VIEWER: {
    title: "Auditor / Viewer",
    badgeLabel: "Read-Only Observer",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    headerGreeting: "Railway Infrastructure Overview",
    headerSubtext: "Auditing, compliance monitoring, and high-level network health summaries.",
    dashboardPath: "/viewer/dashboard",
    description: "Read-only access to certified inspection dossiers and geospatial map."
  }
};

export const ROLE_NAVIGATION = {
  ADMIN: [
    {
      title: "Platform Overview",
      items: [
        { label: "Admin Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Users & Roles", path: "/users", icon: Users, badge: "RBAC" },
        { label: "Audit Logs", path: "/audit-logs", icon: ScrollText },
        { label: "System Settings", path: "/settings", icon: Settings },
      ]
    },
    {
      title: "Surveillance & Inspection",
      items: [
        { label: "Inspections", path: "/inspections", icon: ClipboardList },
        { label: "Track Sections", path: "/track-map", icon: Map },
        { label: "Camera Center", path: "/inspections/live-camera", icon: Camera, badge: "12 Live" },
      ]
    },
    {
      title: "AI & Model Operations",
      items: [
        { label: "AI Multi-Agents", path: "/agents", icon: Bot, badge: "7 Active" },
        { label: "Model Performance", path: "/model-performance", icon: BarChart3 },
        { label: "Certified Reports", path: "/reports", icon: FileText },
        { label: "Edge Architecture", path: "/edge-concept", icon: Cpu },
      ]
    }
  ],

  ENGINEER: [
    {
      title: "Engineering Workspace",
      items: [
        { label: "Engineer Dashboard", path: "/engineer/dashboard", icon: LayoutDashboard },
        { label: "My Sections", path: "/track-map", icon: Map, badge: "Assigned" },
        { label: "Inspections", path: "/inspections", icon: ClipboardList },
        { label: "AI Findings", path: "/anomalies", icon: AlertTriangle, badge: "AI" },
      ]
    },
    {
      title: "Analytics & Governance",
      items: [
        { label: "Historical Comparison", path: "/historical", icon: History },
        { label: "Track Health & Sensors", path: "/sensors", icon: Activity },
        { label: "Inspection Priority", path: "/maintenance-priority", icon: ShieldAlert },
        { label: "Engineer Reviews", path: "/reviews", icon: FileCheck, badge: "Action Req" },
      ]
    },
    {
      title: "Surveillance & Output",
      items: [
        { label: "Camera Center", path: "/inspections/live-camera", icon: Camera },
        { label: "Certified Reports", path: "/reports", icon: FileText },
        { label: "AI Multi-Agents", path: "/agents", icon: Bot },
        { label: "Model Feedback", path: "/feedback", icon: MessageSquare },
      ]
    }
  ],

  INSPECTOR: [
    {
      title: "Field Operations",
      items: [
        { label: "Field Dashboard", path: "/inspector/dashboard", icon: LayoutDashboard },
        { label: "Start Inspection", path: "/inspections/upload", icon: UploadCloud, badge: "+ New" },
        { label: "Live Camera Center", path: "/inspections/live-camera", icon: Camera, badge: "Optical" },
        { label: "My Inspections", path: "/inspections", icon: ClipboardList },
      ]
    },
    {
      title: "Data & Territory",
      items: [
        { label: "Assigned Track Sections", path: "/track-map", icon: Map },
        { label: "My Findings", path: "/anomalies", icon: AlertTriangle },
        { label: "Inspection History", path: "/historical", icon: History },
      ]
    }
  ],

  MAINTENANCE: [
    {
      title: "Maintenance Queue",
      items: [
        { label: "Maintenance Dashboard", path: "/maintenance/dashboard", icon: LayoutDashboard },
        { label: "Priority Work Orders", path: "/maintenance-priority", icon: Wrench, badge: "Dispatch" },
        { label: "Confirmed Findings", path: "/anomalies", icon: AlertTriangle },
      ]
    },
    {
      title: "Asset Condition",
      items: [
        { label: "Track Condition Map", path: "/track-map", icon: Map },
        { label: "Historical Progression", path: "/historical", icon: History },
        { label: "Camera Surveillance", path: "/inspections/live-camera", icon: Camera },
        { label: "Maintenance Reports", path: "/reports", icon: FileText },
      ]
    }
  ],

  VIEWER: [
    {
      title: "Auditor Console",
      items: [
        { label: "Network Overview", path: "/viewer/dashboard", icon: LayoutDashboard },
        { label: "Track Health Map", path: "/track-map", icon: Map },
        { label: "Inspection Overview", path: "/inspections", icon: ClipboardList },
        { label: "Certified Reports", path: "/reports", icon: FileText },
      ]
    }
  ]
};

export const ROLE_PERMISSIONS = {
  ADMIN: {
    canManageUsers: true,
    canManageSystem: true,
    canCreateInspection: true,
    canUploadEvidence: true,
    canReviewFindings: true,
    canUpdateMaintenance: true,
    canCaptureCameraFrames: true,
    canAnalyzeCameraFrames: true,
    canExportReports: true,
    canModifyModelConfig: true,
    isReadOnly: false,
    viewAllSections: true
  },
  ENGINEER: {
    canManageUsers: false,
    canManageSystem: false,
    canCreateInspection: true,
    canUploadEvidence: true,
    canReviewFindings: true,
    canUpdateMaintenance: true,
    canCaptureCameraFrames: true,
    canAnalyzeCameraFrames: true,
    canExportReports: true,
    canModifyModelConfig: false,
    isReadOnly: false,
    viewAllSections: false
  },
  INSPECTOR: {
    canManageUsers: false,
    canManageSystem: false,
    canCreateInspection: true,
    canUploadEvidence: true,
    canReviewFindings: false,
    canUpdateMaintenance: false,
    canCaptureCameraFrames: true,
    canAnalyzeCameraFrames: true,
    canExportReports: false,
    canModifyModelConfig: false,
    isReadOnly: false,
    viewAllSections: false
  },
  MAINTENANCE: {
    canManageUsers: false,
    canManageSystem: false,
    canCreateInspection: false,
    canUploadEvidence: false,
    canReviewFindings: false,
    canUpdateMaintenance: true,
    canCaptureCameraFrames: false,
    canAnalyzeCameraFrames: false,
    canExportReports: true,
    canModifyModelConfig: false,
    isReadOnly: false,
    viewAllSections: false
  },
  VIEWER: {
    canManageUsers: false,
    canManageSystem: false,
    canCreateInspection: false,
    canUploadEvidence: false,
    canReviewFindings: false,
    canUpdateMaintenance: false,
    canCaptureCameraFrames: false,
    canAnalyzeCameraFrames: false,
    canExportReports: true,
    canModifyModelConfig: false,
    isReadOnly: true,
    viewAllSections: true
  }
};
