const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),

  // Employee
  getMe: (token) => request('/employee/me', { token }),
  updateMe: (token, payload) => request('/employee/me', { method: 'PUT', body: payload, token }),
  getMyMeetings: (token) => request('/employee/meetings', { token }),
  getMyTasks: (token) => request('/employee/tasks', { token }),
  updateTaskStatus: (token, id, status) =>
    request(`/employee/tasks/${id}/status`, { method: 'PATCH', body: { status }, token }),
  getMyNotifications: (token) => request('/employee/notifications', { token }),
  markNotificationRead: (token, id) =>
    request(`/employee/notifications/${id}/read`, { method: 'PATCH', token }),
  markAllNotificationsRead: (token) =>
    request('/employee/notifications/read-all', { method: 'PATCH', token }),

  // Admin
  getEmployees: (token) => request('/admin/employees', { token }),
  createEmployee: (token, payload) => request('/admin/employees', { method: 'POST', body: payload, token }),
  assignTask: (token, payload) => request('/admin/tasks', { method: 'POST', body: payload, token }),
  getAllTasks: (token) => request('/admin/tasks', { token }),
  scheduleMeeting: (token, payload) => request('/admin/meetings', { method: 'POST', body: payload, token }),
  creditSalary: (token, employeeId, payload) =>
    request(`/admin/employees/${employeeId}/salary-credit`, { method: 'POST', body: payload, token }),
};
