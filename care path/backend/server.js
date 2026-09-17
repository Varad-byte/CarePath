/**
 * ===============================================================
 * CAREPATH HEALTHCARE PORTAL — BACKEND REST API SERVER
 * ===============================================================
 * Dedicated backend server for user authentication, daily medical 
 * advices, habit tracking, health myths, and symptom triage checks.
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Path to persistent data storage
const DATA_FILE = path.join(__dirname, 'users.json');

// ==========================================
// MIDDLEWARE CONFIGURATION
// ==========================================

// Enable CORS so the frontend (Live Server, file://, or another port) can call this API
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Optionally serve frontend static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// Console Logger Middleware for incoming HTTP requests
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${req.method.padEnd(6)} ${req.url}`);
    next();
});

// ==========================================
// DATA PERSISTENCE HELPERS
// ==========================================

function loadUsers() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
            return [];
        }
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(fileContent || '[]');
    } catch (error) {
        console.error('⚠️ Error reading users.json database:', error.message);
        return [];
    }
}

function saveUsers(usersList) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(usersList, null, 2));
    } catch (error) {
        console.error('⚠️ Error saving to users.json database:', error.message);
    }
}

// In-memory cache synced with users.json
let users = loadUsers();

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

/**
 * @route   POST /api/signup
 * @desc    Registers a new user account with hashed password
 * @access  Public
 */
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate required fields
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: "Email and password are required!" 
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 2. Validate email structure
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({ 
                success: false, 
                error: "Please enter a valid email address!" 
            });
        }

        // 3. Validate password strength
        if (password.length < 4) {
            return res.status(400).json({ 
                success: false, 
                error: "Password must be at least 4 characters long!" 
            });
        }

        // 4. Check if user already exists
        const userExists = users.some(u => u.email.toLowerCase() === normalizedEmail);
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                error: "An account with this email already exists! Please log in." 
            });
        }

        // 5. Hash password with bcryptjs
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 6. Create user record
        const newUser = {
            id: Date.now().toString(),
            email: normalizedEmail,
            password: hashedPassword,
            habits: {},
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        console.log(`✨ [AUTH] New account created: ${normalizedEmail}`);

        return res.status(201).json({
            success: true,
            message: "User registered successfully! You can now log in.",
            user: { 
                id: newUser.id, 
                email: newUser.email 
            }
        });

    } catch (err) {
        console.error('Registration server error:', err);
        return res.status(500).json({ 
            success: false, 
            error: "Internal server error during registration." 
        });
    }
});

/**
 * @route   POST /api/login
 * @desc    Authenticates user and verifies password
 * @access  Public
 */
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: "Email and password are required!" 
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Find user by email
        const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                error: "User not found! Please check your email or sign up." 
            });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false, 
                error: "Wrong password! Please try again." 
            });
        }

        console.log(`🔑 [AUTH] User authenticated: ${normalizedEmail}`);

        return res.status(200).json({
            success: true,
            message: `Login successful! Welcome back, ${normalizedEmail.split('@')[0]}.`,
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (err) {
        console.error('Login server error:', err);
        return res.status(500).json({ 
            success: false, 
            error: "Internal server error during login." 
        });
    }
});

// ==========================================
// HEALTHCARE DATA & CLINICAL API ROUTES
// ==========================================

/**
 * @route   GET /api/advices
 * @desc    Fetches curated clinical & wellness tips
 */
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

    res.json({ success: true, count: advices.length, advices });
});

/**
 * @route   GET /api/myths
 * @desc    Fetches daily medical myths vs facts
 */
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

    res.json({ success: true, count: myths.length, myths });
});

/**
 * @route   POST /api/symptom-check
 * @desc    Triage assessment engine for symptoms
 */
app.post('/api/symptom-check', (req, res) => {
    const { symptoms = [], duration = "1-2 days" } = req.body;

    const criticalFlags = ["chest pain", "shortness of breath", "loss of consciousness", "severe trauma", "fever > 103"];
    const isEmergency = symptoms.some(sym => 
        criticalFlags.some(flag => sym.toLowerCase().includes(flag))
    );

    if (isEmergency) {
        return res.json({
            success: true,
            riskLevel: "Emergency / High",
            triageCode: "RED",
            recommendation: "Emergency symptoms detected. Seek immediate clinical emergency assistance."
        });
    }

    return res.json({
        success: true,
        riskLevel: "Low to Moderate",
        triageCode: "GREEN",
        recommendation: "Stay hydrated and monitor your vitals. Consult a doctor if condition persists."
    });
});

/**
 * @route   GET /api/health
 * @desc    Health check ping
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: "online",
        service: "CarePath Backend Server",
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🩺 CarePath Backend Server is running successfully!`);
    console.log(`🌐 Server Address   : http://localhost:${PORT}`);
    console.log(`📄 Frontend Preview : http://localhost:${PORT}/index.html`);
    console.log(`📁 User Database    : ${DATA_FILE}`);
    console.log(`======================================================\n`);
});
