from django.db import models
from django.conf import settings
from core.models import TrackSection

class InspectionSource(models.TextChoices):
    DRONE = 'DRONE', 'Unmanned Aerial Inspection Drone'
    PATROL_TRAIN = 'PATROL_TRAIN', 'High-Speed Inspection Railcar'
    FIXED_CAM = 'FIXED_CAM', 'Trackside Automated Optical Array'
    MANUAL = 'MANUAL', 'Field Inspector Handheld Scan'
    VIDEO_INGEST = 'VIDEO_INGEST', 'Recorded Video Feed Ingestion'

class InspectionStatus(models.TextChoices):
    PROCESSING = 'PROCESSING', 'Processing Ingestion'
    AI_COMPLETE = 'AI_COMPLETE', 'AI Analysis Complete'
    AWAITING_REVIEW = 'AWAITING_REVIEW', 'Awaiting Engineer Review'
    REVIEWED = 'REVIEWED', 'Reviewed & Certified'
    CLOSED = 'CLOSED', 'Action Closed'

class RiskLevel(models.TextChoices):
    LOW = 'LOW', 'Low Risk'
    MEDIUM = 'MEDIUM', 'Medium Attention'
    HIGH = 'HIGH', 'High Risk'
    CRITICAL = 'CRITICAL', 'Critical Immediate Action'

class AnomalySeverity(models.TextChoices):
    LOW = 'LOW', 'Low Severity'
    MEDIUM = 'MEDIUM', 'Medium Severity'
    HIGH = 'HIGH', 'High Severity'
    CRITICAL = 'CRITICAL', 'Critical Severity'

class Inspection(models.Model):
    inspection_code = models.CharField(max_length=40, unique=True, help_text="e.g. INS-2026-0142")
    track_section = models.ForeignKey(TrackSection, on_delete=models.CASCADE, related_name='inspections')
    inspector = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='conducted_inspections')
    inspection_date = models.DateTimeField(auto_now_add=True)
    source = models.CharField(max_length=30, choices=InspectionSource.choices, default=InspectionSource.PATROL_TRAIN)
    status = models.CharField(max_length=30, choices=InspectionStatus.choices, default=InspectionStatus.AI_COMPLETE)
    risk_level = models.CharField(max_length=20, choices=RiskLevel.choices, default=RiskLevel.LOW)
    ai_confidence = models.DecimalField(max_digits=5, decimal_places=4, default=0.9250, help_text="Aggregate AI Confidence (0.0000 - 1.0000)")
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-inspection_date']

    def __str__(self):
        return f"{self.inspection_code} ({self.track_section.section_code}) - {self.status}"

class InspectionMedia(models.Model):
    inspection = models.ForeignKey(Inspection, on_delete=models.CASCADE, related_name='media_files')
    media_file = models.FileField(upload_to='inspections/%Y/%m/%d/')
    media_type = models.CharField(max_length=20, default='image', choices=[('image', 'Image'), ('video', 'Video')])
    filename = models.CharField(max_length=255, blank=True)
    file_size_bytes = models.BigIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Media {self.id} for {self.inspection.inspection_code}"

class Anomaly(models.Model):
    ANOMALY_CATEGORIES = [
        ('Surface Crack', 'Surface Crack / Rolling Contact Fatigue'),
        ('Rail Corrosion', 'Rail Web & Base Corrosion'),
        ('Fastener Abnormality', 'Missing / Loose Rail Fastener / Clip'),
        ('Joint Abnormality', 'Fishplate & Insulated Joint Gap / Misalignment'),
        ('Surface Wear', 'Head Check Wear & Spalling'),
        ('Track-bed Issue', 'Ballast Void / Subgrade Scouring'),
        ('Foreign Object', 'Track Obstruction / Foreign Debris'),
        ('Unknown Anomaly', 'Unclassified Surface Irregularity'),
    ]

    inspection = models.ForeignKey(Inspection, on_delete=models.CASCADE, related_name='anomalies')
    media = models.ForeignKey(InspectionMedia, on_delete=models.SET_NULL, null=True, blank=True, related_name='anomalies')
    anomaly_type = models.CharField(max_length=60, choices=ANOMALY_CATEGORIES, default='Surface Crack')
    severity = models.CharField(max_length=20, choices=AnomalySeverity.choices, default=AnomalySeverity.MEDIUM)
    confidence = models.DecimalField(max_digits=5, decimal_places=4, default=0.9100)
    bounding_box = models.JSONField(default=dict, help_text="Normalized {x, y, width, height}")
    explanation = models.TextField(help_text="Human-readable explanation of computer-vision findings")
    recommended_action = models.TextField(default="Perform on-site ultrasonic verification within standard operating cycle.")
    confirmed_by_engineer = models.BooleanField(default=False)
    timestamp_in_video = models.CharField(max_length=20, blank=True, null=True, help_text="e.g. 00:14")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.anomaly_type} [{self.severity}] - Conf: {float(self.confidence)*100:.1f}%"

class Evidence(models.Model):
    anomaly = models.OneToOneField(Anomaly, on_delete=models.CASCADE, related_name='evidence')
    original_image_url = models.CharField(max_length=500, default="/media/evidence/sample_track_raw.jpg")
    annotated_image_url = models.CharField(max_length=500, default="/media/evidence/sample_track_annotated.jpg")
    bounding_box_coordinates = models.JSONField(default=dict)
    detection_label = models.CharField(max_length=100, default="Defect Contour Zone A")
    optical_parameters = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evidence for Anomaly #{self.anomaly.id}"
