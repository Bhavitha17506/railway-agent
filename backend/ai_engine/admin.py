from django.contrib import admin
from .models import AIPrediction, AgentExecution, DeteriorationScore, InspectionPriority, ModelMetric

class AgentExecutionInline(admin.TabularInline):
    model = AgentExecution
    extra = 0

@admin.register(AIPrediction)
class AIPredictionAdmin(admin.ModelAdmin):
    list_display = ('inspection', 'predicted_anomaly_type', 'confidence', 'severity', 'model_version', 'created_at')
    list_filter = ('predicted_anomaly_type', 'severity')
    inlines = [AgentExecutionInline]

@admin.register(DeteriorationScore)
class DeteriorationScoreAdmin(admin.ModelAdmin):
    list_display = ('track_section', 'overall_score', 'health_band', 'scored_at')

@admin.register(InspectionPriority)
class InspectionPriorityAdmin(admin.ModelAdmin):
    list_display = ('track_section', 'priority_level', 'score', 'dispatch_sla_hours', 'assigned_at')

@admin.register(ModelMetric)
class ModelMetricAdmin(admin.ModelAdmin):
    list_display = ('model_name', 'f1_score', 'precision', 'recall', 'human_agreement_pct', 'last_evaluated_at')
