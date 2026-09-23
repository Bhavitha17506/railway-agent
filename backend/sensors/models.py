from django.db import models
from core.models import TrackSection

class SensorBaseline(models.Model):
    track_section = models.OneToOneField(TrackSection, on_delete=models.CASCADE, related_name='sensor_baseline')
    baseline_vibration_rms = models.FloatField(default=2.4, help_text="Nominal baseline vibration in m/s^2")
    baseline_temperature = models.FloatField(default=22.0, help_text="Nominal rail temperature in °C")
    baseline_stress = models.FloatField(default=45.0, help_text="Nominal track stress in MPa")
    baseline_axle_load = models.FloatField(default=22.5, help_text="Nominal axle load in Tonnes")
    baseline_acoustic_db = models.FloatField(default=68.0, help_text="Nominal acoustic level in dB")
    vibration_threshold_warn = models.FloatField(default=4.0)
    vibration_threshold_crit = models.FloatField(default=6.5)
    stress_threshold_warn = models.FloatField(default=65.0)
    stress_threshold_crit = models.FloatField(default=85.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Baseline for {self.track_section.section_code}"

class SensorReading(models.Model):
    track_section = models.ForeignKey(TrackSection, on_delete=models.CASCADE, related_name='sensor_readings')
    timestamp = models.DateTimeField(auto_now_add=True)
    vibration_rms = models.FloatField(help_text="RMS vibration in m/s^2")
    rail_temperature = models.FloatField(help_text="Rail temperature in °C")
    track_stress = models.FloatField(help_text="Track stress in MPa")
    axle_load = models.FloatField(help_text="Axle load in Tonnes")
    humidity = models.FloatField(default=55.0, help_text="Relative humidity %")
    acoustic_db = models.FloatField(default=70.0, help_text="Acoustic emission in dB")
    geometry_gauge_mm = models.FloatField(default=1435.0, help_text="Track gauge in mm (Standard: 1435mm)")
    is_anomaly = models.BooleanField(default=False)
    anomaly_reason = models.CharField(max_length=200, blank=True, null=True)
    is_simulated = models.BooleanField(default=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"SensorReading @ {self.track_section.section_code} [{self.timestamp.strftime('%H:%M:%S')}]"
