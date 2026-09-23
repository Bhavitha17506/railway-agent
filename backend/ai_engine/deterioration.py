def calculate_deterioration_index(visual_severity, sensor_deviation_pct, historical_growth_pct, days_since_maintenance=120):
    """
    Computes prototype Deterioration Index (0 - 100):
    Weights:
      Visual Defects: 35%
      Sensor Deviation: 25%
      Historical Change: 25%
      Inspection Recency: 15%
    """
    # 1. Visual factor (0 - 100)
    severity_map = {
        'CRITICAL': 95.0,
        'HIGH': 75.0,
        'MEDIUM': 45.0,
        'LOW': 20.0
    }
    v_raw = severity_map.get(visual_severity.upper(), 50.0)
    v_factor = (v_raw * 0.35)

    # 2. Sensor factor (0 - 100 based on deviation from baseline)
    s_raw = min(100.0, max(10.0, abs(sensor_deviation_pct) * 2.8))
    s_factor = (s_raw * 0.25)

    # 3. Historical factor (0 - 100 based on growth rate)
    h_raw = min(100.0, max(10.0, historical_growth_pct * 1.1))
    h_factor = (h_raw * 0.25)

    # 4. Recency factor (0 - 100 based on elapsed days)
    r_raw = min(100.0, max(10.0, (days_since_maintenance / 365.0) * 100.0))
    r_factor = (r_raw * 0.15)

    overall_score = int(round(v_factor + s_factor + h_factor + r_factor))
    overall_score = max(0, min(100, overall_score))

    if overall_score >= 90:
        band = "Critical Attention (90-100)"
    elif overall_score >= 75:
        band = "High Priority (75-89)"
    elif overall_score >= 50:
        band = "Watch / Elevated (50-74)"
    elif overall_score >= 25:
        band = "Normal Wear (25-49)"
    else:
        band = "Healthy (0-24)"

    explanation = (
        f"Deterioration Index is {overall_score}/100 ({band}). Primary driver is "
        f"{'Visual Defect Severity' if v_raw >= max(s_raw, h_raw) else 'Sensor Vibration Deviation' if s_raw >= h_raw else 'Historical Growth Delta'} "
        f"contributing with calibrated multi-factor weights."
    )

    return {
        "overall_score": overall_score,
        "visual_factor": round(v_factor, 1),
        "sensor_factor": round(s_factor, 1),
        "historical_factor": round(h_factor, 1),
        "recency_factor": round(r_factor, 1),
        "health_band": band,
        "explanation": explanation
    }
