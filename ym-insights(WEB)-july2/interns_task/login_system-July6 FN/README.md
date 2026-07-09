# Login System with PostgreSQL

A simple Flask-based login system with PostgreSQL database connectivity.

## Features

- User registration with username and email
- User login with password authentication
- Password hashing using Werkzeug
- Session management with Flask-Login
- PostgreSQL database integration
- Modern, responsive UI

## Prerequisites

- Python 3.8 or higher
- PostgreSQL database server

## Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Install PostgreSQL (if not already installed):**
   - Download from: https://www.postgresql.org/download/windows/
   - Run the installer and follow the setup wizard
   - Remember the password you set for the postgres user
   - Make sure to install pgAdmin 4 (optional but helpful)

3. **Set up PostgreSQL database:**
   - Open pgAdmin 4 or use command line
   - Create a database named `login_system`
   - Run the schema.sql file to create the users table:
     ```bash
     psql -U postgres -d login_system -f schema.sql
     ```
     Or use pgAdmin 4:
     - Connect to your PostgreSQL server
     - Create database `login_system`
     - Open Query Tool on the database
     - Copy and paste the contents of `schema.sql`
     - Execute the query

4. **Configure environment variables:**
   - Edit the `.env` file and update the following values:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=login_system
     DB_USER=postgres
     DB_PASSWORD=your_actual_postgres_password
     SECRET_KEY=your-secret-key-here-change-this
     ```

## Running the Application

1. **Start the Flask application:**
   ```bash
   python app.py
   ```

2. **Open your browser:**
   Navigate to `http://localhost:5000`

## Usage

- **Register:** Click "Register here" on the login page to create a new account
- **Login:** Enter your username and password to log in
- **Dashboard:** After login, you'll see your user information on the dashboard
- **Logout:** Click the logout link to end your session

## Project Structure

```
login_system/
├── app.py              # Main Flask application
├── config.py           # Configuration settings
├── requirements.txt    # Python dependencies
├── schema.sql          # Database schema
├── .env                # Environment variables
├── templates/          # HTML templates
│   ├── base.html      # Base template
│   ├── login.html     # Login page
│   ├── register.html  # Registration page
│   └── dashboard.html # Dashboard page
└── README.md          # This file
```

## Security Notes

- Passwords are hashed using Werkzeug's `generate_password_hash`
- Sessions are managed securely with Flask-Login
- Change the `SECRET_KEY` in `.env` for production use
- Use strong database passwords
- Consider adding CSRF protection for production

## Database Schema

The `users` table contains:
- `id`: Primary key (auto-increment SERIAL)
- `username`: Unique username (VARCHAR 50)
- `email`: Unique email address (VARCHAR 100)
- `password_hash`: Hashed password (VARCHAR 255)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

## Troubleshooting

**Connection refused error:**
- Ensure PostgreSQL is running (check Windows Services)
- Check your database credentials in `.env`
- Verify PostgreSQL is accepting connections on port 5432

**Import errors:**
- Make sure all dependencies are installed: `pip install -r requirements.txt`

**psql command not found:**
- Add PostgreSQL bin directory to your PATH
- Typical path: `C:\Program Files\PostgreSQL\16\bin`
- Or use pgAdmin 4 instead of command line

**Database doesn't exist:**
- Create the database using pgAdmin 4 or: `createdb login_system`
- Run the schema: `psql -U postgres -d login_system -f schema.sql`

**psycopg2 installation error:**
- If you get build errors, try: `pip install psycopg2-binary`
- Or install Microsoft Visual C++ Build Tools
