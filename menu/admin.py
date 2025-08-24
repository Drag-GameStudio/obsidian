from django.contrib import admin
from .models import Client, Session

# Register your models here.
@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('login',)
    search_fields = ('login',)

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'client', 'created_at')
    search_fields = ('session_id', 'client__login')
    list_filter = ('created_at',)