# Quick Start Guide - Admin & User Panel

## Step 1: Database Setup

### Windows PowerShell
```powershell
# Open PostgreSQL
psql -U postgres

# In PostgreSQL command line, run:
CREATE DATABASE admin_user_panel;
\q
```

## Step 2: Update Environment Variables

Edit `backend/.env` with your PostgreSQL credentials:

```
DB_USER=postgres
DB_PASSWORD=your_actual_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=admin_user_panel
PORT=5000
ADMIN_PASSWORD=Admin@26
```

Replace `your_actual_password_here` with your PostgreSQL password.

## Step 3: Initialize Database

```powershell
cd C:\Users\Tanisha\Desktop\admin-user-panel\backend
node init.js
```

Expected output:
```
Creating tables...
Tables created successfully!
Root admin user created successfully!
Username: root
Password: Admin@26
Role: admin
Sample user1 created with password: user123
Database initialization complete!
```

## Step 4: Start the Backend Server

```powershell
cd C:\Users\Tanisha\Desktop\admin-user-panel\backend
npm start
```

Server should start on: `http://localhost:5000`

## Step 5: Access the Application

- **Login Page**: http://localhost:5000/index.html
- **Admin Panel**: Use username `root` and password `Admin@26`
- **User Panel**: Use username `user1` and password `user123`

## Testing with Postman

### Import Collection Steps:
1. Open Postman
2. Create New Request

### Test Login (Root Admin)
```
POST http://localhost:5000/api/auth/login
Headers: Content-Type: application/json

Body (raw JSON):
{
  "username": "root",
  "password": "Admin@26"
}
```

### Test Get All Students
```
GET http://localhost:5000/api/students
Headers: 
  - x-user-role: admin
```

### Test Create Student (Admin Only)
```
POST http://localhost:5000/api/students
Headers:
  - Content-Type: application/json
  - x-user-role: admin

Body (raw JSON):
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "+1234567890",
  "department": "Computer Science"
}
```

### Test Update Student (Admin Only)
```
PUT http://localhost:5000/api/students/1
Headers:
  - Content-Type: application/json
  - x-user-role: admin

Body (raw JSON):
{
  "name": "Alice Smith",
  "email": "alice.smith@example.com",
  "phone": "+0987654321",
  "department": "Information Technology"
}
```

### Test Delete Student (Admin Only)
```
DELETE http://localhost:5000/api/students/1
Headers:
  - x-user-role: admin
```

### Test Get Student Count
```
GET http://localhost:5000/api/students/count
Headers:
  - x-user-role: admin
```

## Postman Collection (JSON)

Save this as a `.json` file and import into Postman:

```json
{
  "info": {
    "name": "Admin User Panel API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"username\": \"root\", \"password\": \"Admin@26\"}"
        },
        "url": {
          "raw": "http://localhost:5000/api/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "auth", "login"]
        }
      }
    },
    {
      "name": "Get All Students",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "x-user-role",
            "value": "admin"
          }
        ],
        "url": {
          "raw": "http://localhost:5000/api/students",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "students"]
        }
      }
    },
    {
      "name": "Create Student",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "x-user-role",
            "value": "admin"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"John Doe\", \"email\": \"john@example.com\", \"phone\": \"+1234567890\", \"department\": \"Computer Science\"}"
        },
        "url": {
          "raw": "http://localhost:5000/api/students",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "students"]
        }
      }
    },
    {
      "name": "Update Student",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "x-user-role",
            "value": "admin"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"Jane Doe\", \"email\": \"jane@example.com\", \"phone\": \"+0987654321\", \"department\": \"Engineering\"}"
        },
        "url": {
          "raw": "http://localhost:5000/api/students/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "students", "1"]
        }
      }
    },
    {
      "name": "Delete Student",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "x-user-role",
            "value": "admin"
          }
        ],
        "url": {
          "raw": "http://localhost:5000/api/students/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "students", "1"]
        }
      }
    },
    {
      "name": "Get Student Count",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "x-user-role",
            "value": "admin"
          }
        ],
        "url": {
          "raw": "http://localhost:5000/api/students/count",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "students", "count"]
        }
      }
    }
  ]
}
```

## Default Login Credentials

### Admin Account
- Username: `root`
- Password: `Admin@26`
- Access: Full CRUD operations on students

### User Account
- Username: `user1`
- Password: `user123`
- Access: View-only access to student list

## Application Features

### Admin Panel
- ✅ Dashboard with student count
- ✅ Student Management (Create, Read, Update, Delete)
- ✅ Table and Card view options
- ✅ Editable student form
- ✅ User management settings
- ✅ Password protected with Argon2 hashing

### User Panel
- ✅ Dashboard with student count
- ✅ View student list (read-only)
- ✅ Table and Card view options
- ✅ No editing or deletion permissions

## Troubleshooting

### Error: "Cannot find module 'pg'"
```
cd backend
npm install
```

### Error: "Database connection failed"
1. Ensure PostgreSQL is running
2. Check credentials in `.env`
3. Verify database exists: `admin_user_panel`

### Error: "Port 5000 already in use"
Change port in `.env`:
```
PORT=5001
```

### Password not accepted
- Admin password: `Admin@26`
- User password: `user123`
- Passwords are case-sensitive

## Directory Structure

```
admin-user-panel/
├── README.md                 # Main documentation
├── QUICK_START.md           # This file
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Authentication API
│   │   └── students.js      # Student CRUD API
│   ├── db.js                # Database configuration
│   ├── init.js              # Database initialization script
│   ├── server.js            # Express server
│   ├── .env                 # Environment variables
│   └── package.json         # Dependencies
└── frontend/
    ├── index.html           # Login page
    ├── admin.html           # Admin dashboard
    ├── user.html            # User dashboard
    ├── admin.js             # Admin panel JavaScript
    ├── user.js              # User panel JavaScript
    └── styles.css           # Styling
```

## Next Steps

1. Set up PostgreSQL database
2. Configure `.env` file with your credentials
3. Run `node init.js` to create tables
4. Start server with `npm start`
5. Access application at `http://localhost:5000`
6. Test with provided credentials
7. Use Postman for API testing

## Support

For any issues, check the README.md file for detailed documentation.
