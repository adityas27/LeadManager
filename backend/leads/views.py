from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Lead
from .serializers import CreateEmployeeSerializer, LeadSerializer, UserSerializer

User = get_user_model()


def _is_manager(user):
    """Check if user has manager role."""
    return user and user.role == User.Role.MANAGER


def _get_lead(pk, user):
    """Get lead if exists and user has access."""
    try:
        lead = Lead.objects.get(pk=pk)
        # Managers can access all leads, employees only their own
        if _is_manager(user) or lead.created_by_id == user.id:
            return lead, None
        return None, Response(
            {"detail": "You do not have permission to access this lead."},
            status=status.HTTP_403_FORBIDDEN,
        )
    except Lead.DoesNotExist:
        return None, Response(
            {"detail": "Lead not found."},
            status=status.HTTP_404_NOT_FOUND,
        )


def _filtered_leads(request):
    """Get filtered queryset based on user role and query params."""
    user = request.user
    
    # Managers see all leads, employees see only their own
    if _is_manager(user):
        queryset = Lead.objects.all().select_related("created_by")
    else:
        queryset = Lead.objects.filter(created_by=user).select_related("created_by")
    
    queryset = queryset.order_by("-created_at", "-id")

    search = request.query_params.get("search", "")
    if isinstance(search, str):
        search = search.strip()
    if search:
        queryset = queryset.filter(name__icontains=search)

    status_param = request.query_params.get("status", "")
    if isinstance(status_param, str):
        status_param = status_param.strip()
    if status_param:
        normalized = status_param.upper()
        if normalized not in Lead.Status.values:
            return None, Response(
                {
                    "status": [
                        "Select a valid status. Valid values are NEW, CONTACTED, QUALIFIED, and LOST."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        queryset = queryset.filter(status=normalized)

    return queryset, None


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Get current authenticated user profile."""
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_employee(request):
    """Manager-only endpoint to create employee accounts."""
    if not _is_manager(request.user):
        return Response(
            {"detail": "Only managers can create employee accounts."},
            status=status.HTTP_403_FORBIDDEN,
        )
    
    serializer = CreateEmployeeSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_employees(request):
    """Manager-only endpoint to list all employees."""
    if not _is_manager(request.user):
        return Response(
            {"detail": "Only managers can view employee lists."},
            status=status.HTTP_403_FORBIDDEN,
        )
    
    employees = User.objects.filter(role=User.Role.EMPLOYEE).order_by("username")
    serializer = UserSerializer(employees, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def lead_list(request):
    if request.method == "GET":
        queryset, error = _filtered_leads(request)
        if error is not None:
            return error
        serializer = LeadSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    serializer = LeadSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def lead_detail(request, pk):
    lead, error = _get_lead(pk, request.user)
    if error is not None:
        return error

    if request.method == "GET":
        return Response(LeadSerializer(lead).data, status=status.HTTP_200_OK)

    if request.method == "DELETE":
        lead.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    partial = request.method == "PATCH"
    serializer = LeadSerializer(lead, data=request.data, partial=partial)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics based on user role."""
    user = request.user
    
    # Managers see all leads, employees see only their own
    if _is_manager(user):
        queryset = Lead.objects.all()
    else:
        queryset = Lead.objects.filter(created_by=user)
    
    by_status = {choice: 0 for choice in Lead.Status.values}
    rows = queryset.values("status").annotate(total=Count("id"))
    for row in rows:
        if row["status"] in by_status:
            by_status[row["status"]] = row["total"]

    return Response(
        {"total": queryset.count(), "by_status": by_status},
        status=status.HTTP_200_OK,
    )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_employee(request, pk):
    """Manager-only endpoint to delete employee accounts."""
    if not _is_manager(request.user):
        return Response(
            {"detail": "Only managers can delete employee accounts."},
            status=status.HTTP_403_FORBIDDEN,
        )
    
    try:
        user = User.objects.get(pk=pk, role=User.Role.EMPLOYEE)
    except User.DoesNotExist:
        return Response(
            {"detail": "Employee not found."},
            status=status.HTTP_404_NOT_FOUND,
        )
    
    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
