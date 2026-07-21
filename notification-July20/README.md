# Roster — Admin & Employee Panel

A full-stack employee management app:

- **Employee panel** — view/edit own basic info (DOB, phone, address, salary), see meetings, view & update assigned tasks, get notifications.
- **Admin panel** — view all employees, add new employees, assign tasks (notifies the employee instantly), schedule meetings (notifies the employee), trigger salary-credited notifications.
- **Automatic birthday notifications** — a daily cron job checks every employee's DOB and sends a "Happy Birthday" notification on the day.

Stack: **React (Vite)** frontend, **Node.js/Express** backend, **PostgreSQL** database, **JWT** auth.

```
project/
├── backend/     Express API + PostgreSQL
└── frontend/    React (Vite) app
```

## 1. Database setup

Install PostgreSQL if you don't have it, then create a database:

```bash
createdb empdb
# or inside psql:
# CREATE DATABASE empdb;
```

Load the schema:

```bash
cd backend
psql -U postgres -d empdb -f schema.sql
```

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env — set DATABASE_URL to match your Postgres user/password/db,
# and set JWT_SECRET to a long random string
npm install
npm run seed     # creates an admin + one sample employee account
npm run dev       # starts the API on http://localhost:5000
```

Seeded logins (change these passwords after first login in a real deployment):

| Role     | Email                  | Password      |
|----------|-------------------------|----------------|
| Admin    | admin@company.com       | Admin@123      |
| Employee | jane.doe@company.com    | Employee@123   |

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env   # points at the backend, defaults to localhost:5000
npm install
npm run dev             # starts the app on http://localhost:5173
```

Open http://localhost:5173, log in with either account above, and you'll land on the matching panel.

## How notifications work

Every notification is a row in the `notifications` table tied to a `user_id`. The bell icon in both panels polls `/api/employee/notifications` (employee) — wire the same pattern into the admin panel if you want admin-facing alerts too. Triggers already wired up:

- **Task assigned** → fires the moment an admin assigns a task.
- **Meeting scheduled** → fires the moment an admin books a meeting.
- **Salary credited** → fires when an admin clicks "Send notification" on the Salary Credit tab (hook this into your real payroll job to automate it).
- **Birthday** → a `node-cron` job (`backend/cron/birthdayCron.js`) runs daily at 08:00 server time and notifies anyone whose DOB matches today.

**Slide-in toasts**: the employee panel polls `/api/employee/notifications` every 12 seconds (`POLL_INTERVAL_MS` in `EmployeeDashboard.jsx`). Any notification with an id it hasn't seen before slides in from the right as a toast (`ToastStack.jsx`), sits for 5 seconds, then slides back out — it's already sitting in the bell/panel underneath by then, since the bell reads from the same `notifications` state. To make this instant instead of poll-based, swap the `setInterval` for WebSockets or Server-Sent Events later; the toast/bell logic itself doesn't need to change, just how `notifications` gets updated.

## Notes & things worth tightening before production

- **Salary self-edit**: the employee profile form lets employees edit their own salary, exactly as requested. Most real HR systems route salary changes through admin approval instead — consider changing the `PUT /api/employee/me` route to submit a change request rather than writing directly, if you want that safety net later.
- **Passwords**: seeded passwords are simple for local testing — change them and enforce a real password policy before going live.
- **CORS**: `CORS_ORIGIN` in `backend/.env` should be locked to your real frontend domain in production.
- **HTTPS & secrets**: put this behind HTTPS and keep `JWT_SECRET` out of source control in real deployments.
