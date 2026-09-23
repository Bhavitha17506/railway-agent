from django.contrib import admin
from .models import HistoricalRecord, HistoricalComparison

@admin.register(HistoricalRecord)
class HistoricalRecordAdmin(admin.ModelAdmin):
    list_display = ('track_section', 'recorded_date', 'anomaly_category', 'measured_value_mm', 'deterioration_index_at_time')
    list_filter = ('anomaly_category', 'severity')
    search_fields = ('track_section__section_code',)

@admin.register(HistoricalComparison)
class HistoricalComparisonAdmin(admin.ModelAdmin):
    list_display = ('track_section', 'previous_value_mm', 'current_value_mm', 'delta_percentage', 'created_at')
