from django.contrib import admin
from .models import SensorReading, SensorBaseline

@admin.register(SensorBaseline)
class SensorBaselineAdmin(admin.ModelAdmin):
    list_display = ('track_section', 'baseline_vibration_rms', 'baseline_temperature', 'baseline_stress', 'created_at')

@admin.register(SensorReading)
class SensorReadingAdmin(admin.ModelAdmin):
    list_display = ('track_section', 'timestamp', 'vibration_rms', 'rail_temperature', 'track_stress', 'is_anomaly')
    list_filter = ('is_anomaly', 'is_simulated')
