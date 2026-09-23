from django.db import models
from core.models import TrackSection
from inspections.models import Inspection, Anomaly

class AIPrediction(models.Model):
    inspection = models.ForeignKey(Inspection, on_delete=models.CASCADE, related_name='ai_predictions')
    model_version = models.CharField(max_length=50, default="RailGuard-Vision-v3.2")
    predicted_anomaly_type = models.CharField(max_length=80, default="Surface Crack")
    confidence = models.DecimalField(max_digits=5, decimal_places=4, default=0.9470)
    severity = models.CharField(max_length=20, default="HIGH")
    evidence_summary = models.TextField(help_text="Consolidated multi-modal evidence rationale")
    visual_features = models.JSONField(default=dict)
    sensor_features = models.JSONField(default=dict)
    historical_features = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Prediction {self.id} for {self.inspection.inspection_code} ({self.predicted_anomaly_type}: {float(self.confidence)*100:.1f}%)"

class AgentExecution(models.Model):
    prediction = models.ForeignKey(AIPrediction, on_delete=models.CASCADE, related_name='agent_runs', null=True, blank=True)
    agent_name = models.CharField(max_length=50, help_text="e.g. Vision Agent, Sensor Agent, Risk Agent")
    agent_role = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default="Completed", choices=[
        ('Active', 'Active'), ('Completed', 'Completed'), ('Warning', 'Warning'), ('Error', 'Error')
    ])
    execution_time_ms = models.IntegerField(default=45)
    confidence = models.FloatField(default=0.95)
    findings_summary = models.TextField()
    evidence_payload = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.agent_name} -> {self.status}"

class DeteriorationScore(models.Model):
    track_section = models.ForeignKey(TrackSection, on_delete=models.CASCADE, related_name='deterioration_history')
    inspection = models.ForeignKey(Inspection, on_delete=models.SET_NULL, null=True, blank=True, related_name='deterioration_scores')
    overall_score = models.IntegerField(default=68, help_text="0 (Healthy) to 100 (Critical)")
    visual_factor = models.FloatField(default=35.0, help_text="Visual Defect contribution (35% weight)")
    sensor_factor = models.FloatField(default=25.0, help_text="Sensor Deviation contribution (25% weight)")
    historical_factor = models.FloatField(default=25.0, help_text="Historical Growth contribution (25% weight)")
    recency_factor = models.FloatField(default=15.0, help_text="Inspection Recency contribution (15% weight)")
    health_band = models.CharField(max_length=30, default="Watch / Elevated (50-74)")
    explanation = models.TextField()
    scored_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-scored_at']

    def __str__(self):
        return f"{self.track_section.section_code}: {self.overall_score}/100 [{self.health_band}]"

class InspectionPriority(models.Model):
    track_section = models.ForeignKey(TrackSection, on_delete=models.CASCADE, related_name='priorities')
    inspection = models.ForeignKey(Inspection, on_delete=models.SET_NULL, null=True, blank=True, related_name='priority_assignments')
    priority_level = models.CharField(max_length=20, choices=[
        ('CRITICAL', 'CRITICAL (6h Window)'),
        ('HIGH', 'HIGH (48h Window)'),
        ('MEDIUM', 'MEDIUM (14d Window)'),
        ('LOW', 'LOW (Routine Inspection)')
    ], default='HIGH')
    score = models.IntegerField(default=82)
    contributing_reasons = models.JSONField(default=list)
    recommended_action = models.TextField(default="Immediate track ultrasonic verification and visual manual inspection scheduled.")
    dispatch_sla_hours = models.IntegerField(default=48)
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-score', '-assigned_at']

    def __str__(self):
        return f"{self.track_section.section_code} Priority: {self.priority_level} ({self.score})"

class ModelMetric(models.Model):
    model_name = models.CharField(max_length=100, default="RailGuard-Vision-Multimodal-v3.2")
    dataset_version = models.CharField(max_length=50, default="RailNet-Synthetic-2026.Q3")
    precision = models.FloatField(default=0.942)
    recall = models.FloatField(default=0.928)
    f1_score = models.FloatField(default=0.935)
    accuracy = models.FloatField(default=0.951)
    total_predictions = models.IntegerField(default=1420)
    reviewed_predictions = models.IntegerField(default=890)
    confirmed_count = models.IntegerField(default=832)
    rejected_count = models.IntegerField(default=38)
    further_inspection_count = models.IntegerField(default=20)
    human_agreement_pct = models.FloatField(default=93.48)
    last_evaluated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.model_name} (F1: {self.f1_score:.3f}, Agreement: {self.human_agreement_pct}%)"
