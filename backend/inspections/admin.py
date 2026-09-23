from django.contrib import admin
from .models import Inspection, InspectionMedia, Anomaly, Evidence

class AnomalyInline(admin.TabularInline):
    model = Anomaly
    extra = 0

class InspectionMediaInline(admin.TabularInline):
    model = InspectionMedia
    extra = 0

@admin.register(Inspection)
class InspectionAdmin(admin.ModelAdmin):
    list_display = ('inspection_code', 'track_section', 'inspector', 'inspection_date', 'status', 'risk_level', 'ai_confidence')
    list_filter = ('status', 'risk_level', 'source')
    search_fields = ('inspection_code', 'track_section__section_code')
    inlines = [InspectionMediaInline, AnomalyInline]

@admin.register(Anomaly)
class AnomalyAdmin(admin.ModelAdmin):
    list_display = ('anomaly_type', 'inspection', 'severity', 'confidence', 'confirmed_by_engineer', 'created_at')
    list_filter = ('anomaly_type', 'severity', 'confirmed_by_engineer')
    search_fields = ('anomaly_type', 'inspection__inspection_code')

@admin.register(Evidence)
class EvidenceAdmin(admin.ModelAdmin):
    list_display = ('anomaly', 'detection_label', 'created_at')
