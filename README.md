# Lead Manager CRM

A complete, functional Lead Management CRM with JWT authentication, role-based access control, and modern Material-inspired UI.

## Features

### Authentication & Security
- **JWT-based authentication** with access tokens (1 hour) and refresh tokens (7 days)
- **Role-based access**: Manager and Employee roles with granular permissions
- **Automatic token refresh**: Seamless session management
- **Protected routes**: Login page inaccessible when authenticated
- **Session persistence**: Auto-login on page refresh

### Lead Management
- **CRUD operations**: Create, read, update, delete leads
- **Search & filter**: Search by name, filter by status
- **Role isolation**: Managers see all leads; employees see only their own
- **Validation**: Full input validation with clear error messages

### Dashboard & Analytics
- **Real-time statistics**: Total, New, Contacted, Qualified, Lost counts
- **Visual stat cards**: One-click filtering by clicking status cards
- **Responsive design**: Works on desktop, tablet, and mobile

### Employee Management (Manager only)
- **Create employees**: Set up new employee accounts with username, email, password
- **View employees**: List all employee accounts
- **Delete employees**: Remove employees when needed

## Features

- **Authentication & Roles**
  - JWT-based authentication with access and refresh tokens
  - Two roles: Manager and Employee
  - Managers can create and manage employee accounts
  - Employees can only view and edit their own leads

- **Lead Management**
  - Create, read, update, and delete leads
  - Search leads by name
  - Filter by status (New, Contacted, Qualified, Lost)
  - Full audit trail (created_by, timestamps)

- **Dashboard**
  - Real-time statistics by status
  - Role-based data isolation (managers see all, employees see only their leads)

- **Employee Management** (Manager only)
  - Create new employee accounts
  - View list of all employees
  - Delete employee accounts

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Axios, React Router, Lucide React
- **Backend**: Python, Django, Django REST Framework, PostgreSQL, SimpleJWT

## Setup & Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- pip (Python package manager)

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create and activate virtual environment**
```bash
# Create virtual environment
python -m venv venv

# Activate on Windows
venv\Scripts\activate

# Activate on macOS/Linux
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Create environment file**
```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

5. **Configure environment variables in .env**
```env
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=lead_manager
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

6. **Create PostgreSQL database**
```sql
-- In PostgreSQL shell (psql)
CREATE DATABASE lead_manager;
```

7. **Run migrations**
```bash
python manage.py migrate
```

8. **Create superuser (manager account)**
```bash
python manage.py createsuperuser
```
Follow the prompts to create a manager account with:
- Username
- Email
- Password

9. **Start the development server**
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

4. **Verify environment variables in .env**
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

5. **Start the development server**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173/`

## First Time Setup

After running both servers:

1. Open your browser and go to `http://localhost:5173/`
2. You'll be redirected to the login page
3. Log in with the superuser credentials you created (this is your manager account)
4. As a manager, you can:
   - View and manage all leads
   - Create employee accounts
   - Access the Employees page from the sidebar

5. To create an employee:
   - Click "Employees" in the sidebar
   - Click "Add employee"
   - Fill in the form (username, email, password)
   - The new employee can then log in with their credentials

## API Overview

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Authenticate user and get tokens |
| POST | `/api/auth/refresh/` | Refresh access token |
| GET | `/api/auth/me/` | Get current user profile |

### Employee Management (Manager only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees/` | List all employees |
| POST | `/api/employees/create/` | Create new employee account |
| DELETE | `/api/employees/{id}/` | Delete employee account |

### Lead Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads/` | List all leads (with search & status filters) |
| POST | `/api/leads/` | Create a new lead |
| GET | `/api/leads/{id}/` | Get lead details |
| PUT | `/api/leads/{id}/` | Update entire lead |
| PATCH | `/api/leads/{id}/` | Partially update lead |
| DELETE | `/api/leads/{id}/` | Delete lead |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats/` | Get statistics by status |

## Request/Response Examples

### Login
```json
// Request
POST /api/auth/login/
{
  "username": "manager1",
  "password": "password123"
}

// Response
{
  "access": "eyJ0eXAiOiJKV1QiLC...",
  "refresh": "eyJ0eXAiOiJKV1QiLC..."
}
```

### Create Employee (Manager only)
```json
// Request
POST /api/employees/create/
Authorization: Bearer <access_token>
{
  "username": "employee1",
  "email": "employee@test.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}

// Response
{
  "id": 2,
  "username": "employee1",
  "email": "employee@test.com",
  "role": "EMPLOYEE",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Create Lead
```json
// Request
POST /api/leads/
Authorization: Bearer <access_token>
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "phone": "+1 555 0100",
  "company": "Analytical Engines",
  "source": "REFERRAL"
}

// Response
{
  "id": 1,
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "phone": "+1 555 0100",
  "company": "Analytical Engines",
  "source": "REFERRAL",
  "status": "NEW",
  "created_by": 1,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Get Dashboard Stats
```json
// Response
{
  "total": 10,
  "by_status": {
    "NEW": 4,
    "CONTACTED": 3,
    "QUALIFIED": 2,
    "LOST": 1
  }
}
```

## Testing

### Run Backend Tests

```bash
cd backend
python manage.py test
```

Tests cover:
- Authentication and invalid credentials
- Manager and employee permissions
- Employee data isolation
- Lead CRUD operations
- Validation errors
- Search and status filtering
- Dashboard statistics
- Unauthorized and forbidden requests
- Nonexistent lead IDs

## Project Structure

```
lead-manager/
├── backend/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── leads/
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── dashboard/
│       │   ├── layout/
│       │   ├── leads/
│       │   └── ui/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
├── README.md
└── IMPLEMENTATION_PLAN.md
```

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=lead_manager
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## License

MIT License