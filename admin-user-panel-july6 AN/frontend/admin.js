const API_URL = 'http://localhost:5000/api';

// Check if user is logged in
window.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'admin') {
    window.location.href = 'index.html';
  }

  document.getElementById('userDisplay').textContent = `Welcome, ${user.username}!`;

  // Initialize tabs
  initializeTabs();
  loadStudents();
  loadStudentCount();
  setupViewToggle();
  loadStudentsForSettings();
  setupCreateStudentFormListener();
  setupUpdateStudentFormListener();
  populateStudentDeleteDropdown();
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
        <td>
          <button class="btn-small" onclick="editStudent(${student.id})">Edit</button>
          <button class="btn-small btn-danger" onclick="deleteStudent(${student.id})">Delete</button>
        </td>
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
        <div class="card-footer">
          <button class="btn-small" onclick="editStudent(${student.id})">Edit</button>
          <button class="btn-small btn-danger" onclick="deleteStudent(${student.id})">Delete</button>
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

document.getElementById('studentForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem('user'));
  const studentId = document.getElementById('studentId').value;
  const name = document.getElementById('studentName').value;
  const email = document.getElementById('studentEmail').value;
  const phone = document.getElementById('studentPhone').value;
  const department = document.getElementById('studentDepartment').value;
  const messageDiv = document.getElementById('formMessage');

  try {
    let response;

    if (studentId) {
      // Update student
      response = await fetch(`${API_URL}/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user.role,
        },
        body: JSON.stringify({ name, email, phone, department }),
      });
    } else {
      // Create new student
      response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user.role,
        },
        body: JSON.stringify({ name, email, phone, department }),
      });
    }

    const data = await response.json();

    if (!response.ok) {
      messageDiv.textContent = data.error || 'Error saving student';
      messageDiv.className = 'message error';
      return;
    }

    messageDiv.textContent = studentId ? 'Student updated successfully!' : 'Student added successfully!';
    messageDiv.className = 'message success';

    clearForm();
    loadStudents();
    loadStudentCount();

    setTimeout(() => {
      messageDiv.textContent = '';
    }, 3000);
  } catch (err) {
    messageDiv.textContent = 'Error: ' + err.message;
    messageDiv.className = 'message error';
  }
});

function clearForm() {
  document.getElementById('studentForm').reset();
  document.getElementById('studentId').value = '';
}

async function editStudent(studentId) {
  try {
    const response = await fetch(`${API_URL}/students/${studentId}`);
    const student = await response.json();

    document.getElementById('studentId').value = student.id;
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentEmail').value = student.email;
    document.getElementById('studentPhone').value = student.phone || '';
    document.getElementById('studentDepartment').value = student.department || '';

    showTab('add-student');
    document.getElementById('studentName').focus();
  } catch (err) {
    alert('Error loading student: ' + err.message);
  }
}

async function deleteStudent(studentId) {
  if (!confirm('Are you sure you want to delete this student?')) {
    return;
  }

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${API_URL}/students/${studentId}`, {
      method: 'DELETE',
      headers: {
        'x-user-role': user.role,
      },
    });

    if (!response.ok) {
      alert('Error deleting student');
      return;
    }

    loadStudents();
    loadStudentCount();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// Student CRUD Functions - 4 Box Layout
function setupCreateStudentFormListener() {
  const createStudentForm = document.getElementById('createStudentForm');
  if (createStudentForm) {
    createStudentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await createStudent();
    });
  }
}

function setupUpdateStudentFormListener() {
  const updateStudentForm = document.getElementById('updateStudentForm');
  if (updateStudentForm) {
    updateStudentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await updateStudent();
    });
  }
}

async function loadStudentsForSettings() {
  try {
    const response = await fetch(`${API_URL}/students`);
    if (!response.ok) throw new Error('Failed to load students');
    
    const students = await response.json();
    const tableBody = document.getElementById('settingsStudentsTableBody');
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
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => editStudentFromSettings(student.id));
      tableBody.appendChild(row);
    });

    // Also populate delete dropdown
    populateStudentDeleteDropdown(students);
  } catch (err) {
    console.error('Error loading students:', err);
  }
}

function populateStudentDeleteDropdown(students) {
  const deleteSelect = document.getElementById('deleteStudentId');
  if (!deleteSelect) return;

  deleteSelect.innerHTML = '<option value="">Select Student</option>';

  if (!students) {
    // If students not provided, fetch them
    fetch(`${API_URL}/students`)
      .then(res => res.json())
      .then(data => {
        data.forEach(student => {
          const option = document.createElement('option');
          option.value = student.id;
          option.textContent = `${student.name} (${student.email})`;
          deleteSelect.appendChild(option);
        });
      })
      .catch(err => console.error('Error loading students for dropdown:', err));
  } else {
    students.forEach(student => {
      const option = document.createElement('option');
      option.value = student.id;
      option.textContent = `${student.name} (${student.email})`;
      deleteSelect.appendChild(option);
    });
  }
}

async function createStudent() {
  const name = document.getElementById('createStudentName').value;
  const email = document.getElementById('createStudentEmail').value;
  const phone = document.getElementById('createStudentPhone').value;
  const department = document.getElementById('createStudentDepartment').value;
  const messageDiv = document.getElementById('createStudentMessage');

  if (!name || !email) {
    messageDiv.textContent = 'Name and email are required';
    messageDiv.className = 'message error';
    return;
  }

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': user.role,
      },
      body: JSON.stringify({ name, email, phone, department }),
    });

    const data = await response.json();

    if (!response.ok) {
      messageDiv.textContent = data.error || 'Error creating student';
      messageDiv.className = 'message error';
      return;
    }

    messageDiv.textContent = 'Student created successfully!';
    messageDiv.className = 'message success';

    document.getElementById('createStudentForm').reset();
    loadStudentsForSettings();
    loadStudents();
    loadStudentCount();

    setTimeout(() => {
      messageDiv.textContent = '';
    }, 3000);
  } catch (err) {
    messageDiv.textContent = 'Error: ' + err.message;
    messageDiv.className = 'message error';
  }
}

async function updateStudent() {
  const studentId = document.getElementById('updateStudentId').value;
  const name = document.getElementById('updateStudentName').value;
  const email = document.getElementById('updateStudentEmail').value;
  const phone = document.getElementById('updateStudentPhone').value;
  const department = document.getElementById('updateStudentDepartment').value;
  const messageDiv = document.getElementById('updateStudentMessage');

  if (!studentId) {
    messageDiv.textContent = 'Please select a student to update from the Read box';
    messageDiv.className = 'message error';
    return;
  }

  if (!name || !email) {
    messageDiv.textContent = 'Name and email are required';
    messageDiv.className = 'message error';
    return;
  }

  try {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${API_URL}/students/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': currentUser.role,
      },
      body: JSON.stringify({ name, email, phone, department }),
    });

    const data = await response.json();

    if (!response.ok) {
      messageDiv.textContent = data.error || 'Error updating student';
      messageDiv.className = 'message error';
      return;
    }

    messageDiv.textContent = 'Student updated successfully!';
    messageDiv.className = 'message success';

    clearUpdateStudentForm();
    loadStudentsForSettings();
    loadStudents();

    setTimeout(() => {
      messageDiv.textContent = '';
    }, 3000);
  } catch (err) {
    messageDiv.textContent = 'Error: ' + err.message;
    messageDiv.className = 'message error';
  }
}

async function deleteSelectedStudent() {
  const studentId = document.getElementById('deleteStudentId').value;
  const messageDiv = document.getElementById('deleteStudentMessage');

  if (!studentId) {
    messageDiv.textContent = 'Please select a student to delete';
    messageDiv.className = 'message error';
    return;
  }

  if (!confirm('Are you sure you want to delete this student?')) {
    return;
  }

  try {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${API_URL}/students/${studentId}`, {
      method: 'DELETE',
      headers: {
        'x-user-role': currentUser.role,
      },
    });

    if (!response.ok) {
      messageDiv.textContent = 'Error deleting student';
      messageDiv.className = 'message error';
      return;
    }

    messageDiv.textContent = 'Student deleted successfully!';
    messageDiv.className = 'message success';

    document.getElementById('deleteStudentId').value = '';
    loadStudentsForSettings();
    loadStudents();
    loadStudentCount();

    setTimeout(() => {
      messageDiv.textContent = '';
    }, 3000);
  } catch (err) {
    messageDiv.textContent = 'Error: ' + err.message;
    messageDiv.className = 'message error';
  }
}

function clearUpdateStudentForm() {
  document.getElementById('updateStudentForm').reset();
  document.getElementById('updateStudentId').value = '';
  document.getElementById('updateStudentMessage').textContent = '';
}

// Function to populate update form when clicking on a student in the read box
function editStudentFromSettings(studentId) {
  fetch(`${API_URL}/students/${studentId}`)
    .then(res => res.json())
    .then(student => {
      document.getElementById('updateStudentId').value = student.id;
      document.getElementById('updateStudentName').value = student.name;
      document.getElementById('updateStudentEmail').value = student.email;
      document.getElementById('updateStudentPhone').value = student.phone || '';
      document.getElementById('updateStudentDepartment').value = student.department || '';
      
      // Scroll to update box
      document.querySelector('.update-box').scrollIntoView({ behavior: 'smooth' });
      document.getElementById('updateStudentName').focus();
    })
    .catch(err => {
      alert('Error loading student: ' + err.message);
    });
}
