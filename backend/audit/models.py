from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_entries')
    action = models.CharField(max_length=100, help_text="e.g. USER_LOGIN, MEDIA_UPLOAD, AI_INFERENCE, ENGINEER_REVIEW")
    target_model = models.CharField(max_length=60, blank=True, null=True)
    target_id = models.CharField(max_length=60, blank=True, null=True)
    ip_address = models.CharField(max_length=50, default="127.0.0.1")
    details = models.JSONField(default=dict)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        actor = self.user.username if self.user else "SYSTEM/ANONYMOUS"
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}] {actor} -> {self.action}"
