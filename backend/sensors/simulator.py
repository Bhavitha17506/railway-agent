import random
import math
from datetime import datetime, timedelta
from django.utils import timezone
from .models import SensorReading, SensorBaseline
from core.models import TrackSection

def generate_live_sensor_data(track_section, count=20, inject_anomaly=False):
    """
    Generates realistic synthetic time-series sensor data for a track section.
    Includes physics-correlated variables: vibration, rail temperature, mechanical stress, axle load.
    """
    baseline, _ = SensorBaseline.objects.get_or_create(track_section=track_section)
    readings = []
    base_time = timezone.now() - timedelta(seconds=count * 3)

    for i in range(count):
        t = base_time + timedelta(seconds=i * 3)
        time_factor = math.sin(i * 0.3)

        # Base physical parameters with small natural variance
        vib = baseline.baseline_vibration_rms + (time_factor * 0.4) + random.uniform(-0.2, 0.3)
        temp = baseline.baseline_temperature + (time_factor * 1.5) + random.uniform(-0.5, 0.5)
        stress = baseline.baseline_stress + (time_factor * 4.0) + random.uniform(-2.0, 2.0)
        load = baseline.baseline_axle_load + random.uniform(-1.5, 1.5)
        humidity = 58.0 + random.uniform(-3.0, 3.0)
        acoustic = baseline.baseline_acoustic_db + random.uniform(-2.0, 2.0)
        gauge = 1435.0 + random.uniform(-1.0, 1.2)

        is_anom = False
        anom_reason = ""

        # If injecting anomaly on later steps or if section is deteriorating
        is_elevated_section = track_section.deterioration_score > 60
        if (inject_anomaly and i >= count - 4) or (is_elevated_section and i % 4 == 0):
            vib += random.uniform(2.8, 4.5)
            stress += random.uniform(25.0, 38.0)
            acoustic += random.uniform(14.0, 22.0)
            gauge += random.uniform(4.0, 8.5)
            is_anom = True
            anom_reason = "Vibration spike (+54%) & Dynamic stress elevation (78 MPa) detected above calibrated baseline."

        readings.append({
            "timestamp": t.strftime("%H:%M:%S"),
            "full_timestamp": t.isoformat(),
            "vibration_rms": round(vib, 2),
            "rail_temperature": round(temp, 1),
            "track_stress": round(stress, 1),
            "axle_load": round(load, 1),
            "humidity": round(humidity, 1),
            "acoustic_db": round(acoustic, 1),
            "geometry_gauge_mm": round(gauge, 1),
            "is_anomaly": is_anom,
            "anomaly_reason": anom_reason,
            "is_simulated": True
        })

    return readings
