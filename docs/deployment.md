# RailGuard AI — Deployment & Setup Guide

---

## 1. Prerequisites

* **Python**: 3.10+ installed
* **Node.js**: 18+ and `npm` installed
* **MySQL** (Recommended) or SQLite for zero-config testing
* **Git**

---

## 2. Quickstart (Development Mode)

### Step 1: Clone or Open Workspace
Ensure you are in the project root:
```bash
cd "d:\Download\Railway project"
```

### Step 2: Backend Setup
1. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```
2. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```
   *(By default, if MySQL is not detected or `USE_SQLITE=True`, the system automatically runs on zero-config SQLite).*

4. Run database migrations:
   ```bash
   cd backend
   python manage.py migrate
   ```

5. Seed demo data (Creates 20+ track sections, 10+ cameras, 100+ inspections, anomalies, sensor streams, and users):
   ```bash
   python manage.py seed_demo_data
   ```

6. Start the Django API server:
   ```bash
   python manage.py runserver 8000
   ```
   API runs at: `http://localhost:8000/api`

---

### Step 3: Frontend Setup
1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Frontend dashboard will be live at: `http://localhost:5173`

---

## 3. Pre-seeded Demo Credentials

| Role | Username | Password | Notes |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `Admin123!` | Full system control & user admin |
| **Railway Engineer** | `engineer_sarah` | `Engineer123!` | Review findings, inspect anomalies |
| **Inspector** | `inspector_john` | `Inspector123!` | Upload imagery & patrol records |
| **Maintenance** | `maintenance_dave` | `Maint123!` | View dispatched work orders |
| **Auditor / Viewer** | `viewer_alice` | `Viewer123!` | Compliance & audit log viewer |
