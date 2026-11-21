"""Test settings that override the default for API tests."""

from .settings import *  # noqa

# Override REST framework settings for tests
REST_FRAMEWORK["DEFAULT_AUTHENTICATION_CLASSES"] = []
REST_FRAMEWORK["DEFAULT_PERMISSION_CLASSES"] = [
    "rest_framework.permissions.AllowAny",
]