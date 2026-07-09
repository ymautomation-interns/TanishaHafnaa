const API_URL = 'http://localhost:5000/api';

// Check if user is logged in
window.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'user') {
    window.location.href = 'index.html';
  }

  document.getElementById('userDisplay').textContent = `Welcome, ${user.username}!`;

  // Initialize tabs
  initializeTabs();
  loadStudents();
  loadStudentCount();
  setupViewToggle();
});

function initializeTabs() {
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      showTab(tabName);
    });
  });
}

function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach((tab) => {
    tab.classList.remove('active');
  });

  // Remove active class from all nav tabs
  document.querySelectorAll('.nav-tab').forEach((tab) => {
    tab.classList.remove('active');
  });

  // Show selected tab
  document.getElementById(tabName).classList.add('active');

  // Add active class to clicked nav tab
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

function setupViewToggle() {
  const viewButtons = document.querySelectorAll('.btn-view');
  viewButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const viewType = btn.getAttribute('data-view');

      // Remove active class from all buttons
      viewButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Hide all views
      document.querySelectorAll('.view-container').forEach((view) => {
        view.classList.remove('active');
      });

      // Show selected view
      document.getElementById(`${viewType}-view`).classList.add('active');
    });
  });
}

async function loadStudents() {
  try {
    const response = await fetch(`${API_URL}/students`);
    const students = await response.json();

    // Populate table view
    const tableBody = document.getElementById('studentsTableBody');
    tableBody.innerHTML = '';

    students.forEach((student) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.phone || '-'}</td>
        <td>${student.department || '-'}</td>
      `;
      tableBody.appendChild(row);
    });

    // Populate card view
    const cardView = document.getElementById('studentsCardView');
    cardView.innerHTML = '';

    students.forEach((student) => {
      const card = document.createElement('div');
      card.className = 'student-card';
      card.innerHTML = `
        <div class="card-header">${student.name}</div>
        <div class="card-body">
          <p><strong>Email:</strong> ${student.email}</p>
          <p><strong>Phone:</strong> ${student.phone || '-'}</p>
          <p><strong>Department:</strong> ${student.department || '-'}</p>
        </div>
      `;
      cardView.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading students:', err);
  }
}

async function loadStudentCount() {
  try {
    const response = await fetch(`${API_URL}/students/count`);
    const data = await response.json();
    document.getElementById('studentCount').textContent = data.count;
  } catch (err) {
    console.error('Error loading student count:', err);
  }
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}
