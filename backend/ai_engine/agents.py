import time
import random
from .vision import analyze_inspection_image
from .deterioration import calculate_deterioration_index

class VisionAgent:
    """Agent 1: Analyzes optical imagery & video frames for structural defects."""
    @staticmethod
    def run(image_file_or_path, anomaly_hint=None):
        start = time.time()
        cv_result = analyze_inspection_image(image_file_or_path, anomaly_hint)
        elapsed_ms = int((time.time() - start) * 1000)
        return {
            "agent_name": "Vision Agent",
            "role": "Computer Vision Defect Extraction",
            "status": "Completed",
            "execution_time_ms": max(15, elapsed_ms),
            "confidence": cv_result["confidence"],
            "findings_summary": f"Detected {cv_result['anomaly_type']} with {cv_result['confidence']*100:.1f}% confidence. Bounding box and contour zone localized.",
            "data": cv_result
        }

class SensorAgent:
    """Agent 2: Evaluates telemetry against calibrated physics baselines."""
    @staticmethod
    def run(track_section, current_vib=3.8, current_stress=68.5):
        start = time.time()
        # Simulated sensor baseline comparison
        base_vib = 2.4
        deviation_pct = round(((current_vib - base_vib) / base_vib) * 100, 1)
        flag = "ELEVATED" if deviation_pct > 15 else "NOMINAL"
        elapsed_ms = int((time.time() - start) * 1000)

        return {
            "agent_name": "Sensor Agent",
            "role": "IoT Telemetry Analysis",
            "status": "Completed" if flag == "NOMINAL" else "Warning",
            "execution_time_ms": max(8, elapsed_ms),
            "confidence": 0.962,
            "findings_summary": f"Vibration level is {flag} ({deviation_pct:+0.1f}% above baseline). Dynamic rail stress: {current_stress} MPa.",
            "data": {
                "vibration_deviation_pct": deviation_pct,
                "vibration_rms": current_vib,
                "stress_mpa": current_stress,
                "status_flag": flag
            }
        }

class HistoricalAgent:
    """Agent 3: Analyzes prior inspection records and growth velocity."""
    @staticmethod
    def run(track_section, defect_type="Surface Crack"):
        start = time.time()
        # Simulated historical record retrieval
        prev_value_mm = 4.2
        curr_value_mm = 7.8
        growth_pct = round(((curr_value_mm - prev_value_mm) / prev_value_mm) * 100, 1)
        elapsed_ms = int((time.time() - start) * 1000)

        return {
            "agent_name": "Historical Agent",
            "role": "Deterioration Trend Tracker",
            "status": "Completed",
            "execution_time_ms": max(12, elapsed_ms),
            "confidence": 0.925,
            "findings_summary": f"Previous inspection recorded {prev_value_mm} mm defect. Current dimension is {curr_value_mm} mm (+{growth_pct}% growth over 180 days).",
            "data": {
                "previous_defect_mm": prev_value_mm,
                "current_defect_mm": curr_value_mm,
                "growth_percentage": growth_pct,
                "elapsed_days": 180
            }
        }

class DeteriorationAgent:
    """Agent 4: Computes composite 0-100 Deterioration Index."""
    @staticmethod
    def run(visual_severity, sensor_dev_pct, growth_pct):
        start = time.time()
        det_result = calculate_deterioration_index(
            visual_severity=visual_severity,
            sensor_deviation_pct=sensor_dev_pct,
            historical_growth_pct=growth_pct
        )
        elapsed_ms = int((time.time() - start) * 1000)

        return {
            "agent_name": "Deterioration Agent",
            "role": "Composite Health Scoring (0-100)",
            "status": "Completed",
            "execution_time_ms": max(10, elapsed_ms),
            "confidence": 0.940,
            "findings_summary": det_result["explanation"],
            "data": det_result
        }

class RiskAgent:
    """Agent 5: Synthesizes multi-source evidence into unified risk classification."""
    @staticmethod
    def run(vision_res, sensor_res, history_res, det_res):
        start = time.time()
        score = det_res["data"]["overall_score"]
        if score >= 80 or vision_res["data"]["severity"] == "CRITICAL":
            risk = "CRITICAL"
            advice = "Immediate track speed reduction and urgent 6-hour emergency verification required."
        elif score >= 65 or vision_res["data"]["severity"] == "HIGH":
            risk = "HIGH"
            advice = "Elevated inspection attention recommended. Schedule physical ultrasonic test within 48 hours."
        elif score >= 45:
            risk = "MEDIUM"
            advice = "Standard maintenance review required. Monitor trend on next scheduled run."
        else:
            risk = "LOW"
            advice = "Track corridor is within nominal safety envelope."

        elapsed_ms = int((time.time() - start) * 1000)
        return {
            "agent_name": "Risk Agent",
            "role": "Multi-Evidence Risk Synthesis",
            "status": "Completed",
            "execution_time_ms": max(14, elapsed_ms),
            "confidence": 0.938,
            "findings_summary": f"Assigned {risk} risk rating based on composite deterioration score of {score}/100.",
            "data": {
                "risk_level": risk,
                "recommended_advice": advice,
                "evidence_factors": [
                    f"Visual: {vision_res['data']['anomaly_type']} ({vision_res['data']['severity']})",
                    f"Sensor: {sensor_res['findings_summary']}",
                    f"History: {history_res['findings_summary']}"
                ]
            }
        }

class PriorityAgent:
    """Agent 6: Determines maintenance triage priority and dispatch SLA."""
    @staticmethod
    def run(risk_res):
        start = time.time()
        risk = risk_res["data"]["risk_level"]
        sla_map = {
            "CRITICAL": (94, "CRITICAL", 6, "Emergency Work Order - 6 Hour Dispatch SLA"),
            "HIGH": (82, "HIGH", 48, "Priority Maintenance - 48 Hour Verification Window"),
            "MEDIUM": (56, "MEDIUM", 336, "Routine Review - 14 Day Inspection Schedule"),
            "LOW": (22, "LOW", 720, "Standard Monitoring Cycle")
        }
        score, prio_level, sla_hours, action = sla_map.get(risk, (50, "MEDIUM", 168, "Standard Review"))
        elapsed_ms = int((time.time() - start) * 1000)

        return {
            "agent_name": "Priority Agent",
            "role": "Maintenance Triage Engine",
            "status": "Completed",
            "execution_time_ms": max(9, elapsed_ms),
            "confidence": 0.955,
            "findings_summary": f"Maintenance Priority: {prio_level}. SLA Dispatch Window: {sla_hours} hours.",
            "data": {
                "priority_level": prio_level,
                "priority_score": score,
                "dispatch_sla_hours": sla_hours,
                "recommended_action": action
            }
        }

class ReportAgent:
    """Agent 7: Synthesizes technical inspection dossiers."""
    @staticmethod
    def run(vision_res, risk_res, prio_res, det_res):
        start = time.time()
        elapsed_ms = int((time.time() - start) * 1000)
        summary = (
            f"Automated AI multimodal inspection detected {vision_res['data']['anomaly_type']} "
            f"with {vision_res['data']['confidence']*100:.1f}% confidence. "
            f"Composite deterioration index is {det_res['data']['overall_score']}/100 ({det_res['data']['health_band']}). "
            f"Assigned maintenance priority is {prio_res['data']['priority_level']}. "
            f"Human engineer verification is formally pending before work order execution."
        )
        return {
            "agent_name": "Report Agent",
            "role": "Executive Dossier Synthesis",
            "status": "Completed",
            "execution_time_ms": max(18, elapsed_ms),
            "confidence": 0.985,
            "findings_summary": "Executive inspection dossier synthesized and formatted for compliance export.",
            "data": {
                "executive_summary": summary,
                "compliance_tag": "EN-50126-Advisory-Standard"
            }
        }

class MultiAgentOrchestrator:
    """Orchestrator Agent: Coordinates entire pipeline execution."""
    @staticmethod
    def execute_full_pipeline(image_path_or_file=None, track_section=None, anomaly_hint=None):
        pipeline_start = time.time()

        # Step 1: Vision Agent
        vision_out = VisionAgent.run(image_path_or_file, anomaly_hint)

        # Step 2: Sensor Agent
        sensor_out = SensorAgent.run(track_section)

        # Step 3: Historical Agent
        history_out = HistoricalAgent.run(track_section, vision_out["data"]["anomaly_type"])

        # Step 4: Deterioration Agent
        det_out = DeteriorationAgent.run(
            visual_severity=vision_out["data"]["severity"],
            sensor_dev_pct=sensor_out["data"]["vibration_deviation_pct"],
            growth_pct=history_out["data"]["growth_percentage"]
        )

        # Step 5: Risk Agent
        risk_out = RiskAgent.run(vision_out, sensor_out, history_out, det_out)

        # Step 6: Priority Agent
        prio_out = PriorityAgent.run(risk_out)

        # Step 7: Report Agent
        report_out = ReportAgent.run(vision_out, risk_out, prio_out, det_out)

        total_elapsed_ms = int((time.time() - pipeline_start) * 1000)

        all_agents = [
            vision_out, sensor_out, history_out, det_out, risk_out, prio_out, report_out
        ]

        return {
            "orchestration_time_ms": total_elapsed_ms,
            "vision_agent": vision_out,
            "sensor_agent": sensor_out,
            "historical_agent": history_out,
            "deterioration_agent": det_out,
            "risk_agent": risk_out,
            "priority_agent": prio_out,
            "report_agent": report_out,
            "agents_list": all_agents,
            "overall_prediction": {
                "anomaly_type": vision_out["data"]["anomaly_type"],
                "confidence": vision_out["data"]["confidence"],
                "severity": vision_out["data"]["severity"],
                "bounding_box": vision_out["data"]["bounding_box"],
                "original_image_url": vision_out["data"]["original_image_url"],
                "annotated_image_url": vision_out["data"]["annotated_image_url"],
                "explanation": vision_out["data"]["explanation"],
                "deterioration_score": det_out["data"]["overall_score"],
                "health_band": det_out["data"]["health_band"],
                "priority": prio_out["data"]["priority_level"],
                "recommended_action": prio_out["data"]["recommended_action"]
            }
        }
