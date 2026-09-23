from django.db import models
from django.conf import settings
from inspections.models import Inspection, Anomaly
from ai_engine.models import AIPrediction

class ReviewDecision(models.TextChoices):
    CONFIRM = 'CONFIRM', 'Confirm AI Finding'
    REJECT = 'REJECT', 'Reject Finding (False Positive)'
    NEEDS_FURTHER_INSPECTION = 'NEEDS_FURTHER_INSPECTION', 'Needs Further On-Track Verification'

class EngineerReview(models.Model):
    inspection = models.ForeignKey(Inspection, on_delete=models.CASCADE, related_name='engineer_reviews')
    anomaly = models.ForeignKey(Anomaly, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
    engineer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='submitted_reviews')
    decision = models.CharField(max_length=40, choices=ReviewDecision.choices, default=ReviewDecision.CONFIRM)
    engineering_comment = models.TextField(help_text="Detailed engineering rationale and field maintenance instruction")
    work_order_required = models.BooleanField(default=True, help_text="Flag whether field maintenance crew must be dispatched")
    speed_restriction_required = models.BooleanField(default=False)
    temporary_speed_limit_kmh = models.IntegerField(blank=True, null=True)
    reviewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-reviewed_at']

    def __str__(self):
        return f"Review #{self.id} on {self.inspection.inspection_code} by {self.engineer}: {self.decision}"

class Feedback(models.Model):
    review = models.OneToOneField(EngineerReview, on_delete=models.CASCADE, related_name='feedback_entry')
    prediction = models.ForeignKey(AIPrediction, on_delete=models.SET_NULL, null=True, blank=True, related_name='feedback_records')
    feedback_category = models.CharField(max_length=60, default="Visual Bounding Box Accuracy")
    rating_score = models.IntegerField(default=5, help_text="1 to 5 scale")
    engineer_feedback_notes = models.TextField(blank=True, null=True)
    is_used_for_retraining_evaluation = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback on Review #{self.review.id} ({self.rating_score}/5)"
