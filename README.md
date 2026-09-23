# 🚆 RailGuard AI
### AI-Powered Railway Inspection & Predictive Maintenance Platform

> **Tagline:** *Inspect Smarter. Predict Earlier. Maintain Safer.*

---

## 📖 Overview

**RailGuard AI** is a professional, human-centered full-stack operations platform engineered to assist railway engineers in inspecting track infrastructure, detecting anomalies with computer vision, evaluating deterioration trajectories, simulating trackbed sensor telemetry, prioritizing maintenance workflows, and conducting auditable engineering reviews.

---

## 🎯 Problem Statement & Solution

* **The Challenge**: Traditional railway track inspection relies heavily on manual foot patrols, periodic track geometry cars, and disconnected sensor feeds. Safety-critical defects like rolling contact fatigue cracks, joint misalignments, and loose fasteners can progress rapidly between inspections.
* **Our Solution**: RailGuard AI fuses computer vision defect localization with multi-agent intelligence and IoT telemetry. Instead of opaque "black-box" predictions, RailGuard AI provides explainable, evidence-backed recommendations requiring licensed engineer confirmation before maintenance dispatch.

---

## 🌟 Key Features

1. **Explainable Computer Vision**: OpenCV-powered defect localization, contour extraction, bounding box overlays, and confidence metrics for cracks, corrosion, and fastener defects.
2. **Modular 8-Agent Multi-Agent Architecture**: Orchestrated perception and synthesis pipeline (Vision, Sensor, Historical, Deterioration, Risk, Priority, Report, and Orchestrator).
3. **Interactive Track Map**: Geospatial track corridor visualization with color-coded health indicators and detail drawers.
4. **Historical Comparison Slider**: Interactive side-by-side split visualizer comparing prior and current inspection states.
5. **Live Sensor Telemetry Simulator**: Real-time multi-metric streaming for vibration, temperature, dynamic stress, and acoustic levels with anomaly injection.
6. **Human-in-the-Loop Review Console**: Auditable review workflow where engineers confirm, reject, or request further inspection with mandatory comments.
7. **Compliance-Ready Report Generation**: Executive dossiers cleanly separating AI-generated insights from certified human findings.
8. **Role-Based Access Control (RBAC)**: Enforced across 5 roles (Admin, Railway Engineer, Inspector, Maintenance Team, Viewer).
9. **Immutable Audit Trails**: End-to-end logging of all system actions, reviews, logins, and predictions.
10. **Offline/Edge Concept Architecture**: Architecture blueprint and state visualizer for edge deployment on inspection trains.

---

## 🛠 Technology Stack

### Frontend
* **Framework**: React 18 with Vite
* **Routing**: React Router v6
* **Styling & Design System**: Tailwind CSS (Brand colors: `#16A34A`, `#14532D`, `#0F172A`, `#F0FDF4`, `#FACC15`)
* **Data Visualization**: Recharts & Leaflet / React-Leaflet
* **Icons & UI**: Lucide React, Framer Motion
* **API Client**: Axios with JWT/Session Auth interceptors

### Backend
* **Language & Framework**: Python 3.10+ / Django 4.2+ / Django REST Framework
* **Database**: MySQL (with automatic zero-config SQLite fallback for local developer setups)
* **Computer Vision & AI**: OpenCV, Pillow, NumPy, Pandas, scikit-learn
* **Authentication**: Django RBAC & Token Authentication
* **CORS**: django-cors-headers

---

## 📁 Project Structure

```
railguard-ai/
├── frontend/                     # React + Vite Single Page Application
│   ├── src/
│   │   ├── components/          # Reusable UI widgets (KpiCards, TrackMap, EvidenceViewer, etc.)
│   │   ├── context/             # AuthContext, NotificationContext
│   │   ├── layouts/             # DashboardLayout with persistent sidebar & topbar
│   │   ├── pages/               # 20+ feature pages (Dashboard, Upload, Review, etc.)
│   │   ├── services/            # Axios API client modules & mock fallbacks
│   │   ├── utils/               # Formatting, calculations & helpers
│   │   ├── App.jsx              # Application router & RBAC protection
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                      # Django REST Framework Backend
│   ├── config/                  # Django project settings, URLs, WSGI/ASGI
│   ├── accounts/                # User authentication & RBAC models/views
│   ├── core/                    # TrackSection, Camera models & demo seed script
│   ├── inspections/             # Inspection headers, media, anomalies & evidence
│   ├── sensors/                 # Sensor readings, baselines & live simulation
│   ├── history/                 # Historical inspection records & wear comparison
│   ├── ai_engine/               # Multi-agent orchestrator, OpenCV vision & deterioration scoring
│   ├── reviews/                 # Engineer reviews, comments & model feedback
│   ├── reports/                 # Audit-compliant executive report generator
│   ├── audit/                   # Immutable audit log models & middleware
│   ├── manage.py
│   └── requirements.txt
│
├── docs/                        # Complete Technical Documentation
│   ├── architecture.md          # Multi-agent & system architecture
│   ├── database.md              # Relational schema & ER specifications
│   ├── api.md                   # REST API documentation
│   ├── ai-agents.md             # Specification of all 8 AI agents
│   ├── deployment.md            # Setup, deployment & Docker guidelines
│   └── user-guide.md            # Operational workflow walkthrough
│
├── .env.example                 # Environment configuration template
├── .gitignore
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 👥 Demo User Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `Admin123!` |
| **Railway Engineer** | `engineer_sarah` | `Engineer123!` |
| **Inspector** | `inspector_john` | `Inspector123!` |
| **Maintenance** | `maintenance_dave` | `Maint123!` |
| **Viewer** | `viewer_alice` | `Viewer123!` |

---

## ⚠️ Disclaimer

> **IMPORTANT REGULATORY NOTICE**:
> RailGuard AI is a software prototype and decision-support simulation platform. AI-generated anomaly predictions, sensor anomalies, and deterioration indices must NOT be treated as certified railway safety decisions without physical on-track verification by a licensed railway infrastructure engineer in compliance with local railway safety regulations.
