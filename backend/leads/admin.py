from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Lead

User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["username", "email", "role", "first_name", "last_name", "is_staff"]
    list_filter = ["role", "is_staff", "is_superuser", "is_active"]
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Role", {"fields": ("role",)}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Role", {"fields": ("role",)}),
    )


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "company", "status", "source", "created_by", "created_at"]
    list_filter = ["status", "source", "created_at", "created_by"]
    search_fields = ["name", "email", "company", "created_by__username"]
    readonly_fields = ["created_at", "updated_at"]
    date_hierarchy = "created_at"
    ordering = ["-created_at", "-id"]
    
    fieldsets = [
        ("Contact Information", {
            "fields": ("name", "email", "phone", "company")
        }),
        ("Lead Details", {
            "fields": ("source", "status", "created_by")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    ]
