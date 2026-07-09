import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/profiles';

const COLOR_PRESETS = [
  { name: 'indigo', value: '#6366f1' },
  { name: 'emerald', value: '#10b981' },
  { name: 'rose', value: '#f43f5e' },
  { name: 'amber', value: '#f59e0b' },
  { name: 'violet', value: '#8b5cf6' }
];

function App() {
  // Profiles list state
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    bio: '',
    color: '#6366f1'
  });

  // Edit states
  const [editingId, setEditingId] = useState(null);

  // Toast states
  const [toast, setToast] = useState(null);

  // Fetch profiles on component mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      setProfiles(response.data);
    } catch (error) {
      console.error('Error loading profiles:', error);
      showToast('Could not load profiles from backend server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorSelect = (colorValue) => {
    setFormData((prev) => ({
      ...prev,
      color: colorValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Input Validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.role.trim()) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    try {
      if (editingId) {
        // Update Action
        const response = await axios.put(`${API_URL}/${editingId}`, formData);
        setProfiles((prev) =>
          prev.map((p) => (p._id === editingId ? response.data : p))
        );
        showToast('Profile updated successfully!');
        resetForm();
      } else {
        // Create Action
        const response = await axios.post(API_URL, formData);
        setProfiles((prev) => [response.data, ...prev]);
        showToast('Profile created successfully!');
        resetForm();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMsg = error.response?.data?.message || 'Error occurred while saving profile';
      showToast(errorMsg, 'error');
    }
  };

  const handleEditClick = (profile) => {
    setEditingId(profile._id);
    setFormData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      bio: profile.bio || '',
      color: profile.color || '#6366f1'
    });
    // Scroll window smoothly to form panel header
    document.getElementById('form-top')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteClick = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}'s profile?`)) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      setProfiles((prev) => prev.filter((p) => p._id !== id));
      showToast(`Deleted ${name}'s profile successfully.`);
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      showToast('Could not delete the profile', 'error');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      bio: '',
      color: '#6366f1'
    });
  };

  return (
    <div className="app-container">
      {/* Toast popup */}
      {toast && (
        <div className={`toast-container`}>
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' ? (
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <span>{toast.message}</span>
            <button className="toast-close" onClick={() => setToast(null)}>✕</button>
          </div>
        </div>
      )}

      {/* Header section */}
      <header className="app-header">
        <h1>Registration Portal</h1>
      </header>

      {/* Main Grid: Form Left, Cards List Right */}
      <main className="dashboard-grid">
        {/* Form panel */}
        <section className="glass-panel" id="form-top">
          <div className="form-panel-header">
            <h2>
              {editingId ? (
                <>
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{color: formData.color}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Update Registration
                </>
              ) : (
                <>
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{color: 'var(--accent-indigo)'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Registration Details
                </>
              )}
            </h2>
            <p>{editingId ? "Modify fields below to update the registration record" : "Fill out details to save a new record directly in MongoDB"}</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Sarah Jenkins"
                  className="form-input"
                  required
                />
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="sarah@example.com"
                  className="form-input"
                  required
                />
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 019-2834"
                  className="form-input"
                  required
                />
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>

            {/* Role Category Selector */}
            <div className="form-group">
              <label htmlFor="role">Professional Role *</label>
              <div className="input-wrapper">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="" disabled>Select role category...</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Marketing Specialist">Marketing Manager</option>
                  <option value="Consultant">Expert Consultant</option>
                  <option value="Other">Other Profession</option>
                </select>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Biography */}
            <div className="form-group">
              <label htmlFor="bio">Biography / Short Summary</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Share a brief statement about skills, passion, or hobbies..."
                className="form-textarea"
              />
            </div>

            {/* Profile color selector (Aesthetic Feature) */}
            <div className="form-group">
              <span className="color-picker-label">Accent Theme Color</span>
              <div className="color-options">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className={`color-dot ${formData.color === color.value ? 'active' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleColorSelect(color.value)}
                    title={color.name}
                    aria-label={`Select ${color.name} theme`}
                  />
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="form-actions">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingId ? 'Save Changes' : 'Register Now'}
              </button>
            </div>
          </form>
        </section>

        {/* Profiles view panel */}
        <section className="list-panel">
          <div className="list-header">
            <h2>Registered Records</h2>
            <span className="profile-count">
              {profiles.length} {profiles.length === 1 ? 'record' : 'records'}
            </span>
          </div>

          {isLoading ? (
            <div className="empty-state">
              <svg className="animate-spin" style={{animation: 'spin 1.5s linear infinite'}} fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="var(--text-muted)" strokeWidth="4" style={{opacity: 0.25}} />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <h3>Loading Records</h3>
              <p>Fetching active registrations from MongoDB...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="empty-state">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3>No Registrations Found</h3>
              <p>Be the first to submit details into the registration form on the left!</p>
            </div>
          ) : (
            <div className="cards-grid">
              {profiles.map((profile) => {
                const initials = profile.name
                  ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                  : '?';

                return (
                  <div
                    key={profile._id}
                    className="profile-card"
                    style={{ '--profile-color': profile.color }}
                  >
                    <div className="card-top">
                      <div className="avatar-row">
                        <div className="avatar-circle">
                          {initials}
                        </div>
                        <span className="role-badge">{profile.role}</span>
                      </div>

                      <div className="profile-info">
                        <h3>{profile.name}</h3>
                        <div className="profile-contact">
                          <div className="contact-item" title="Email address">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>{profile.email}</span>
                          </div>
                          <div className="contact-item" title="Phone number">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{profile.phone}</span>
                          </div>
                        </div>
                      </div>

                      {profile.bio && (
                        <p className="profile-bio" title={profile.bio}>
                          {profile.bio}
                        </p>
                      )}
                    </div>

                    <div className="card-actions">
                      <button
                        onClick={() => handleEditClick(profile)}
                        className="btn-icon btn-edit"
                        title="Edit profile details"
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(profile._id, profile.name)}
                        className="btn-icon btn-delete"
                        title="Delete profile"
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer style={{ marginTop: '70px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Created with React + Node Express + MongoDB. All changes persist instantly to database.
      </footer>
    </div>
  );
}

export default App;
