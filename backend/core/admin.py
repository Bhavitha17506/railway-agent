from django.contrib import admin
from .models import TrackSection, Camera

@admin.register(TrackSection)
class TrackSectionAdmin(admin.ModelAdmin):
    list_display = ('section_code', 'name', 'line_type', 'health_status', 'deterioration_score', 'last_inspection_date')
    list_filter = ('health_status', 'line_type', 'electrified')
    search_fields = ('section_code', 'name')

@admin.register(Camera)
class CameraAdmin(admin.ModelAdmin):
    list_display = ('camera_code', 'name', 'track_section', 'resolution', 'is_active', 'last_heartbeat')
    list_filter = ('is_active', 'resolution')
    search_fields = ('camera_code', 'name')
