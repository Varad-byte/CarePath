# 🩺 CarePath Backend Server

This is the dedicated backend service for the CarePath Healthcare Web App.

---

## 📁 Files in this Folder

| File | Purpose |
| :--- | :--- |
| `server.js` | Express server handling Auth, Advices, Myths, and Symptoms |
| `package.json` | Project configuration and Node dependencies |
| `users.json` | Local persistent storage for registered users |
| `.env.example` | Environment variable template (default PORT=3000) |

---

## 🚀 Running the Server

### 1. Open Terminal in this `backend` folder
```bash
cd "care path/backend"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
npm start
```
*(or run `node server.js`)*

---

## 📡 Endpoints Overview

- `POST /api/signup` — Registers a user `{ email, password }`
- `POST /api/login` — Verifies password and logs in `{ email, password }`
- `GET /api/advices` — Returns list of health advice cards
- `GET /api/myths` — Returns list of myths vs facts
- `POST /api/symptom-check` — Triage analyzer for symptoms
- `GET /api/health` — Health check endpoint
