from rest_framework import serializers
from .models import AIPrediction, AgentExecution, DeteriorationScore, InspectionPriority, ModelMetric

class AgentExecutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentExecution
        fields = '__all__'

class AIPredictionSerializer(serializers.ModelSerializer):
    agent_runs = AgentExecutionSerializer(many=True, read_only=True)
    inspection_code = serializers.CharField(source='inspection.inspection_code', read_only=True)
    track_section_code = serializers.CharField(source='inspection.track_section.section_code', read_only=True)

    class Meta:
        model = AIPrediction
        fields = '__all__'

class DeteriorationScoreSerializer(serializers.ModelSerializer):
    track_section_code = serializers.CharField(source='track_section.section_code', read_only=True)

    class Meta:
        model = DeteriorationScore
        fields = '__all__'

class InspectionPrioritySerializer(serializers.ModelSerializer):
    track_section_code = serializers.CharField(source='track_section.section_code', read_only=True)
    track_section_name = serializers.CharField(source='track_section.name', read_only=True)

    class Meta:
        model = InspectionPriority
        fields = '__all__'

class ModelMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelMetric
        fields = '__all__'
