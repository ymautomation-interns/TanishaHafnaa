# Windows Setup Instructions

## Prerequisites Installation

### 1. Install PostgreSQL (if not installed)

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation:
   - Set superuser password (remember this!)
   - Default port: 5432
   - Keep other defaults

### 2. Verify PostgreSQL Installation

Open PowerShell and run:
```powershell
psql --version
```

## Database Setup

### Option A: Using PostgreSQL Command Line (Recommended)

1. Open PowerShell
2. Connect to PostgreSQL:
```powershell
psql -U postgres
```

3. Enter your PostgreSQL password

4. Create database:
```sql
CREATE DATABASE admin_user_panel;
\q
```

### Option B: Using pgAdmin (GUI)

1. Open pgAdmin (installed with PostgreSQL)
2. Right-click on "Databases"
3. Create → Database
4. Name: `admin_user_panel`
5. Click "Save"

## Application Setup

### 1. Navigate to Backend Directory

```powershell
cd C:\Users\Tanisha\Desktop\admin-user-panel\backend
```

### 2. Update Environment File

Open `backend/.env` with Notepad and update:

```
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_HOST=localhost
DB_PORT=5432
DB_NAME=admin_user_panel
PORT=5000
ADMIN_PASSWORD=Admin@26
```

**Important**: Replace `YOUR_POSTGRES_PASSWORD` with your actual PostgreSQL password!

### 3. Install Dependencies

```powershell
npm install
```

This will install:
- express: Web server framework
- pg: PostgreSQL driver
- argon2: Password hashing
- cors: Cross-origin resource sharing
- dotenv: Environment variables
- body-parser: Request parsing

### 4. Initialize Database

```powershell
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

## Running the Application

### Terminal 1: Start Backend Server

```powershell
cd C:\Users\Tanisha\Desktop\admin-user-panel\backend
npm start
```

You should see:
```
Server running on http://localhost:5000
Admin panel: http://localhost:5000/admin.html
User panel: http://localhost:5000/user.html
```

### Terminal 2: Open in Browser

Visit: `http://localhost:5000/index.html`

## Accessing the Application

### Admin Login
- **URL**: http://localhost:5000/index.html
- **Username**: root
- **Password**: Admin@26
- **Panel**: http://localhost:5000/admin.html

### User Login
- **Username**: user1
- **Password**: user123
- **Panel**: http://localhost:5000/user.html

## Testing with Postman

### 1. Install Postman
Download from: https://www.postman.com/downloads/

### 2. Import Collection
1. Open Postman
2. Click "Import"
3. Select `postman_collection.json` from the project
4. All API endpoints will be available

### 3. Test Login

In Postman:
- **Method**: POST
- **URL**: http://localhost:5000/api/auth/login
- **Body (JSON)**:
```json
{
  "username": "root",
  "password": "Admin@26"
}
```

Click "Send"

### 4. Test Create Student

- **Method**: POST
- **URL**: http://localhost:5000/api/students
- **Headers**: 
  - Content-Type: application/json
  - x-user-role: admin
- **Body (JSON)**:
```json
{
  "name": "Bob Smith",
  "email": "bob@example.com",
  "phone": "+1234567890",
  "department": "Engineering"
}
```

## Common Issues & Solutions

### Issue 1: "psql is not recognized"
PostgreSQL not installed or not in PATH. Add to PATH:
```
C:\Program Files\PostgreSQL\15\bin
```

### Issue 2: "Cannot connect to database"
1. Check PostgreSQL is running (Start menu → Services → PostgreSQL)
2. Verify credentials in `.env`
3. Verify database exists: `admin_user_panel`

### Issue 3: "npm modules not found"
```powershell
cd backend
npm install
```

### Issue 4: "Port 5000 already in use"
Option A: Change port in `.env`:
```
PORT=5001
```

Option B: Kill process using port:
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue 5: Login fails
- Admin password is case-sensitive: `Admin@26`
- Not `admin@26` or `ADMIN@26`
- User password: `user123`

## Database Verification

Check if tables were created:

```powershell
psql -U postgres -d admin_user_panel

# In PostgreSQL:
\dt                    # List all tables
SELECT * FROM users;   # View users
SELECT * FROM students; # View students
\q
```

## File Locations

```
C:\Users\Tanisha\Desktop\admin-user-panel\
├── backend\
│   ├── routes\
│   │   ├── auth.js
│   │   └── students.js
│   ├── db.js
│   ├── init.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── node_modules\
├── frontend\
│   ├── index.html (login)
│   ├── admin.html (admin panel)
│   ├── user.html (user panel)
│   ├── admin.js
│   ├── user.js
│   └── styles.css
├── README.md
├── QUICK_START.md
├── WINDOWS_SETUP.md (this file)
└── postman_collection.json
```

## Development Tips

### View Server Logs
Keep the terminal open to see:
- New requests
- Errors
- Database queries

### Debug Mode
Edit `backend/server.js` to add logging:
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Test Frontend Without Backend
Simply open HTML files in browser, but API calls will fail.

### Reset Database
```powershell
psql -U postgres

DROP DATABASE admin_user_panel;
CREATE DATABASE admin_user_panel;
\q

cd backend
node init.js
```

## Next Steps

1. ✅ Install PostgreSQL
2. ✅ Create database
3. ✅ Update `.env` file
4. ✅ Run `node init.js`
5. ✅ Start backend with `npm start`
6. ✅ Open http://localhost:5000 in browser
7. ✅ Login with credentials
8. ✅ Test features
9. ✅ Use Postman for API testing

## Support

For detailed API documentation, see: `README.md`
For quick reference, see: `QUICK_START.md`
