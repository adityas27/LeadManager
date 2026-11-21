from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user with role-based access."""

    class Role(models.TextChoices):
        MANAGER = "MANAGER", "Manager"
        EMPLOYEE = "EMPLOYEE", "Employee"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.EMPLOYEE,
    )

    class Meta:
        ordering = ["id"]
        verbose_name = "user"
        verbose_name_plural = "users"

    def __str__(self):
        return self.username


class Lead(models.Model):
    """A sales inquiry tracked by the single-user CRM."""

    class Source(models.TextChoices):
        WEBSITE = "WEBSITE", "Website"
        REFERRAL = "REFERRAL", "Referral"
        SOCIAL_MEDIA = "SOCIAL_MEDIA", "Social Media"
        COLD_CALL = "COLD_CALL", "Cold Call"
        OTHER = "OTHER", "Other"

    class Status(models.TextChoices):
        NEW = "NEW", "New"
        CONTACTED = "CONTACTED", "Contacted"
        QUALIFIED = "QUALIFIED", "Qualified"
        LOST = "LOST", "Lost"

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    company = models.CharField(max_length=150)
    source = models.CharField(max_length=20, choices=Source.choices)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="leads",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at", "-id"]
        verbose_name = "lead"
        verbose_name_plural = "leads"
        indexes = [
            models.Index(fields=["status"], name="lead_status_idx"),
            models.Index(fields=["name"], name="lead_name_idx"),
            models.Index(fields=["created_by"], name="lead_created_by_idx"),
            models.Index(fields=["-created_at"], name="lead_created_desc_idx"),
            models.Index(
                fields=["status", "-created_at"],
                name="lead_status_created_idx",
            ),
            models.Index(
                fields=["created_by", "-created_at"],
                name="lead_user_created_idx",
            ),
        ]

    def __str__(self):
        return self.name
