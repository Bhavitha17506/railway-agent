from django.db import models
from core.models import TrackSection
from inspections.models import Inspection

class HistoricalRecord(models.Model):
    track_section = models.ForeignKey(TrackSection, on_delete=models.CASCADE, related_name='historical_records')
    inspection = models.ForeignKey(Inspection, on_delete=models.SET_NULL, null=True, blank=True, related_name='historical_entries')
    recorded_date = models.DateField()
    anomaly_category = models.CharField(max_length=80, default="Surface Crack")
    severity = models.CharField(max_length=20, default="MEDIUM")
    metric_name = models.CharField(max_length=80, default="Crack Length", help_text="e.g. Crack Length, Wear Depth, Joint Gap")
    measured_value_mm = models.FloatField(default=4.2, help_text="Dimension in millimeters")
    confidence_score = models.FloatField(default=0.92)
    deterioration_index_at_time = models.IntegerField(default=45)
    engineer_decision = models.CharField(max_length=30, default="CONFIRMED")
    inspector_notes = models.TextField(blank=True, null=True)
    image_snapshot_url = models.CharField(max_length=500, default="/media/evidence/history_crack_t1.jpg")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-recorded_date']

    def __str__(self):
        return f"{self.track_section.section_code} - {self.recorded_date} ({self.metric_name}: {self.measured_value_mm}mm)"

class HistoricalComparison(models.Model):
    track_section = models.ForeignKey(TrackSection, on_delete=models.CASCADE, related_name='comparisons')
    baseline_record = models.ForeignKey(HistoricalRecord, on_delete=models.CASCADE, related_name='baseline_comparisons')
    current_record = models.ForeignKey(HistoricalRecord, on_delete=models.CASCADE, related_name='current_comparisons')
    previous_value_mm = models.FloatField(default=4.2)
    current_value_mm = models.FloatField(default=7.8)
    delta_percentage = models.FloatField(default=85.71, help_text="% Growth rate")
    time_elapsed_days = models.IntegerField(default=180)
    wear_rate_mm_per_month = models.FloatField(default=0.60)
    ai_risk_assessment = models.TextField(default="Accelerated growth trajectory observed. Surface fissure widening exceeds standard 0.2mm/month nominal threshold.")
    previous_image_url = models.CharField(max_length=500, default="/media/evidence/historical_prev.jpg")
    current_image_url = models.CharField(max_length=500, default="/media/evidence/historical_curr.jpg")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comparison {self.track_section.section_code} (+{self.delta_percentage:.1f}%)"
