from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import psycopg2
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config


app = Flask(__name__)
app.config.from_object(Config)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


class User(UserMixin):
    def __init__(self, id, username, email, password_hash):
        self.id = id
        self.username = username
        self.email = email
        self.password_hash = password_hash


def get_db_connection():
    conn = psycopg2.connect(Config.get_db_url())
    return conn


def init_db():
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            cur.execute('''
                CREATE TABLE IF NOT EXISTS login_logs (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) NOT NULL,
                    success BOOLEAN NOT NULL,
                    details VARCHAR(255),
                    ip_address VARCHAR(45),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            conn.commit()
    finally:
        conn.close()


def log_login_attempt(username, success, details=None):
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                'INSERT INTO login_logs (username, success, details, ip_address) VALUES (%s, %s, %s, %s)',
                (username, success, details or '', request.remote_addr)
            )
            conn.commit()
    except Exception as exc:
        app.logger.exception('Failed to save login log: %s', exc)
    finally:
        if 'conn' in locals():
            conn.close()


def get_login_history(username):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                'SELECT username, success, details, ip_address, created_at FROM login_logs WHERE username = %s ORDER BY created_at DESC LIMIT 10',
                (username,)
            )
            return cur.fetchall()
    finally:
        conn.close()


init_db()

@login_manager.user_loader
def load_user(user_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, username, email, password_hash FROM users WHERE id = %s', (user_id,))
    user_data = cur.fetchone()
    cur.close()
    conn.close()
    
    if user_data:
        return User(user_data[0], user_data[1], user_data[2], user_data[3])
    return None

@app.route('/')
def home():
    if current_user.is_authenticated:
        login_logs = get_login_history(current_user.username)
        return render_template('dashboard.html', user=current_user, login_logs=login_logs)
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')

        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute('SELECT id, username, email, password_hash FROM users WHERE username = %s', (username,))
                user_data = cur.fetchone()
        finally:
            conn.close()

        if user_data and check_password_hash(user_data[3], password):
            user = User(user_data[0], user_data[1], user_data[2], user_data[3])
            login_user(user)
            log_login_attempt(username, True, 'Successful login')
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))

        log_login_attempt(username, False, 'Invalid username or password')
        flash('Invalid username or password', 'error')

    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        if password != confirm_password:
            flash('Passwords do not match', 'error')
            return redirect(url_for('register'))
        
        if len(password) < 8:
            flash('Password must be at least 8 characters long', 'error')
            return redirect(url_for('register'))
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Check if username already exists
        cur.execute('SELECT id FROM users WHERE username = %s', (username,))
        if cur.fetchone():
            cur.close()
            conn.close()
            flash('Username already exists', 'error')
            return redirect(url_for('register'))
        
        # Check if email already exists
        cur.execute('SELECT id FROM users WHERE email = %s', (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            flash('Email already exists', 'error')
            return redirect(url_for('register'))
        
        # Create new user
        password_hash = generate_password_hash(password)
        cur.execute('INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)',
                   (username, email, password_hash))
        conn.commit()
        cur.close()
        conn.close()
        
        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/dashboard')
@login_required
def dashboard():
    login_logs = get_login_history(current_user.username)
    return render_template('dashboard.html', user=current_user, login_logs=login_logs)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out', 'info')
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
