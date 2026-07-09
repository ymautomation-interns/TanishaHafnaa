# MERN Profile Registry Form App

A premium, glassmorphic Identity Directory web application allowing real-time creation, viewing, updating, and deletion of profile details.

## Core Features
1. **Glassmorphism Visuals**: Clean dark mode with radial neon accents, animated states, and responsive styling.
2. **Full CRUD Operations**:
   - **Create**: Register details including Name, Email, Phone, Role, Bio, and custom card style color picker.
   - **Read**: Display all current profiles from MongoDB in structured grid cards.
   - **Update**: Click "Edit" to dynamically populate and submit updates.
   - **Delete**: Safely delete profiles from the database directory with confirm alerts.
3. **MERN stack infrastructure**: Full-stack connection through React (Vite) and Node Express APIs communicating directly with MongoDB.

---

## Workspace Setup

### 1. MongoDB Database
Ensure your MongoDB instance is running locally on the default port:
`mongodb://127.0.0.1:27017`
Or specify a customized connection URI inside `/backend/.env`.

### 2. Installations & Startup
Before running, ensure dependencies are created. Run from the project root:

**Start Backend Server:**
```bash
cd backend
npm install
npm run dev
```
Starts Express API server on `http://localhost:5000`.

**Start Frontend Server:**
```bash
cd frontend
npm install
npm run dev
```
Starts development web-server on `http://localhost:5173` (or available local port).

---

## Directory & Route Configurations

### API Endpoints
- `GET /api/profiles` - Fetch all saved user profiles
- `GET /api/profiles/:id` - Fetch details for a specific profile ID
- `POST /api/profiles` - Register a new profile (JSON body fields `name`, `email`, `phone`, `role`, `bio`, `color`)
- `PUT /api/profiles/:id` - Modify an existing profile details
- `DELETE /api/profiles/:id` - Remove a profile from database
