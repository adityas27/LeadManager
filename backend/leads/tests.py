from datetime import timedelta

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Lead

User = get_user_model()


class LeadAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            role=User.Role.EMPLOYEE,
        )
        self.client.force_authenticate(user=self.user)
        self.list_url = reverse("lead-list")
        self.stats_url = reverse("dashboard-stats")
        self.payload = {
            "name": "Ada Lovelace",
            "email": "ada@example.com",
            "phone": "+1 555 0100",
            "company": "Analytical Engines",
            "source": "REFERRAL",
            "status": "NEW",
        }

    def detail_url(self, pk):
        return reverse("lead-detail", args=[pk])

    def create_lead(self, **overrides):
        data = {**self.payload, **overrides}
        data["created_by"] = self.user
        return Lead.objects.create(**data)

    def test_create_lead(self):
        response = self.client.post(self.list_url, self.payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Lead.objects.count(), 1)
        self.assertEqual(response.data["name"], "Ada Lovelace")
        self.assertEqual(response.data["email"], "ada@example.com")
        self.assertEqual(response.data["status"], "NEW")
        self.assertIn("id", response.data)
        self.assertIn("created_at", response.data)
        self.assertIn("updated_at", response.data)

    def test_email_does_not_need_to_be_unique(self):
        self.create_lead(name="Ada Lovelace", email="ada@example.com")
        response = self.client.post(self.list_url, self.payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Lead.objects.filter(email="ada@example.com").count(), 2)

    def test_create_defaults_status_to_new(self):
        payload = {key: value for key, value in self.payload.items() if key != "status"}

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "NEW")

    def test_create_trims_surrounding_whitespace(self):
        payload = {
            **self.payload,
            "name": "  Ada Lovelace  ",
            "email": "  ada@example.com  ",
            "phone": "  +1 555 0100  ",
            "company": "  Analytical Engines  ",
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Ada Lovelace")
        self.assertEqual(response.data["email"], "ada@example.com")
        self.assertEqual(response.data["phone"], "+1 555 0100")
        self.assertEqual(response.data["company"], "Analytical Engines")

    def test_list_leads_newest_first(self):
        older = self.create_lead(name="Grace Hopper", email="grace@example.com")
        newer = self.create_lead(name="Ada Lovelace", email="ada.second@example.com")
        older.created_at = timezone.now() - timedelta(days=2)
        older.save(update_fields=["created_at"])

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [lead["id"] for lead in response.data],
            [newer.id, older.id],
        )

    def test_retrieve_lead(self):
        lead = self.create_lead()

        response = self.client.get(self.detail_url(lead.id))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], lead.id)
        self.assertEqual(response.data["company"], "Analytical Engines")

    def test_put_replaces_lead(self):
        lead = self.create_lead()
        payload = {
            **self.payload,
            "name": "Ada King",
            "status": "QUALIFIED",
            "source": "WEBSITE",
        }

        response = self.client.put(self.detail_url(lead.id), payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        lead.refresh_from_db()
        self.assertEqual(lead.name, "Ada King")
        self.assertEqual(lead.status, "QUALIFIED")
        self.assertEqual(lead.source, "WEBSITE")

    def test_put_requires_all_fields(self):
        lead = self.create_lead()

        response = self.client.put(
            self.detail_url(lead.id),
            {"name": "Ada King"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
        self.assertIn("status", response.data)
        lead.refresh_from_db()
        self.assertEqual(lead.name, "Ada Lovelace")

    def test_patch_updates_status_only(self):
        lead = self.create_lead()

        response = self.client.patch(
            self.detail_url(lead.id),
            {"status": "CONTACTED"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        lead.refresh_from_db()
        self.assertEqual(lead.status, "CONTACTED")
        self.assertEqual(lead.name, "Ada Lovelace")
        self.assertEqual(lead.email, "ada@example.com")

    def test_delete_lead(self):
        lead = self.create_lead()

        response = self.client.delete(self.detail_url(lead.id))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Lead.objects.filter(pk=lead.id).exists())

    def test_invalid_email(self):
        response = self.client.post(
            self.list_url,
            {**self.payload, "email": "not-an-email"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
        self.assertEqual(Lead.objects.count(), 0)

    def test_missing_required_fields(self):
        response = self.client.post(self.list_url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        for field in ("name", "email", "phone", "company", "source"):
            self.assertIn(field, response.data)
        self.assertEqual(Lead.objects.count(), 0)

    def test_blank_name_is_rejected(self):
        response = self.client.post(
            self.list_url,
            {**self.payload, "name": "   "},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)
        self.assertEqual(Lead.objects.count(), 0)

    def test_invalid_phone(self):
        response = self.client.post(
            self.list_url,
            {**self.payload, "phone": "call-me"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("phone", response.data)
        self.assertEqual(Lead.objects.count(), 0)

    def test_invalid_source_choice(self):
        response = self.client.post(
            self.list_url,
            {**self.payload, "source": "BILLBOARD"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("source", response.data)
        self.assertEqual(Lead.objects.count(), 0)

    def test_invalid_status_choice(self):
        response = self.client.post(
            self.list_url,
            {**self.payload, "status": "WON"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("status", response.data)
        self.assertEqual(Lead.objects.count(), 0)

    def test_search_by_name_is_case_insensitive(self):
        self.create_lead(name="Ada Lovelace", email="ada@example.com")
        self.create_lead(name="Grace Hopper", email="grace@example.com", company="Ada Labs")

        response = self.client.get(self.list_url, {"search": "aDa"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Ada Lovelace")

    def test_filter_by_status(self):
        self.create_lead(name="Ada Lovelace", email="ada@example.com", status="NEW")
        self.create_lead(
            name="Grace Hopper",
            email="grace@example.com",
            status="CONTACTED",
        )

        response = self.client.get(self.list_url, {"status": "contacted"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Grace Hopper")

    def test_invalid_status_filter(self):
        self.create_lead()

        response = self.client.get(self.list_url, {"status": "WON"})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("status", response.data)

    def test_combined_search_and_status_filter(self):
        self.create_lead(name="Ada Lovelace", email="ada.new@example.com", status="NEW")
        self.create_lead(
            name="Ada King",
            email="ada.contacted@example.com",
            status="CONTACTED",
        )
        self.create_lead(name="Grace Hopper", email="grace@example.com", status="NEW")

        response = self.client.get(self.list_url, {"search": "ada", "status": "NEW"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([lead["name"] for lead in response.data], ["Ada Lovelace"])

    def test_dashboard_stats(self):
        self.create_lead(name="A", email="a@example.com", status="NEW")
        self.create_lead(name="B", email="b@example.com", status="NEW")
        self.create_lead(name="C", email="c@example.com", status="CONTACTED")
        self.create_lead(name="D", email="d@example.com", status="QUALIFIED")
        self.create_lead(name="E", email="e@example.com", status="LOST")
        self.create_lead(name="F", email="f@example.com", status="LOST")

        response = self.client.get(self.stats_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total"], 6)
        self.assertEqual(
            response.data["by_status"],
            {"NEW": 2, "CONTACTED": 1, "QUALIFIED": 1, "LOST": 2},
        )

    def test_dashboard_stats_when_empty(self):
        response = self.client.get(self.stats_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total"], 0)
        self.assertEqual(
            response.data["by_status"],
            {"NEW": 0, "CONTACTED": 0, "QUALIFIED": 0, "LOST": 0},
        )

    def test_nonexistent_lead(self):
        missing = self.detail_url(999999)

        for method in ("get", "put", "patch", "delete"):
            request = getattr(self.client, method)
            kwargs = {"format": "json"} if method in {"put", "patch"} else {}
            payload = self.payload if method in {"put", "patch"} else None
            if payload is None:
                response = request(missing, **kwargs)
            else:
                response = request(missing, payload, **kwargs)

            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
            self.assertEqual(response.data["detail"], "Lead not found.")

    def test_delete_then_retrieve_is_not_found(self):
        lead = self.create_lead()
        self.client.delete(self.detail_url(lead.id))

        response = self.client.get(self.detail_url(lead.id))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["detail"], "Lead not found.")