# Admin & User Panel Application

A complete web application with Admin and User panels built with Node.js, Express, PostgreSQL, and vanilla JavaScript.

## Features

### Admin Panel
- ✅ Password-protected login (Admin@26)
- ✅ Password hashing with Argon2
- ✅ User Management (CRUD operations)
- ✅ Student Management with CRUD operations
- ✅ Create, edit, and delete students
- ✅ View students in both table and card format
- ✅ Dashboard with total student count
- ✅ Settings page with CRUD information

### User Panel
- ✅ Read-only access to student list
- ✅ View students in table and card format
- ✅ Dashboard showing total student count
- ✅ No editing or deletion permissions

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation & Setup

### 1. Create PostgreSQL Database

Before starting the application, create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL shell:
CREATE DATABASE admin_user_panel;
\q
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Edit `backend/.env` file with your PostgreSQL credentials:

```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=admin_user_panel
PORT=5000
ADMIN_PASSWORD=Admin@26
```

### 4. Initialize Database

Run the initialization script to create tables and seed the root user:

```bash
cd backend
node init.js
```

This will:
- Create `users` table
- Create `students` table
- Insert root admin user (username: `root`, password: `Admin@26`)
- Insert sample user (username: `user1`, password: `user123`)

### 5. Start the Backend Server

```bash
cd backend
npm start
```

The server will run on `http://localhost:5000`

## Access the Application

### Login
- Navigate to: `http://localhost:5000/index.html`
- Or: `http://localhost:5000`

### Admin Panel
- URL: `http://localhost:5000/admin.html`
- Username: `root`
- Password: `Admin@26`

### User Panel
- URL: `http://localhost:5000/user.html`
- Username: `user1`
- Password: `user123`

## API Endpoints

### Authentication
```
POST /api/auth/login
Body: { username: string, password: string }
Response: { success: true, user: { id, username, role } }
```

### Students (All endpoints require x-user-role header)
```
GET    /api/students              - Get all students
GET    /api/students/:id          - Get single student
GET    /api/students/count        - Get total student count
POST   /api/students              - Create student (admin only)
PUT    /api/students/:id          - Update student (admin only)
DELETE /api/students/:id          - Delete student (admin only)
```

## Testing with Postman

### 1. Login Endpoint
- **Method**: POST
- **URL**: `http://localhost:5000/api/auth/login`
- **Headers**: Content-Type: application/json
- **Body**:
```json
{
  "username": "root",
  "password": "Admin@26"
}
```

### 2. Get All Students
- **Method**: GET
- **URL**: `http://localhost:5000/api/students`
- **Headers**:
  - x-user-role: admin (or user)

### 3. Create Student (Admin Only)
- **Method**: POST
- **URL**: `http://localhost:5000/api/students`
- **Headers**:
  - Content-Type: application/json
  - x-user-role: admin
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "department": "Computer Science"
}
```

### 4. Update Student (Admin Only)
- **Method**: PUT
- **URL**: `http://localhost:5000/api/students/1`
- **Headers**:
  - Content-Type: application/json
  - x-user-role: admin
- **Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "0987654321",
  "department": "Engineering"
}
```

### 5. Delete Student (Admin Only)
- **Method**: DELETE
- **URL**: `http://localhost:5000/api/students/1`
- **Headers**:
  - x-user-role: admin

## Project Structure

```
admin-user-panel/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── students.js      # Student CRUD routes
│   ├── db.js                # Database configuration
│   ├── init.js              # Database initialization
│   ├── server.js            # Express server
│   ├── package.json         # Dependencies
│   └── .env                 # Environment variables
└── frontend/
    ├── index.html           # Login page
    ├── admin.html           # Admin panel
    ├── user.html            # User panel
    ├── admin.js             # Admin panel logic
    ├── user.js              # User panel logic
    └── styles.css           # Styling
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: Argon2 for password hashing
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: RESTful API with JSON

## Security Features

- ✅ Argon2 password hashing (Argon2id algorithm)
- ✅ Role-based access control (Admin/User)
- ✅ Protected endpoints with role headers
- ✅ CORS enabled
- ✅ Input validation

## Default Users

| Username | Password  | Role  |
|----------|-----------|-------|
| root     | Admin@26  | admin |
| user1    | user123   | user  |

## Troubleshooting

### Connection Error
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database `admin_user_panel` exists

### Module Not Found
```bash
cd backend
npm install
```

### Port Already in Use
Change PORT in `.env` file:
```
PORT=5001
```

### CORS Errors
Ensure the API URL in frontend matches the backend URL (default: `http://localhost:5000`)

## License

This project is open source and available under the MIT License.
