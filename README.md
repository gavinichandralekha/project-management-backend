# Project Management System - Backend

A Full Stack **Project Management System** built using the **MERN Stack**.

This repository contains the **backend** implementation of the Project Management System.

The frontend is maintained in a separate repository.

---

# Repositories

## Frontend Repository

https://github.com/gavinichandralekha/project-management-frontend

## Backend Repository

https://github.com/gavinichandralekha/project-management-backend

---

# Project Overview

The Project Management System enables organizations to manage:

- Clients
- Company Administrators
- Project Managers
- Team Members

The application implements:

- JWT Authentication
- Role-Based Access Control (RBAC)
- Unified Login
- REST APIs
- MongoDB Database
- Email Invitation System

---

# Technology Stack

## Frontend

- React.js
- React Router DOM
- Axios
- CSS
- Vite

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Authentication

- JWT
- bcryptjs

---

# Project Structure

```text
project-management-system/

├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── App.jsx
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   │
│   ├── seed.js
│   ├── package.json
│   └── README.md
```

---

# Features Completed

## Phase 1 – Client Management

- Create Client
- View Clients
- Search Clients
- Pagination
- Edit Client
- Soft Delete Client
- Client CRUD APIs

---

## Phase 2 – Company Admin Management

- Company Admin CRUD
- Company Admin Login
- JWT Authentication
- Protected APIs
- Company Admin Dashboard
- Email Invitation
- Logout

---

## Phase 3 – User Management

### Project Managers

- Create
- Edit
- View
- Activate / Deactivate
- Soft Delete

### Team Members

- Create
- Edit
- View
- Activate / Deactivate
- Soft Delete

### APIs

- Create User
- Update User
- Delete User
- Get Users
- Search
- Pagination

---

# Authentication

The application uses a **single unified login page**.

Instead of:

```text
/company-admin/login

/project-manager/login

/team-member/login
```

There is now only one login page:

```text
/login
```

The backend authenticates users from different collections and redirects them according to their role.

---

# User Roles

| Role | Dashboard |
|-------|-----------|
| SUPER_ADMIN | /dashboard |
| COMPANY_ADMIN | /company-admin/dashboard |
| PROJECT_MANAGER | /project-manager/dashboard |
| TEAM_MEMBER | /team-member/dashboard |

---

# Login Flow

```text
User
   │
   ▼
/login
   │
   ▼
POST /api/auth/login
   │
   ▼
Backend searches

SuperAdmin
      │
CompanyAdmin
      │
ProjectManager
      │
TeamMember
      │
      ▼
Password Verification
      │
      ▼
Generate JWT
      │
      ▼
Return User Role
      │
      ▼
Redirect to Dashboard
```

---

# Default Login Credentials

## Super Admin

Email

```text
superadmin@gmail.com
```

Password

```text
Admin@123
```

---

## Company Admin

Email

```text
john@company.com
```

Password

```text
Admin@123
```

---

## Project Manager

Create one using the Company Admin Dashboard.

---

## Team Member

Create one using the Company Admin Dashboard.

---

# Database Seed Script

This repository includes a database seed script.

Run:

```bash
npm run seed
```

The script creates:

- Super Admin
- Sample Client
- Company Admin

Running the script multiple times will **not create duplicate records**.

---

# Clone Repositories

## Clone Backend

```bash
git clone https://github.com/gavinichandralekha/project-management-backend.git
```

## Clone Frontend

```bash
git clone https://github.com/gavinichandralekha/project-management-frontend.git
```

---

# Backend Installation

```bash
cd project-management-backend

npm install
```

---

# Environment Variables

Create a `.env` file inside the backend project.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

EMAIL_USER=your_email

EMAIL_PASS=your_email_password
```

---

# Running the Backend

Development Mode

```bash
npm run dev
```

Production Mode

```bash
npm start
```

---

# Frontend Installation

```bash
cd project-management-frontend

npm install

npm run dev
```

---

# Application URLs

## Frontend

```text
http://localhost:5173
```

## Backend

```text
http://localhost:5000
```

---

# API Overview

## Authentication

```text
POST /api/auth/login
```

---

## Clients

```text
POST   /api/clients

GET    /api/clients

GET    /api/clients/:id

PUT    /api/clients/:id

DELETE /api/clients/:id
```

---

## Company Admin

```text
POST   /api/company-admin

GET    /api/company-admin

GET    /api/company-admin/:id

PUT    /api/company-admin/:id

DELETE /api/company-admin/:id
```

---

## Project Managers

```text
POST   /api/project-manager

GET    /api/project-manager

GET    /api/project-manager/:id

PUT    /api/project-manager/:id

DELETE /api/project-manager/:id
```

---

## Team Members

```text
POST   /api/team-member

GET    /api/team-member

GET    /api/team-member/:id

PUT    /api/team-member/:id

DELETE /api/team-member/:id
```

---

# Security Features

- JWT Authentication
- Role-Based Access Control (RBAC)
- Password Hashing using bcrypt
- Protected Routes
- Soft Delete
- Client Isolation using clientId