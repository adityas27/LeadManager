#!/usr/bin/env python
"""
Script to populate the database with sample leads for testing.

Usage:
    cd backend
    python scripts/populate_leads.py
"""

import os
import django

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model
from leads.models import Lead

User = get_user_model()

# Sample lead data
SAMPLE_LEADS = [
    # Manager leads (created_by: manager)
    {"name": "Michael Johnson", "email": "michael.j@techcorp.com", "phone": "+1 (555) 123-4567", "company": "Tech Corp", "source": "WEBSITE", "status": "NEW"},
    {"name": "Sarah Williams", "email": "sarah.w@innovate.com", "phone": "+1 (555) 234-5678", "company": "Innovate Inc", "source": "REFERRAL", "status": "CONTACTED"},
    {"name": "Robert Davis", "email": "robert.d@dataworks.net", "phone": "+1 (555) 345-6789", "company": "DataWorks", "source": "SOCIAL_MEDIA", "status": "QUALIFIED"},
    {"name": "Jennifer Martinez", "email": "jennifer.m@cloudservices.com", "phone": "+1 (555) 456-7890", "company": "Cloud Services", "source": "COLD_CALL", "status": "LOST"},
    {"name": "David Wilson", "email": "david.w@solutiongroup.com", "phone": "+1 (555) 567-8901", "company": "Solution Group", "source": "WEBSITE", "status": "NEW"},
    
    # Employee 1 leads (created_by: employee1)
    {"name": "Emily Brown", "email": "emily.b@marketingpro.com", "phone": "+1 (555) 678-9012", "company": "Marketing Pro", "source": "REFERRAL", "status": "CONTACTED"},
    {"name": "Christopher Lee", "email": "christopher.l@creativeagency.com", "phone": "+1 (555) 789-0123", "company": "Creative Agency", "source": "WEBSITE", "status": "QUALIFIED"},
    {"name": "Amanda Taylor", "email": "amanda.t@digitalstudio.com", "phone": "+1 (555) 890-1234", "company": "Digital Studio", "source": "SOCIAL_MEDIA", "status": "NEW"},
    {"name": "Daniel Anderson", "email": "daniel.a@webdesignpro.com", "phone": "+1 (555) 901-2345", "company": "Web Design Pro", "source": "COLD_CALL", "status": "LOST"},
    {"name": "Jessica Thomas", "email": "jessica.t@growthconsulting.com", "phone": "+1 (555) 012-3456", "company": "Growth Consulting", "source": "WEBSITE", "status": "NEW"},
    
    # Employee 2 leads (created_by: employee2)
    {"name": "Matthew Jackson", "email": "matthew.j@marketingpro.com", "phone": "+1 (555) 111-2222", "company": "Marketing Pro", "source": "REFERRAL", "status": "CONTACTED"},
    {"name": "Ashley White", "email": "ashley.w@creativeagency.com", "phone": "+1 (555) 222-3333", "company": "Creative Agency", "source": "WEBSITE", "status": "QUALIFIED"},
    {"name": "Joshua Harris", "email": "joshua.h@digitalstudio.com", "phone": "+1 (555) 333-4444", "company": "Digital Studio", "source": "SOCIAL_MEDIA", "status": "NEW"},
    {"name": "Stephanie Martin", "email": "stephanie.m@webdesignpro.com", "phone": "+1 (555) 444-5555", "company": "Web Design Pro", "source": "COLD_CALL", "status": "LOST"},
    {"name": "Andrew Garcia", "email": "andrew.g@growthconsulting.com", "phone": "+1 (555) 555-6666", "company": "Growth Consulting", "source": "WEBSITE", "status": "NEW"},
    
    # Mixed leads
    {"name": "Nicole Rodriguez", "email": "nicole.r@techcorp.com", "phone": "+1 (555) 777-8888", "company": "Tech Corp", "source": "WEBSITE", "status": "NEW"},
    {"name": "Kevin Thompson", "email": "kevin.t@innovate.com", "phone": "+1 (555) 888-9999", "company": "Innovate Inc", "source": "REFERRAL", "status": "CONTACTED"},
    {"name": "Laura Martinez", "email": "laura.m@dataworks.net", "phone": "+1 (555) 999-0000", "company": "DataWorks", "source": "SOCIAL_MEDIA", "status": "QUALIFIED"},
    {"name": "Brian Anderson", "email": "brian.a@cloudservices.com", "phone": "+1 (555) 000-1111", "company": "Cloud Services", "source": "COLD_CALL", "status": "LOST"},
    {"name": "Michelle Robinson", "email": "michelle.r@solutionsinc.com", "phone": "+1 (555) 123-1234", "company": "Solutions Inc", "source": "WEBSITE", "status": "NEW"},
    {"name": "Jason Clark", "email": "jason.c@marketingsolutions.com", "phone": "+1 (555) 234-2345", "company": "Marketing Solutions", "source": "REFERRAL", "status": "CONTACTED"},
    {"name": "Rachel Lewis", "email": "rachel.l@innovationlab.com", "phone": "+1 (555) 345-3456", "company": "Innovation Lab", "source": "SOCIAL_MEDIA", "status": "QUALIFIED"},
    {"name": "Adam Robinson", "email": "adam.r@techventures.com", "phone": "+1 (555) 456-4567", "company": "Tech Ventures", "source": "COLD_CALL", "status": "LOST"},
    {"name": "Samantha Walker", "email": "samantha.w@growthpartners.com", "phone": "+1 (555) 567-5678", "company": "Growth Partners", "source": "WEBSITE", "status": "NEW"},
    {"name": "Ryan Hall", "email": "ryan.h@marketinggroup.com", "phone": "+1 (555) 678-6789", "company": "Marketing Group", "source": "REFERRAL", "status": "CONTACTED"},
    {"name": "Kayla Young", "email": "kayla.y@creativepro.com", "phone": "+1 (555) 789-7890", "company": "Creative Pro", "source": "SOCIAL_MEDIA", "status": "QUALIFIED"},
]

def create_manager():
    """Create or get the manager user."""
    try:
        manager = User.objects.get(username="manager")
        print("Manager user already exists")
    except User.DoesNotExist:
        manager = User.objects.create_user(
            username="manager",
            email="manager@leadmanager.com",
            password="manager123",
            role=User.Role.MANAGER,
            first_name="Manager",
            last_name="User",
        )
        print("Manager user created")
    return manager


def create_employee(username, email, first_name, last_name):
    """Create or get an employee user."""
    try:
        employee = User.objects.get(username=username)
        print(f"Employee {username} already exists")
    except User.DoesNotExist:
        employee = User.objects.create_user(
            username=username,
            email=email,
            password="employee123",
            role=User.Role.EMPLOYEE,
            first_name=first_name,
            last_name=last_name,
        )
        print(f"Employee {username} created")
    return employee


def populate_leads():
    """Populate the database with sample leads."""
    print("=" * 50)
    print("POPULATING DATABASE WITH SAMPLE LEADS")
    print("=" * 50)

    # Create users
    manager = create_manager()
    employee1 = create_employee("employee1", "employee1@leadmanager.com", "John", "Doe")
    employee2 = create_employee("employee2", "employee2@leadmanager.com", "Jane", "Smith")

    print("\n" + "=" * 50)
    print("Creating leads...")
    print("=" * 50)

    created_count = 0

    for i, lead_data in enumerate(SAMPLE_LEADS, 1):
        # Distribute leads among manager, employee1, and employee2
        if i % 3 == 0:
            created_by = manager
        elif i % 3 == 1:
            created_by = employee1
        else:
            created_by = employee2

        lead = Lead.objects.create(
            name=lead_data["name"],
            email=lead_data["email"],
            phone=lead_data["phone"],
            company=lead_data["company"],
            source=lead_data["source"],
            status=lead_data["status"],
            created_by=created_by,
        )
        created_count += 1
        print(f"  [{i:2d}] Created: {lead.name} ({lead.company})")

    print("\n" + "=" * 50)
    print(f"SUCCESS! Created {created_count} leads")
    print("=" * 50)

    # Print summary
    print("\nLead Summary by Status:")
    for status_value, status_label in Lead.Status.choices:
        count = Lead.objects.filter(status=status_value).count()
        print(f"  {status_label}: {count}")

    print("\nLead Summary by Source:")
    for source_value, source_label in Lead.Source.choices:
        count = Lead.objects.filter(source=source_value).count()
        print(f"  {source_label}: {count}")

    print("\nLead Summary by Created By:")
    for user in User.objects.all():
        count = Lead.objects.filter(created_by=user).count()
        print(f"  {user.username}: {count} leads")

    print("\n" + "=" * 50)
    print("CREDENTIALS FOR TESTING:")
    print("=" * 50)
    print("Manager:")
    print("  Username: manager")
    print("  Password: manager123")
    print()
    print("Employees:")
    print("  Username: employee1 | Password: employee123")
    print("  Username: employee2 | Password: employee123")
    print()


if __name__ == "__main__":
    populate_leads()
