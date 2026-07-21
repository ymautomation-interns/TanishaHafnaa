-- ============================================================
-- Employee Management System — PostgreSQL schema
-- Run: psql -U postgres -d empdb -f schema.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'employee')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employees (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employee_code VARCHAR(20) UNIQUE NOT NULL,
  full_name     VARCHAR(150) NOT NULL,
  dob           DATE,
  phone         VARCHAR(20),
  address       TEXT,
  department    VARCHAR(100),
  designation   VARCHAR(100),
  salary        NUMERIC(12,2) DEFAULT 0,
  date_joined   DATE DEFAULT CURRENT_DATE,
  avatar_color  VARCHAR(20) DEFAULT '#2E8B7E',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  assigned_to   INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  assigned_by   INTEGER NOT NULL REFERENCES users(id),
  status        VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed')),
  priority      VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  due_date      DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS meetings (
  id            SERIAL PRIMARY KEY,
  employee_id   INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  title         VARCHAR(200) NOT NULL,
  meeting_time  TIMESTAMPTZ NOT NULL,
  location      VARCHAR(150),
  notes         TEXT,
  created_by    INTEGER REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          VARCHAR(30) NOT NULL CHECK (type IN ('task_assigned','birthday','salary_credited','task_status','meeting','general')),
  title         VARCHAR(150) NOT NULL,
  message       TEXT NOT NULL,
  is_read       BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_tasks_employee ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_meetings_employee ON meetings(employee_id);

-- Seed data is inserted by `node seed.js` (see README) so that passwords
-- are hashed with bcrypt at run time instead of hardcoding a hash here.
