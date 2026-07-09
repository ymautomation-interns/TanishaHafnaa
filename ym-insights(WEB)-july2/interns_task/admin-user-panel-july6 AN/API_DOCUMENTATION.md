# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Table of Contents
1. [Authentication](#authentication)
2. [Students Management](#students-management)
3. [Response Formats](#response-formats)
4. [Error Handling](#error-handling)
5. [Headers](#headers)

---

## Authentication

### Login
Authenticate user and get user information.

**Endpoint:**
```
POST /auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "root",
  "password": "Admin@26"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "root",
    "role": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

**Error Response (400):**
```json
{
  "error": "Username and password required"
}
```

---

## Students Management

### Get All Students
Retrieve all students from the database.

**Endpoint:**
```
GET /students
```

**Headers:**
```
x-user-role: admin  (or user)
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "department": "Computer Science",
    "enrollment_date": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+0987654321",
    "department": "Engineering",
    "enrollment_date": "2024-01-16T14:45:00.000Z"
  }
]
```

---

### Get Single Student
Retrieve a specific student by ID.

**Endpoint:**
```
GET /students/:id
```

**Parameters:**
- `id` (required): Student ID (integer)

**Headers:**
```
x-user-role: admin  (or user)
```

**Example:**
```
GET /students/1
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "department": "Computer Science",
  "enrollment_date": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Student not found"
}
```

---

### Create Student
Create a new student record. **Admin only.**

**Endpoint:**
```
POST /students
```

**Headers:**
```
Content-Type: application/json
x-user-role: admin
```

**Request Body:**
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "+1234567890",
  "department": "Computer Science"
}
```

**Required Fields:**
- `name` (string): Student name
- `email` (string): Student email (must be unique)

**Optional Fields:**
- `phone` (string): Contact number
- `department` (string): Department name

**Success Response (201):**
```json
{
  "id": 3,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "+1234567890",
  "department": "Computer Science",
  "enrollment_date": "2024-01-20T09:15:00.000Z"
}
```

**Error Response (400):**
```json
{
  "error": "Name and email required"
}
```

**Error Response (500):**
```json
{
  "error": "duplicate key value violates unique constraint \"students_email_key\""
}
```

**Error Response (403):**
```json
{
  "error": "Admin access required"
}
```

---

### Update Student
Update an existing student record. **Admin only.**

**Endpoint:**
```
PUT /students/:id
```

**Parameters:**
- `id` (required): Student ID

**Headers:**
```
Content-Type: application/json
x-user-role: admin
```

**Request Body:**
```json
{
  "name": "Alice Smith",
  "email": "alice.smith@example.com",
  "phone": "+0987654321",
  "department": "Engineering"
}
```

**Example:**
```
PUT /students/3
```

**Success Response (200):**
```json
{
  "id": 3,
  "name": "Alice Smith",
  "email": "alice.smith@example.com",
  "phone": "+0987654321",
  "department": "Engineering",
  "enrollment_date": "2024-01-20T09:15:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Student not found"
}
```

**Error Response (403):**
```json
{
  "error": "Admin access required"
}
```

---

### Delete Student
Delete a student record. **Admin only.**

**Endpoint:**
```
DELETE /students/:id
```

**Parameters:**
- `id` (required): Student ID

**Headers:**
```
x-user-role: admin
```

**Example:**
```
DELETE /students/3
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Student deleted"
}
```

**Error Response (404):**
```json
{
  "error": "Student not found"
}
```

**Error Response (403):**
```json
{
  "error": "Admin access required"
}
```

---

### Get Student Count
Get the total number of students in the database.

**Endpoint:**
```
GET /students/count
```

**Headers:**
```
x-user-role: admin  (or user)
```

**Success Response (200):**
```json
{
  "count": 5
}
```

---

## Response Formats

### Success Response
All successful responses follow this pattern:

**For GET requests (array):**
```json
[
  { "id": 1, "name": "...", ... },
  { "id": 2, "name": "...", ... }
]
```

**For GET requests (single object):**
```json
{
  "id": 1,
  "name": "...",
  ...
}
```

**For POST/PUT requests:**
```json
{
  "id": 1,
  "name": "...",
  ...
}
```

**For DELETE requests:**
```json
{
  "success": true,
  "message": "Student deleted"
}
```

---

### Error Response
All error responses follow this pattern:

```json
{
  "error": "Error description here"
}
```

---

## HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200  | OK | Student retrieved successfully |
| 201  | Created | Student created successfully |
| 400  | Bad Request | Missing required fields |
| 401  | Unauthorized | Invalid credentials |
| 403  | Forbidden | Admin access required |
| 404  | Not Found | Student not found |
| 500  | Server Error | Database error |

---

## Headers

### Required Headers

**For all endpoints:**
```
x-user-role: admin  (or user)
```

**For POST/PUT endpoints:**
```
Content-Type: application/json
```

### Optional Headers

```
Accept: application/json
```

---

## Authentication Roles

### Admin Role
- Can perform all CRUD operations
- Can access all endpoints
- Can manage students
- Can view all data

### User Role
- Can only READ data
- Cannot CREATE, UPDATE, or DELETE
- Can view student list and details
- Cannot access admin-only features

---

## Field Validation

### Student Fields

**Name:**
- Type: String
- Required: Yes
- Max Length: 255 characters
- Example: "John Doe"

**Email:**
- Type: String
- Required: Yes
- Format: Valid email
- Unique: Yes (no duplicates)
- Max Length: 255 characters
- Example: "john@example.com"

**Phone:**
- Type: String
- Required: No
- Max Length: 20 characters
- Example: "+1234567890"

**Department:**
- Type: String
- Required: No
- Max Length: 100 characters
- Example: "Computer Science"

---

## Example Requests

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"root","password":"Admin@26"}'
```

**Get All Students:**
```bash
curl -X GET http://localhost:5000/api/students \
  -H "x-user-role: admin"
```

**Create Student:**
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "x-user-role: admin" \
  -d '{
    "name":"Bob Wilson",
    "email":"bob@example.com",
    "phone":"+1234567890",
    "department":"IT"
  }'
```

**Update Student:**
```bash
curl -X PUT http://localhost:5000/api/students/1 \
  -H "Content-Type: application/json" \
  -H "x-user-role: admin" \
  -d '{
    "name":"Bob Wilson Updated",
    "email":"bob.updated@example.com"
  }'
```

**Delete Student:**
```bash
curl -X DELETE http://localhost:5000/api/students/1 \
  -H "x-user-role: admin"
```

---

## Testing Checklist

- [ ] Login with admin credentials
- [ ] Login with user credentials
- [ ] Get all students
- [ ] Get single student
- [ ] Create new student (admin)
- [ ] Update student (admin)
- [ ] Delete student (admin)
- [ ] Get student count
- [ ] Test admin-only restrictions
- [ ] Test user view-only restrictions

---

## Rate Limiting

Currently, there is **no rate limiting** implemented. In production, consider adding:
- Request throttling
- IP-based limits
- User-based limits

---

## Version

API Version: 1.0.0
Last Updated: 2024
