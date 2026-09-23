# RailGuard AI — REST API Reference Documentation

Base URL: `http://localhost:8000/api` (or configured `VITE_API_BASE_URL`)

---

## 1. Authentication & Users

### `POST /auth/login/`
Authenticates user and returns session/JWT credentials and role.
* **Request Body:**
```json
{
  "username": "engineer_sarah",
  "password": "Password123!"
}
```
* **Response (200 OK):**
```json
{
  "token": "e5c4a3f2...",
  "user": {
    "id": 2,
    "username": "engineer_sarah",
    "email": "sarah.chen@railguard.io",
    "role": "ENGINEER",
    "badge_id": "RE-8821",
    "department": "Permanent Way Infrastructure"
  }
}
```

### `GET /auth/me/`
Returns current authenticated user profile and permissions.

### `GET /auth/users/` (Admin only)
Lists all system users, roles, and activity status.

---

## 2. Dashboard Aggregations

### `GET /dashboard/overview/`
Returns real-time KPI metrics, active warnings, deteriorating sections, anomaly distributions, and agent statuses.
* **Response (200 OK):**
```json
{
  "kpis": {
    "critical_issues": 3,
    "high_priority_inspections": 7,
    "deteriorating_sections": 5,
    "healthy_sections": 18,
    "active_cameras": 12,
    "pending_reviews": 4,
    "pending_maintenance": 6,
    "model_health_pct": 98.4
  },
  "inspection_trends": [
    {"date": "2026-09-12", "inspections": 14, "anomalies": 3},
    {"date": "2026-09-18", "inspections": 22, "anomalies": 5}
  ],
  "anomaly_distribution": [
    {"category": "Surface Crack", "count": 28, "severity": "HIGH"},
    {"category": "Fastener Abnormality", "count": 14, "severity": "MEDIUM"}
  ],
  "agent_statuses": [
    {"name": "Vision Agent", "status": "Active", "last_run": "2 mins ago", "accuracy": "96.4%"},
    {"name": "Sensor Agent", "status": "Active", "last_run": "Just now", "accuracy": "94.8%"}
  ]
}
```

---

## 3. Inspections & Uploads

### `GET /inspections/`
List inspections with query parameters: `search`, `track_section`, `status`, `risk_level`, `ordering`, `page`.

### `POST /inspections/`
Create a new inspection header.

### `GET /inspections/{id}/`
Retrieve full inspection details including media, anomalies, predictions, sensor snapshots, historical comparison, and reviews.

### `POST /inspections/upload/`
Upload inspection image/video media.
* **Request:** Multipart Form-Data with `file`, `track_section_id`, `source`, `notes`.

### `POST /ai/analyze/`
Triggers the multi-agent AI computer vision analysis on uploaded media.
* **Request Body:**
```json
{
  "inspection_id": 14,
  "media_id": 38,
  "analysis_type": "FULL_MULTIMODAL"
}
```
* **Response (200 OK):**
```json
{
  "anomaly_type": "Surface Crack",
  "confidence": 0.947,
  "severity": "HIGH",
  "bounding_box": {"x": 140, "y": 210, "width": 180, "height": 95},
  "annotated_image_url": "/media/evidence/annotated_TRK014_crack.jpg",
  "explanation": "Crack-like transverse fissure detected along the gauge face with 94.7% confidence.",
  "sensor_context": {
    "vibration_deviation_pct": "+18.4%",
    "stress_level": "71 MPa"
  },
  "deterioration_score": 68,
  "priority": "HIGH",
  "recommended_action": "Schedule track ultrasonic test and visual manual inspection within 48 hours."
}
```

---

## 4. Track Sections & Cameras

### `GET /track-sections/`
Retrieves all track sections with geospatial coordinates, line types, health status, and deterioration indices.

### `GET /track-sections/{id}/`
Retrieves specific track corridor metadata, connected cameras, historical inspection timelines, and active defects.

### `GET /cameras/` & `GET /cameras/{id}/stream/`
List cameras and retrieve simulated or live feed frame data.

---

## 5. Sensors & Simulation

### `GET /sensors/readings/`
Query recent multi-metric time series telemetry for a track section.

### `POST /sensors/simulate/`
Controls synthetic telemetry stream generation (`action`: `START`, `STOP`, `RESET`, `INJECT_ANOMALY`).

---

## 6. Engineer Reviews & Feedback

### `POST /reviews/`
Submit an official human engineering evaluation.
* **Request Body:**
```json
{
  "inspection_id": 14,
  "decision": "CONFIRM",
  "engineering_comment": "Visual evidence appears consistent with rolling contact fatigue crack. Work order dispatched.",
  "work_order_required": true
}
```

### `POST /feedback/`
Submit model performance feedback for human-AI agreement evaluation.

---

## 7. Reports & Audit Logs

### `GET /reports/` & `POST /reports/generate/`
Generate comprehensive, auditable inspection reports in JSON / downloadable printable view.

### `GET /audit-logs/`
Query immutable system audit log entries.
