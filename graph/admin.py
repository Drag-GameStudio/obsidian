from django.contrib import admin
from .models import Comment

# Register your models here.
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('comment_id', 'client', 'parent_id', 'created_at')
    search_fields = ('comment_id', 'parent_id', 'client')
    list_filter = ('created_at', 'parent_id', 'client')
    ordering = ('-created_at',)

  