const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files (HTML, CSS, JS) directly from this folder
app.use(express.static(__dirname));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Helper: Load users safely from JSON file
function loadUsers() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify([]));
            return [];
        }
        const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(fileData || '[]');
    } catch (err) {
        console.error('Error reading users file:', err);
        return [];
    }
}

// Helper: Save users to JSON file
function saveUsers(users) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error saving users file:', err);
    }
}

// In-memory cache synced with users.json
let users = loadUsers();

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

/**
 * POST /api/signup
 * Registers a new user with email and hashed password
 */
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required!" });
        }

        const cleanEmail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({ error: "Please enter a valid email address!" });
        }

        if (password.length < 4) {
            return res.status(400).json({ error: "Password must be at least 4 characters long!" });
        }

        // Check if user already exists
        const existingUser = users.find(u => u.email.toLowerCase() === cleanEmail);
        if (existingUser) {
            return res.status(400).json({ error: "Account already exists with this email! Please log in." });
        }

        // Hash the password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store new user
        const newUser = {
            id: Date.now(),
            email: cleanEmail,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        console.log(`✅ New user registered: ${cleanEmail}`);
        res.status(201).json({
            message: "User registered successfully! You can now log in.",
            user: { email: cleanEmail }
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Internal server error during registration." });
    }
});

/**
 * POST /api/login
 * Validates user credentials and logs them in
 */
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required!" });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Find user by email
        const user = users.find(u => u.email.toLowerCase() === cleanEmail);
        if (!user) {
            return res.status(400).json({ error: "User not found! Please check your email or sign up." });
        }

        // Compare password against stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Wrong password! Please try again." });
        }

        console.log(`🔓 User logged in: ${cleanEmail}`);
        res.json({
            message: `Login successful! Welcome back, ${cleanEmail.split('@')[0]}.`,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal server error during login." });
    }
});

// ==========================================
// 2. CAREPATH HEALTHCARE DATA ENDPOINTS
// ==========================================

// Daily Health Tips / Advices
app.get('/api/advices', (req, res) => {
    const advices = [
        {
            category: "🥗 Nutrition & Immunity",
            title: "Incorporate fermented foods to strengthen immune flora",
            description: "Over 70% of your immune defense resides in your gut microbiome. Eating yogurt, kefir, or kimchi regularly feeds beneficial bacteria that shield against seasonal illness."
        },
        {
            category: "🚶 Movement & Posture",
            title: "Take a 2-minute posture reset for every hour of sitting",
            description: "Prolonged sitting doubles lower spinal pressure and strains neck muscles. Stand, roll your shoulders back, and take deep diaphragmatic breaths to restore disc circulation."
        },
        {
            category: "😴 Sleep & Recovery",
            title: "Dim bright blue screens 45 minutes before sleep",
            description: "Blue light delays natural melatonin secretion in the brain. Switching to warm ambient lighting before bed promotes deeper, restorative REM cycles."
        },
        {
            category: "❤️ Cardio Vitality",
            title: "A 10-minute walk after meals helps stabilize glucose",
            description: "Light muscular movement immediately after eating improves glucose uptake and prevents mid-afternoon energy crashes."
        },
        {
            category: "🧠 Stress & Focus",
            title: "Micro-breaks reduce cortisol spikes during intense work",
            description: "Stepping away from work for just 3 minutes every 90 minutes prevents mental fatigue and maintains steady baseline dopamine levels."
        }
    ];
    res.json({ count: advices.length, advices });
});

// Health Myths vs Facts
app.get('/api/myths', (req, res) => {
    const myths = [
        {
            myth: "Antibiotics can cure the common cold and influenza.",
            fact: "Colds and influenza are caused by viruses, not bacteria. Antibiotics only treat bacterial infections and have no effect against viral illnesses."
        },
        {
            myth: "You only need sunscreen on bright sunny summer days.",
            fact: "Up to 80% of harmful UV rays penetrate cloud cover and windows year-round. Daily SPF protects against skin aging and cellular damage."
        },
        {
            myth: "Cracking your knuckle joints causes arthritis.",
            fact: "Knuckle cracking is just dissolved nitrogen bubbles popping in joint fluid. Medical studies confirm it does not cause arthritis."
        },
        {
            myth: "Drinking fruit juice is just as healthy as eating whole fruit.",
            fact: "Juice strips out dietary fiber and concentrates sugars, causing rapid insulin spikes. Whole fruit provides steady energy and digestion benefits."
        }
    ];
    res.json({ count: myths.length, myths });
});

// Smart Symptom Checker Triage API
app.post('/api/symptom-check', (req, res) => {
    const { symptoms = [], duration = "1-2 days" } = req.body;

    const criticalFlags = ["chest pain", "shortness of breath", "unconscious", "high fever > 103"];
    const hasEmergency = symptoms.some(s => criticalFlags.some(flag => s.toLowerCase().includes(flag)));

    if (hasEmergency) {
        return res.json({
            riskLevel: "Emergency / High",
            recommendation: "Please seek immediate emergency medical care or call 911 / your local helpline.",
            triageCode: "RED"
        });
    }

    res.json({
        riskLevel: "Mild to Moderate",
        recommendation: "Stay hydrated, rest, and monitor your symptoms. Consult a physician if symptoms persist beyond 3 days.",
        triageCode: "GREEN"
    });
});

// Health Check API
app.get('/api/health', (req, res) => {
    res.json({ status: "healthy", service: "CarePath Backend Server", timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 CarePath Backend Server is running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🌐 Frontend accessible at: http://localhost:${PORT}/index.html`);
    console.log(`=========================================`);
});