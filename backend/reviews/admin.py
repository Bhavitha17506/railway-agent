from django.contrib import admin
from .models import EngineerReview, Feedback

@admin.register(EngineerReview)
class EngineerReviewAdmin(admin.ModelAdmin):
    list_display = ('inspection', 'engineer', 'decision', 'work_order_required', 'reviewed_at')
    list_filter = ('decision', 'work_order_required')
    search_fields = ('inspection__inspection_code', 'engineering_comment')

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('review', 'rating_score', 'feedback_category', 'created_at')
