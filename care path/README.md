# CarePath Healthcare Portal — Backend & Frontend Setup

This project contains the **CarePath** daily health advice portal and its companion Node.js Express backend.

---

## 📁 Project Structure

```text
care path/
├── auth-server.js     # Express backend server (authentication & health APIs)
├── package.json       # Node.js dependencies and run scripts
├── users.json         # Local persistent JSON database for users
├── index.html         # CarePath frontend UI (Bootstrap 5)
├── style.css          # Healthcare UI styling
└── script.js          # Frontend interactivity & backend API calls
```

---

## 🚀 How to Run the Backend Server

### 1. Prerequisites
Make sure **Node.js** is installed on your computer.
- Download & install from: [https://nodejs.org](https://nodejs.org) (LTS version recommended).
- Verify in your terminal / PowerShell:
  ```bash
  node -v
  npm -v
  ```

---

### 2. Install Dependencies
Open your terminal or PowerShell, navigate to the `care path` folder, and run:
```bash
cd "care path"
npm install
```
This will install `express`, `cors`, and `bcryptjs`.

---

### 3. Start the Server
Run:
```bash
npm start
```
*(or run directly: `node auth-server.js`)*

You will see:
```text
=========================================
🚀 CarePath Backend Server is running!
📡 URL: http://localhost:3000
🌐 Frontend accessible at: http://localhost:3000/index.html
=========================================
```

---

## 🌐 How to Use
1. Open your browser and go to: **[http://localhost:3000](http://localhost:3000)**
2. Click **Sign Up** in the top navigation bar to create an account.
3. Click **Log In** to test logging into your account.
4. Your user accounts are securely hashed using `bcryptjs` and saved to `users.json`.

---

## 📡 Available Backend API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/signup` | Register a new user (`email`, `password`) |
| `POST` | `/api/login` | Authenticate user credentials |
| `GET` | `/api/advices` | Retrieve curated daily health advice tips |
| `GET` | `/api/myths` | Retrieve medical myths vs facts |
| `POST` | `/api/symptom-check` | Smart symptom triage assessment |
| `GET` | `/api/health` | Server health check endpoint |
