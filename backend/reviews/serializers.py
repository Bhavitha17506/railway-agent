from rest_framework import serializers
from .models import EngineerReview, Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'

class EngineerReviewSerializer(serializers.ModelSerializer):
    engineer_name = serializers.CharField(source='engineer.get_full_name', read_only=True)
    decision_display = serializers.CharField(source='get_decision_display', read_only=True)
    inspection_code = serializers.CharField(source='inspection.inspection_code', read_only=True)
    track_section_code = serializers.CharField(source='inspection.track_section.section_code', read_only=True)
    feedback_entry = FeedbackSerializer(read_only=True)

    class Meta:
        model = EngineerReview
        fields = '__all__'
