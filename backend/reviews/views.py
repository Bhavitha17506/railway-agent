from rest_framework import viewsets, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import EngineerReview, Feedback, ReviewDecision
from .serializers import EngineerReviewSerializer, FeedbackSerializer
from inspections.models import Inspection, Anomaly, InspectionStatus
from ai_engine.models import AIPrediction, ModelMetric
from audit.models import AuditLog

class EngineerReviewViewSet(viewsets.ModelViewSet):
    queryset = EngineerReview.objects.all().select_related('inspection', 'inspection__track_section', 'engineer', 'anomaly').order_by('-reviewed_at')
    serializer_class = EngineerReviewSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['inspection__inspection_code', 'decision', 'engineering_comment']
    ordering_fields = ['reviewed_at', 'decision']

    def create(self, request, *args, **kwargs):
        inspection_id = request.data.get('inspection_id')
        anomaly_id = request.data.get('anomaly_id')
        decision = request.data.get('decision', 'CONFIRM')
        comment = request.data.get('engineering_comment', 'Finding verified and action plan assigned.')
        work_order = request.data.get('work_order_required', True)
        speed_rest = request.data.get('speed_restriction_required', False)
        speed_limit = request.data.get('temporary_speed_limit_kmh')

        inspection = None
        if inspection_id:
            try:
                inspection = Inspection.objects.get(id=inspection_id)
            except Inspection.DoesNotExist:
                pass
        
        if not inspection:
            inspection = Inspection.objects.first()

        anomaly = None
        if anomaly_id:
            try:
                anomaly = Anomaly.objects.get(id=anomaly_id)
            except Anomaly.DoesNotExist:
                pass
        if not anomaly and inspection:
            anomaly = inspection.anomalies.first()

        # Update anomaly and inspection state
        if anomaly and decision == ReviewDecision.CONFIRM:
            anomaly.confirmed_by_engineer = True
            anomaly.save()

        if inspection:
            inspection.status = InspectionStatus.REVIEWED
            inspection.save()

        engineer_user = request.user if request.user.is_authenticated else None

        review = EngineerReview.objects.create(
            inspection=inspection,
            anomaly=anomaly,
            engineer=engineer_user,
            decision=decision,
            engineering_comment=comment,
            work_order_required=work_order,
            speed_restriction_required=speed_rest,
            temporary_speed_limit_kmh=speed_limit
        )

        # Create auto-feedback for model evaluation metric
        pred = AIPrediction.objects.filter(inspection=inspection).first() if inspection else None
        rating = 5 if decision == ReviewDecision.CONFIRM else (1 if decision == ReviewDecision.REJECT else 3)
        Feedback.objects.create(
            review=review,
            prediction=pred,
            rating_score=rating,
            engineer_feedback_notes=comment
        )

        # Audit log creation
        AuditLog.objects.create(
            user=engineer_user,
            action=f"ENGINEER_REVIEW_{decision}",
            target_model="EngineerReview",
            target_id=str(review.id),
            details={
                "inspection_code": inspection.inspection_code if inspection else "N/A",
                "decision": decision,
                "work_order_dispatched": work_order,
                "comment": comment
            }
        )

        return Response(EngineerReviewSerializer(review).data, status=status.HTTP_201_CREATED)

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all().select_related('review', 'prediction').order_by('-created_at')
    serializer_class = FeedbackSerializer
    permission_classes = [AllowAny]
