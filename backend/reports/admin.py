from django.contrib import admin
from .models import Report

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('report_code', 'title', 'inspection', 'generated_by', 'is_signed_off', 'created_at')
    search_fields = ('report_code', 'title', 'inspection__inspection_code')
