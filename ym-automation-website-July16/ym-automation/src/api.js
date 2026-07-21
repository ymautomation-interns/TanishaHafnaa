export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const TOKEN_KEY = "ym_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return Boolean(getToken());
}

async function handle(res) {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message);
  }
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await handle(res);
  setToken(data.token);
  return data;
}

export async function fetchAllContent() {
  const res = await fetch(`${API_URL}/api/content`);
  return handle(res);
}

export async function saveSection(section, data) {
  const res = await fetch(`${API_URL}/api/content/${section}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return handle(res);
}

export async function uploadImage(file) {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
  const data = await handle(res);
  // Uploaded images are served from the API server, so build an absolute URL.
  return data.url.startsWith("http") ? data.url : `${API_URL}${data.url}`;
}

export async function submitContact(data) {
  const res = await fetch(`${API_URL}/api/forms/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle(res);
}

export async function submitApplication(formData) {
  // formData is a FormData object containing the files and fields
  const res = await fetch(`${API_URL}/api/forms/apply`, {
    method: "POST",
    body: formData,
  });
  return handle(res);
}
