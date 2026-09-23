from rest_framework import viewsets, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Report
from .serializers import ReportSerializer
from .generator import generate_inspection_report
from inspections.models import Inspection

class ReportViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Report.objects.all().select_related('inspection', 'inspection__track_section', 'generated_by').order_by('-created_at')
    serializer_class = ReportSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['report_code', 'title', 'inspection__inspection_code', 'inspection__track_section__section_code']
    ordering_fields = ['created_at']

class GenerateReportView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        inspection_id = request.data.get('inspection_id')
        if not inspection_id:
            inspection = Inspection.objects.first()
        else:
            inspection = get_object_or_404(Inspection, id=inspection_id)

        user = request.user if request.user.is_authenticated else None
        report = generate_inspection_report(inspection, user)

        return Response({
            "report": ReportSerializer(report).data,
            "message": f"Certified inspection report {report.report_code} generated successfully."
        }, status=status.HTTP_201_CREATED)
