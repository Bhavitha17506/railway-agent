import os
import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.conf import settings

from accounts.models import UserRole
from core.models import TrackSection, Camera, TrackHealthStatus, LineType
from inspections.models import Inspection, InspectionMedia, Anomaly, Evidence, InspectionSource, InspectionStatus, RiskLevel, AnomalySeverity
from sensors.models import SensorReading, SensorBaseline
from history.models import HistoricalRecord, HistoricalComparison
from ai_engine.models import AIPrediction, AgentExecution, DeteriorationScore, InspectionPriority, ModelMetric
from reviews.models import EngineerReview, Feedback, ReviewDecision
from reports.models import Report
from audit.models import AuditLog
from ai_engine.vision import analyze_inspection_image
from reports.generator import generate_inspection_report

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds realistic synthetic railway inspection data for RailGuard AI'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE("Initializing RailGuard AI Demo Dataset Seeding..."))

        # 1. Create Users
        users = [
            ("admin", "Admin123!", UserRole.ADMIN, "AD-0001", "Systems & AI Administration", "Alex Vance"),
            ("engineer_sarah", "Engineer123!", UserRole.ENGINEER, "RE-8821", "Permanent Way Infrastructure", "Sarah Chen, P.E."),
            ("inspector_john", "Inspector123!", UserRole.INSPECTOR, "IN-4209", "Field Patrol & Drone Operations", "John Martinez"),
            ("maintenance_dave", "Maint123!", UserRole.MAINTENANCE, "MT-1104", "Track Maintenance & Rapid Response", "David Kross"),
            ("viewer_alice", "Viewer123!", UserRole.VIEWER, "AU-9012", "Independent Safety Audit", "Alice Sterling"),
        ]

        user_objs = {}
        for username, password, role, badge, dept, full_name in users:
            parts = full_name.split()
            first_name, last_name = parts[0], " ".join(parts[1:])
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    "email": f"{username}@railguard.io",
                    "role": role,
                    "badge_id": badge,
                    "department": dept,
                    "first_name": first_name,
                    "last_name": last_name,
                    "is_staff": (role == UserRole.ADMIN),
                    "is_superuser": (role == UserRole.ADMIN),
                }
            )
            user.set_password(password)
            user.save()
            user_objs[username] = user
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created user: {username} ({role})"))

        engineer = user_objs["engineer_sarah"]
        inspector = user_objs["inspector_john"]

        # 2. Create 24 Track Sections
        sections_data = [
            ("TRK-001", "Northern Valley Mainline - Segment 01", LineType.MAIN_LINE, 0.0, 5.0, 37.7749, -122.4194, TrackHealthStatus.HEALTHY, 12, 160),
            ("TRK-002", "Northern Valley Mainline - Segment 02", LineType.MAIN_LINE, 5.0, 10.0, 37.7850, -122.4100, TrackHealthStatus.HEALTHY, 18, 160),
            ("TRK-003", "Central Express Tunnel Approach", LineType.HIGH_SPEED, 10.0, 15.2, 37.7950, -122.4000, TrackHealthStatus.WATCH, 68, 200),
            ("TRK-004", "Central Express Mountain Bore", LineType.HIGH_SPEED, 15.2, 22.0, 37.8050, -122.3900, TrackHealthStatus.NORMAL, 32, 200),
            ("TRK-005", "Eastern Foothills Bypass", LineType.MAIN_LINE, 22.0, 28.5, 37.8150, -122.3800, TrackHealthStatus.NORMAL, 28, 140),
            ("TRK-006", "Coastal Freight Corridor - North", LineType.FREIGHT_CORRIDOR, 28.5, 35.0, 37.8250, -122.3700, TrackHealthStatus.NORMAL, 42, 100),
            ("TRK-007", "Coastal Freight Curve KP 7.8", LineType.FREIGHT_CORRIDOR, 35.0, 42.0, 37.8350, -122.3600, TrackHealthStatus.HIGH, 79, 80),
            ("TRK-008", "Harbor Terminal Lead", LineType.FREIGHT_CORRIDOR, 42.0, 46.5, 37.8450, -122.3500, TrackHealthStatus.WATCH, 58, 60),
            ("TRK-009", "Suburban Junction KP 9.1", LineType.SUBURBAN, 0.0, 4.2, 37.7650, -122.4250, TrackHealthStatus.WATCH, 54, 110),
            ("TRK-010", "Metro South Crossover Line", LineType.SUBURBAN, 4.2, 8.8, 37.7550, -122.4350, TrackHealthStatus.HEALTHY, 15, 110),
            ("TRK-011", "Metro West Double Track", LineType.SUBURBAN, 8.8, 14.0, 37.7450, -122.4450, TrackHealthStatus.NORMAL, 35, 120),
            ("TRK-012", "River Crossing Truss Bridge Deck", LineType.MAIN_LINE, 14.0, 16.5, 37.7350, -122.4550, TrackHealthStatus.NORMAL, 40, 130),
            ("TRK-013", "Highland Summit Ascent", LineType.HIGH_SPEED, 16.5, 23.0, 37.7250, -122.4650, TrackHealthStatus.NORMAL, 25, 180),
            ("TRK-014", "Northern Valley Mainline KP 14.2", LineType.MAIN_LINE, 23.0, 28.0, 37.7150, -122.4750, TrackHealthStatus.CRITICAL, 88, 140),
            ("TRK-015", "Pine Crest Curve & Switch", LineType.SWITCH_YARD, 0.0, 2.5, 37.7050, -122.4850, TrackHealthStatus.WATCH, 62, 50),
            ("TRK-016", "Intermodal Container Yard Track A", LineType.SWITCH_YARD, 2.5, 6.0, 37.6950, -122.4950, TrackHealthStatus.NORMAL, 38, 40),
            ("TRK-017", "Intermodal Container Yard Track B", LineType.SWITCH_YARD, 6.0, 9.5, 37.6850, -122.5050, TrackHealthStatus.HEALTHY, 18, 40),
            ("TRK-018", "Highland Viaduct Deck Segment", LineType.HIGH_SPEED, 23.0, 27.5, 37.6750, -122.5150, TrackHealthStatus.WATCH, 62, 190),
            ("TRK-019", "Southern Industrial Siding", LineType.FREIGHT_CORRIDOR, 0.0, 5.0, 37.6650, -122.5250, TrackHealthStatus.NORMAL, 45, 70),
            ("TRK-020", "West Valley Agricultural Line", LineType.MAIN_LINE, 5.0, 12.0, 37.6550, -122.5350, TrackHealthStatus.HEALTHY, 20, 140),
            ("TRK-021", "East Switch Crossover 21", LineType.SWITCH_YARD, 0.0, 1.8, 37.6450, -122.5450, TrackHealthStatus.HIGH, 76, 45),
            ("TRK-022", "Airport Express Spur", LineType.HIGH_SPEED, 0.0, 8.5, 37.6350, -122.5550, TrackHealthStatus.HEALTHY, 10, 160),
            ("TRK-023", "South Basin Grade Separation", LineType.MAIN_LINE, 8.5, 14.0, 37.6250, -122.5650, TrackHealthStatus.NORMAL, 30, 150),
            ("TRK-024", "Terminal Station Throat Tracks", LineType.SWITCH_YARD, 14.0, 16.0, 37.6150, -122.5750, TrackHealthStatus.WATCH, 55, 35),
        ]

        created_sections = []
        for code, name, line_type, start_km, end_km, lat, lon, health, score, speed in sections_data:
            sec, _ = TrackSection.objects.update_or_create(
                section_code=code,
                defaults={
                    "name": name,
                    "line_type": line_type,
                    "start_km": start_km,
                    "end_km": end_km,
                    "latitude": lat,
                    "longitude": lon,
                    "health_status": health,
                    "deterioration_score": score,
                    "max_speed_kmh": speed,
                    "last_inspection_date": (timezone.now() - timedelta(days=random.randint(1, 30))).date()
                }
            )
            created_sections.append(sec)

            # Create Sensor Baseline for each section
            SensorBaseline.objects.get_or_create(
                track_section=sec,
                defaults={
                    "baseline_vibration_rms": 2.4,
                    "baseline_temperature": 22.0,
                    "baseline_stress": 45.0,
                    "baseline_axle_load": 22.5,
                    "baseline_acoustic_db": 68.0
                }
            )

        self.stdout.write(self.style.SUCCESS(f"Seeded {len(created_sections)} Track Sections & Baselines."))

        # 2b. Assign track sections to users
        sec_map = {s.section_code: s for s in created_sections}
        if "engineer_sarah" in user_objs:
            user_objs["engineer_sarah"].assigned_sections.set([
                sec_map["TRK-008"], sec_map["TRK-014"], sec_map["TRK-021"]
            ])
        if "inspector_john" in user_objs:
            user_objs["inspector_john"].assigned_sections.set([
                sec_map["TRK-014"], sec_map["TRK-015"]
            ])
        if "maintenance_dave" in user_objs:
            user_objs["maintenance_dave"].assigned_sections.set([
                sec_map["TRK-014"], sec_map["TRK-018"]
            ])
        if "viewer_alice" in user_objs:
            user_objs["viewer_alice"].assigned_sections.set([
                sec_map["TRK-001"], sec_map["TRK-002"], sec_map["TRK-014"]
            ])
        if "admin" in user_objs:
            user_objs["admin"].assigned_sections.set(created_sections)

        self.stdout.write(self.style.SUCCESS("Assigned specific railway corridors to user accounts."))

        # 3. Create 12 Optical Inspection Cameras with rich statuses and telemetry
        from core.models import CameraStatus, CameraEvent
        cameras_data = [
            ("CAM-014", "TRK-014", "KP 14.2 High-Stress Zone Array", "4K 120fps", 120, "Good", CameraStatus.LIVE, 14.20, True, "Surface Crack", 0.947, "HIGH"),
            ("CAM-015", "TRK-015", "Switch Tongue Point Optical Sensor", "1080p 60fps", 60, "Good", CameraStatus.LIVE, 2.10, False, "Nominal Trackbed", 0.982, "LOW"),
            ("CAM-016", "TRK-016", "Intermodal Terminal Entry Portal", "1080p 60fps", 60, "Good", CameraStatus.ONLINE, 4.30, False, "Fastener Check Passed", 0.961, "LOW"),
            ("CAM-017", "TRK-017", "Terminal Remote Crossover Siding", "1080p 30fps", 30, "None", CameraStatus.OFFLINE, 7.80, False, "Signal Unavailable", 0.0, "LOW"),
            ("CAM-001", "TRK-001", "Gantry KP 1.2 Northbound Corridor", "4K 60fps", 60, "Good", CameraStatus.LIVE, 1.20, False, "Clear Path", 0.991, "LOW"),
            ("CAM-003", "TRK-003", "Tunnel Entrance Portal High-Res", "1080p 60fps", 60, "Good", CameraStatus.ONLINE, 12.40, True, "Fastener Abnormality", 0.872, "MEDIUM"),
            ("CAM-006", "TRK-006", "Freight Corridor Gantry A", "1080p 30fps", 30, "Good", CameraStatus.ONLINE, 31.00, False, "Nominal Gauge", 0.944, "LOW"),
            ("CAM-007", "TRK-007", "Curve KP 7.8 Continuous Gauge Cam", "4K 120fps", 120, "Good", CameraStatus.LIVE, 7.80, True, "Rail Flange Wear", 0.912, "HIGH"),
            ("CAM-009", "TRK-009", "Suburban Junction Overhead Array", "1080p 60fps", 60, "Fair", CameraStatus.CONNECTING, 9.10, False, "Synchronizing Stream", 0.0, "LOW"),
            ("CAM-012", "TRK-012", "Bridge Deck Expansion Joint Cam", "4K 60fps", 60, "Good", CameraStatus.ONLINE, 15.10, False, "Joint Gap Nominal", 0.978, "LOW"),
            ("CAM-018", "TRK-018", "Viaduct Pier 4 Track Optical", "1080p 60fps", 60, "Good", CameraStatus.LIVE, 25.40, False, "Nominal Geometry", 0.965, "LOW"),
            ("CAM-021", "TRK-021", "Crossover 21 Switch Position Optical", "1080p 60fps", 60, "Good", CameraStatus.LIVE, 1.10, True, "Joint Abnormality", 0.895, "HIGH"),
        ]

        for cam_code, trk_code, loc, res, fps, sig, stat, km, has_anom, anom_lbl, anom_conf, anom_sev in cameras_data:
            trk = sec_map.get(trk_code, created_sections[0])
            cam, _ = Camera.objects.update_or_create(
                camera_code=cam_code,
                defaults={
                    "track_section": trk,
                    "name": f"Trackside Optical {cam_code}",
                    "location_description": loc,
                    "resolution": res,
                    "fps": fps,
                    "signal_quality": sig,
                    "status": stat,
                    "km_marker": km,
                    "has_anomaly": has_anom,
                    "anomaly_label": anom_lbl,
                    "anomaly_confidence": anom_conf,
                    "anomaly_severity": anom_sev,
                    "stream_url": f"simulated://feed/{cam_code.lower()}",
                    "is_active": (stat != CameraStatus.OFFLINE)
                }
            )

            # Seed event timeline entries for CAM-014 and other active cams
            if cam_code == "CAM-014":
                CameraEvent.objects.get_or_create(
                    camera=cam,
                    title="Surface anomaly detected",
                    defaults={
                        "event_type": "ANOMALY_DETECTED",
                        "description": "Transverse surface fissure detected on gauge corner with 94.7% AI confidence.",
                        "severity": "HIGH"
                    }
                )
                CameraEvent.objects.get_or_create(
                    camera=cam,
                    title="Frame analyzed",
                    defaults={
                        "event_type": "AI_FRAME_ANALYZED",
                        "description": "Multi-agent edge vision pipeline completed frame processing in 142ms.",
                        "severity": "INFO"
                    }
                )
                CameraEvent.objects.get_or_create(
                    camera=cam,
                    title="Camera connected",
                    defaults={
                        "event_type": "SYSTEM_CONNECT",
                        "description": "High-speed 120fps optical feed synchronized with edge inference node.",
                        "severity": "INFO"
                    }
                )
            elif stat == CameraStatus.OFFLINE:
                CameraEvent.objects.get_or_create(
                    camera=cam,
                    title="Signal Loss / Camera Unavailable",
                    defaults={
                        "event_type": "SIGNAL_LOST",
                        "description": "Connection timed out with remote solar/battery node. Awaiting auto-reconnect.",
                        "severity": "WARNING"
                    }
                )

        # 4. Generate 100+ Inspections across past 60 days
        base_date = timezone.now() - timedelta(days=60)
        inspections_list = []
        sources = [InspectionSource.PATROL_TRAIN, InspectionSource.DRONE, InspectionSource.FIXED_CAM, InspectionSource.MANUAL]
        statuses = [InspectionStatus.REVIEWED, InspectionStatus.AI_COMPLETE, InspectionStatus.AWAITING_REVIEW]

        for i in range(1, 105):
            insp_date = base_date + timedelta(hours=i * 14)
            trk = created_sections[i % len(created_sections)]
            code = f"INS-2026-{i:04d}"
            risk = RiskLevel.CRITICAL if trk.deterioration_score >= 80 else (RiskLevel.HIGH if trk.deterioration_score >= 65 else (RiskLevel.MEDIUM if trk.deterioration_score >= 40 else RiskLevel.LOW))
            status_choice = InspectionStatus.AWAITING_REVIEW if (i > 95) else (InspectionStatus.REVIEWED if (i % 2 == 0) else InspectionStatus.AI_COMPLETE)

            insp, _ = Inspection.objects.update_or_create(
                inspection_code=code,
                defaults={
                    "track_section": trk,
                    "inspector": inspector,
                    "inspection_date": insp_date,
                    "source": random.choice(sources),
                    "status": status_choice,
                    "risk_level": risk,
                    "ai_confidence": round(random.uniform(0.88, 0.98), 4),
                    "notes": f"Scheduled automated safety patrol run over corridor {trk.section_code}."
                }
            )
            inspections_list.append(insp)

        self.stdout.write(self.style.SUCCESS(f"Seeded {len(inspections_list)} Inspection records."))

        # 5. Seed Anomalies, Evidence, AIPredictions, and Multi-Agent runs for target inspections
        anomaly_types = [
            ("Surface Crack", "HIGH", "Transverse fissure detected along the rail gauge corner with high gradient edge profile."),
            ("Rail Corrosion", "MEDIUM", "Flaking oxide layer and pitting corrosion identified along the rail web."),
            ("Fastener Abnormality", "MEDIUM", "Pandrol clip displaced from sleeper fixture shoulder point."),
            ("Joint Abnormality", "HIGH", "Insulated joint fishplate bolt loosening and 6.2mm gap expansion."),
            ("Surface Wear", "LOW", "Head checking spall pattern on outer curve rail crown."),
            ("Track-bed Issue", "HIGH", "Ballast voiding and wet subgrade pumping under concrete sleeper tie.")
        ]

        for idx, insp in enumerate(inspections_list[-25:]):
            anom_data = anomaly_types[idx % len(anomaly_types)]
            anom_type, sev, expl = anom_data
            conf = round(float(insp.ai_confidence), 4)

            # Generate synthetic CV evidence image
            cv_res = analyze_inspection_image(None, anom_type)

            anomaly, _ = Anomaly.objects.update_or_create(
                inspection=insp,
                anomaly_type=anom_type,
                defaults={
                    "severity": sev,
                    "confidence": conf,
                    "bounding_box": cv_res["bounding_box"],
                    "explanation": expl,
                    "recommended_action": "Perform physical ultrasonic verification and track geometry check.",
                    "confirmed_by_engineer": (insp.status == InspectionStatus.REVIEWED)
                }
            )

            Evidence.objects.update_or_create(
                anomaly=anomaly,
                defaults={
                    "original_image_url": cv_res["original_image_url"],
                    "annotated_image_url": cv_res["annotated_image_url"],
                    "bounding_box_coordinates": cv_res["bounding_box"],
                    "detection_label": f"{anom_type} (AI Conf: {conf*100:.1f}%)"
                }
            )

            # Create AIPrediction & Multi-Agent executions
            prediction, _ = AIPrediction.objects.update_or_create(
                inspection=insp,
                defaults={
                    "model_version": "RailGuard-Vision-v3.2",
                    "predicted_anomaly_type": anom_type,
                    "confidence": conf,
                    "severity": sev,
                    "evidence_summary": f"Multi-modal evidence corroborates {anom_type} on section {insp.track_section.section_code}.",
                    "visual_features": cv_res["optical_features"],
                    "sensor_features": {"vibration_deviation_pct": "+22.4%", "stress_mpa": 74.2},
                    "historical_features": {"growth_pct": "+42.5%", "elapsed_days": 180}
                }
            )

            # Create agent executions
            agent_defs = [
                ("Vision Agent", "Computer Vision Defect Extraction", 142, conf, f"Detected {anom_type} with bounding box coordinates."),
                ("Sensor Agent", "IoT Telemetry Analysis", 18, 0.962, "Vibration levels +22.4% above calibrated baseline."),
                ("Historical Agent", "Deterioration Trend Tracker", 35, 0.925, "Defect growth +42.5% vs previous inspection."),
                ("Deterioration Agent", "Composite Health Scoring", 22, 0.940, f"Deterioration score computed: {insp.track_section.deterioration_score}/100."),
                ("Risk Agent", "Multi-Evidence Risk Synthesis", 45, 0.938, f"Risk evaluated as {insp.risk_level}."),
                ("Priority Agent", "Maintenance Triage Engine", 15, 0.955, f"Assigned priority: {insp.risk_level}."),
                ("Report Agent", "Executive Dossier Synthesis", 210, 0.985, "Generated compliant executive summary.")
            ]
            for aname, arole, lat, aconf, fsum in agent_defs:
                AgentExecution.objects.create(
                    prediction=prediction,
                    agent_name=aname,
                    agent_role=arole,
                    status="Completed",
                    execution_time_ms=lat,
                    confidence=aconf,
                    findings_summary=fsum
                )

            # If reviewed, create EngineerReview
            if insp.status == InspectionStatus.REVIEWED:
                rev, _ = EngineerReview.objects.update_or_create(
                    inspection=insp,
                    anomaly=anomaly,
                    defaults={
                        "engineer": engineer,
                        "decision": ReviewDecision.CONFIRM,
                        "engineering_comment": f"Visual defect corroborated on {insp.track_section.section_code}. Work order dispatched for track re-profiling and clip tightening.",
                        "work_order_required": True,
                        "speed_restriction_required": (sev == "CRITICAL"),
                        "temporary_speed_limit_kmh": 80 if (sev == "CRITICAL") else None
                    }
                )
                Feedback.objects.update_or_create(
                    review=rev,
                    defaults={
                        "prediction": prediction,
                        "rating_score": 5,
                        "engineer_feedback_notes": "High bounding box precision on gauge corner."
                    }
                )

            # Generate Report
            generate_inspection_report(insp, engineer)

        # 6. Seed Historical Records & Comparisons
        for sec in created_sections[:8]:
            h1 = HistoricalRecord.objects.create(
                track_section=sec,
                recorded_date=(timezone.now() - timedelta(days=180)).date(),
                anomaly_category="Surface Crack",
                severity="MEDIUM",
                metric_name="Crack Length",
                measured_value_mm=4.2,
                deterioration_index_at_time=42,
                engineer_decision="CONFIRMED"
            )
            h2 = HistoricalRecord.objects.create(
                track_section=sec,
                recorded_date=timezone.now().date(),
                anomaly_category="Surface Crack",
                severity="HIGH",
                metric_name="Crack Length",
                measured_value_mm=7.8,
                deterioration_index_at_time=sec.deterioration_score,
                engineer_decision="CONFIRMED"
            )
            HistoricalComparison.objects.create(
                track_section=sec,
                baseline_record=h1,
                current_record=h2,
                previous_value_mm=4.2,
                current_value_mm=7.8,
                delta_percentage=85.71,
                time_elapsed_days=180,
                wear_rate_mm_per_month=0.60,
                ai_risk_assessment="Accelerated growth trajectory observed. Surface fissure widening exceeds standard 0.2mm/month threshold."
            )

        # 7. Model Performance Metrics
        ModelMetric.objects.update_or_create(
            model_name="RailGuard-Vision-Multimodal-v3.2",
            defaults={
                "dataset_version": "RailNet-Synthetic-2026.Q3",
                "precision": 0.942,
                "recall": 0.928,
                "f1_score": 0.935,
                "accuracy": 0.951,
                "total_predictions": 1420,
                "reviewed_predictions": 890,
                "confirmed_count": 832,
                "rejected_count": 38,
                "further_inspection_count": 20,
                "human_agreement_pct": 93.48
            }
        )

        # 8. Seed Audit Log entries
        audit_events = [
            (engineer, "USER_LOGIN", "accounts_user", "2", {"ip": "127.0.0.1", "auth_method": "Token"}),
            (inspector, "MEDIA_UPLOAD", "inspections_inspection", "104", {"file": "patrol_scan_trk014.jpg", "size": "4.2MB"}),
            (engineer, "AI_ANALYSIS_EXECUTED", "ai_engine_aiprediction", "25", {"model": "RailGuard-Vision-v3.2", "duration_ms": 482}),
            (engineer, "ENGINEER_REVIEW_CONFIRM", "reviews_engineerreview", "12", {"decision": "CONFIRM", "work_order": True}),
            (engineer, "REPORT_GENERATED", "reports_report", "REP-2026-0104", {"compliance": "EN-50126"}),
        ]
        for usr, act, tmod, tid, det in audit_events:
            AuditLog.objects.create(
                user=usr,
                action=act,
                target_model=tmod,
                target_id=tid,
                details=det
            )

        self.stdout.write(self.style.SUCCESS("[SUCCESS] RailGuard AI Realistic Demo Dataset Seeded Successfully!"))
