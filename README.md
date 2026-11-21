# Lead Manager

Lead Manager is a role-based CRM demo for creating, filtering, updating, and deleting sales leads, plus managing employee accounts.

## Features

- JWT login and refresh-token handling
- Manager and employee roles
- Manager dashboard for all leads
- Employee dashboard limited to leads they created
- Lead CRUD operations
- Name search and status filtering
- Lead pagination, with 10 records per page
- Lead status totals and live dashboard counts
- Employee account creation and deletion
- Responsive desktop and mobile interface

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React

### Backend

- Python
- Django 5.1
- Django REST Framework
- SimpleJWT
- PostgreSQL
- `dj-database-url`

## Project Structure

```text
LeadManager/
├── backend/
│   ├── config/
│   ├── leads/
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
└── README.md
```

## Prerequisites

- Python 3.10 or newer
- Node.js 18 or newer
- PostgreSQL 14 or newer
- npm

## Run Locally

### 1. Configure PostgreSQL

Create a database named `lead_manager`, or use another name in the backend environment file.

```sql
CREATE DATABASE lead_manager;
```

### 2. Configure the backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Update `backend/.env` with your local database values:

```env
SECRET_KEY=replace-with-a-long-random-value
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,testserver

DB_NAME=lead_manager
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

To use Supabase or another hosted PostgreSQL service instead, set `DATABASE_URL` in `backend/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/postgres
```

The `DATABASE_URL` value should include SSL parameters when required by the provider.

Apply migrations:

```powershell
python manage.py migrate
```

Create a manager account:

```powershell
python manage.py createsuperuser
```

The created account must use the `MANAGER` role. Set the role through the Django admin or shell if the new superuser does not receive that role automatically.

Start the API:

```powershell
python manage.py runserver
```

The backend is available at `http://localhost:8000/api/`.

### 3. Configure and start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend environment file should contain:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Open `http://localhost:5173`.

## Running Tests

Run the Django test suite from the backend directory:

```powershell
cd backend
python manage.py test
```

Build the frontend for production:

```powershell
cd frontend
npm run build
```

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login/` | Obtain JWT access and refresh tokens |
| POST | `/api/auth/refresh/` | Refresh an access token |
| GET | `/api/auth/me/` | Get the authenticated user |
| GET | `/api/leads/?page=1&search=&status=` | List paginated leads |
| POST | `/api/leads/` | Create a lead |
| GET | `/api/leads/{id}/` | Retrieve a lead |
| PUT/PATCH | `/api/leads/{id}/` | Replace or update a lead |
| DELETE | `/api/leads/{id}/` | Delete a lead |
| GET | `/api/dashboard/stats/` | Get status totals |
| GET | `/api/employees/` | List employee accounts; manager only |
| POST | `/api/employees/create/` | Create an employee; manager only |
| DELETE | `/api/employees/{id}/` | Delete an employee; manager only |

## Assumptions

- A manager owns the CRM-wide view and employee account management.
- An employee can view and modify only leads assigned to or created by that employee.
- Leads use the fixed statuses `NEW`, `CONTACTED`, `QUALIFIED`, and `LOST`.
- Lead names are searchable; the demo does not provide advanced search across every field.
- Each leads page contains 10 records.
- Authentication is handled with JWT access and refresh tokens.
- PostgreSQL is the expected database for both local and hosted deployments.
- This repository is a demo and not a complete production CRM.

## Improvements for More Time

- Add lead assignment and reassignment between employees
- Add lead notes, activities, reminders, and an explicit change history
- Add sorting and advanced filtering for source, company, date, and owner
- Add employee editing and account activation/deactivation
- Add CSV import/export
- Add frontend and backend pagination controls for employees if the account list grows
- Add broader automated API and component tests
- Add CI/CD checks for migrations, tests, linting, and frontend builds
- Improve loading, offline, and retry behavior
- Add deployment documentation for Render and hosted PostgreSQL
