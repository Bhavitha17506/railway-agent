from django.contrib.auth.models import AbstractUser
from django.db import models

class UserRole(models.TextChoices):
    ADMIN = 'ADMIN', 'System Administrator'
    ENGINEER = 'ENGINEER', 'Railway Engineer'
    INSPECTOR = 'INSPECTOR', 'Field Inspector'
    MAINTENANCE = 'MAINTENANCE', 'Maintenance Team'
    VIEWER = 'VIEWER', 'Auditor / Viewer'

class User(AbstractUser):
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.ENGINEER,
        help_text="Role-based access level for railway operations"
    )
    badge_id = models.CharField(max_length=50, blank=True, null=True, help_text="Employee / Engineer License ID")
    department = models.CharField(max_length=100, blank=True, null=True, default="Track Infrastructure")
    phone_number = models.CharField(max_length=30, blank=True, null=True)
    assigned_sections = models.ManyToManyField('core.TrackSection', blank=True, related_name='assigned_users')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_admin_role(self):
        return self.role == UserRole.ADMIN or self.is_superuser

    def is_engineer_role(self):
        return self.role in [UserRole.ADMIN, UserRole.ENGINEER]

    def is_inspector_role(self):
        return self.role in [UserRole.ADMIN, UserRole.ENGINEER, UserRole.INSPECTOR]

    def is_maintenance_role(self):
        return self.role in [UserRole.ADMIN, UserRole.ENGINEER, UserRole.MAINTENANCE]

    def is_viewer_role(self):
        return True

    def get_permissions_list(self):
        perms = []
        if self.role == UserRole.ADMIN or self.is_superuser:
            perms = [
                'manage_users', 'manage_system', 'view_all_sections', 'view_all_cameras',
                'view_ai_results', 'view_audit_logs', 'view_model_metrics', 'generate_reports',
                'configure_cameras', 'manage_roles'
            ]
        elif self.role == UserRole.ENGINEER:
            perms = [
                'create_inspections', 'upload_media', 'analyze_media', 'view_ai_predictions',
                'view_evidence', 'compare_history', 'view_sensors', 'review_findings',
                'confirm_reject_findings', 'add_engineering_comments', 'generate_reports',
                'view_assigned_sections'
            ]
        elif self.role == UserRole.INSPECTOR:
            perms = [
                'create_inspections', 'upload_media', 'capture_camera_frames', 'view_assigned_sections',
                'view_own_history', 'submit_observations', 'view_ai_analysis'
            ]
        elif self.role == UserRole.MAINTENANCE:
            perms = [
                'view_confirmed_findings', 'view_evidence', 'view_track_conditions',
                'view_inspection_priorities', 'update_maintenance_status', 'add_maintenance_notes',
                'view_reports', 'view_assigned_sections'
            ]
        elif self.role == UserRole.VIEWER:
            perms = [
                'view_track_map', 'view_inspection_overview', 'view_reports', 'read_only'
            ]
        return perms

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
