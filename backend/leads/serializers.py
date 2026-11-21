import re

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Lead

User = get_user_model()

PHONE_PATTERN = re.compile(r"^[0-9+().\-\s]+$")
STRING_FIELDS = ("name", "email", "phone", "company", "source", "status")


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user registration and profile."""

    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "first_name", "last_name"]
        read_only_fields = ["id"]


class CreateEmployeeSerializer(serializers.Serializer):
    """Serializer for manager to create employee accounts."""

    username = serializers.CharField(
        max_length=150,
        error_messages={
            "required": "Username is required.",
            "blank": "Username is required.",
            "max_length": "Username must be 150 characters or fewer.",
        },
    )
    email = serializers.EmailField(
        error_messages={
            "required": "Email is required.",
            "blank": "Email is required.",
            "invalid": "Enter a valid email address.",
        },
    )
    password = serializers.CharField(
        min_length=8,
        write_only=True,
        error_messages={
            "required": "Password is required.",
            "blank": "Password is required.",
            "min_length": "Password must be at least 8 characters.",
        },
    )
    first_name = serializers.CharField(
        max_length=150,
        required=False,
        allow_blank=True,
    )
    last_name = serializers.CharField(
        max_length=150,
        required=False,
        allow_blank=True,
    )

    def validate_username(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Username is required.")
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_email(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Email is required.")
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            role=User.Role.EMPLOYEE,
        )
        return user


class LeadSerializer(serializers.ModelSerializer):
    source = serializers.ChoiceField(
        choices=Lead.Source.choices,
        error_messages={
            "required": "Source is required.",
            "invalid_choice": "Select a valid source.",
            "null": "Source is required.",
            "blank": "Source is required.",
        },
    )
    status = serializers.ChoiceField(
        choices=Lead.Status.choices,
        required=False,
        error_messages={
            "required": "Status is required.",
            "invalid_choice": "Select a valid status.",
            "null": "Status is required.",
            "blank": "Status is required.",
        },
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # POST may omit status and receive the model default. PUT must send it.
        if self.instance is not None and not self.partial:
            self.fields["status"].required = True

    class Meta:
        model = Lead
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "company",
            "source",
            "status",
            "created_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]
        extra_kwargs = {
            "name": {
                "error_messages": {
                    "required": "Name is required.",
                    "blank": "Name is required.",
                    "null": "Name is required.",
                    "max_length": "Name must be 150 characters or fewer.",
                }
            },
            "email": {
                "error_messages": {
                    "required": "Email is required.",
                    "blank": "Email is required.",
                    "null": "Email is required.",
                    "invalid": "Enter a valid email address.",
                    "max_length": "Email must be 254 characters or fewer.",
                }
            },
            "phone": {
                "error_messages": {
                    "required": "Phone is required.",
                    "blank": "Phone is required.",
                    "null": "Phone is required.",
                    "max_length": "Phone must be 20 characters or fewer.",
                }
            },
            "company": {
                "error_messages": {
                    "required": "Company is required.",
                    "blank": "Company is required.",
                    "null": "Company is required.",
                    "max_length": "Company must be 150 characters or fewer.",
                }
            },
        }

    def to_internal_value(self, data):
        if isinstance(data, dict):
            data = data.copy()
            for field in STRING_FIELDS:
                value = data.get(field)
                if isinstance(value, str):
                    data[field] = value.strip()
        return super().to_internal_value(data)

    def validate_phone(self, value):
        if not PHONE_PATTERN.fullmatch(value):
            raise serializers.ValidationError(
                "Phone can only include digits and + ( ) . - spaces."
            )
        if not re.search(r"\d", value):
            raise serializers.ValidationError("Phone must include at least one digit.")
        return value

    def validate(self, attrs):
        creating = self.instance is None
        if creating and "status" not in attrs:
            attrs["status"] = Lead.Status.NEW
        if not creating and not self.partial and "status" not in attrs:
            raise serializers.ValidationError({"status": ["Status is required."]})
        return attrs
