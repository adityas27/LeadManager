from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

urlpatterns = [
    # Authentication
    path("auth/login/", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/me/", views.current_user, name="current-user"),
    
    # Employee management (manager only)
    path("employees/", views.list_employees, name="list-employees"),
    path("employees/create/", views.create_employee, name="create-employee"),
    path("employees/<int:pk>/", views.delete_employee, name="delete-employee"),
    
    # Leads
    path("leads/", views.lead_list, name="lead-list"),
    path("leads/<int:pk>/", views.lead_detail, name="lead-detail"),
    
    # Dashboard
    path("dashboard/stats/", views.dashboard_stats, name="dashboard-stats"),
]
