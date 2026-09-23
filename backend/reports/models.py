from django.db import models
from django.conf import settings
from inspections.models import Inspection

class Report(models.Model):
    report_code = models.CharField(max_length=50, unique=True, help_text="e.g. REP-2026-0142")
    inspection = models.ForeignKey(Inspection, on_delete=models.CASCADE, related_name='reports')
    generated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=200, default="Certified Railway Infrastructure Inspection Dossier")
    executive_summary = models.TextField()
    ai_findings_section = models.JSONField(default=dict)
    engineer_findings_section = models.JSONField(default=dict)
    sensor_summary_section = models.JSONField(default=dict)
    historical_growth_section = models.JSONField(default=dict)
    compliance_standards = models.CharField(max_length=200, default="EN 50126 / FRA Track Safety Standards (49 CFR Part 213)")
    is_signed_off = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.report_code} - {self.title}"
