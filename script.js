// Auth Check: Redirect to login if no user is found
if (!localStorage.getItem('carepath_user')) {
    window.location.href = 'login.html';
}

function handleLogout() {
    localStorage.removeItem('carepath_user');
    window.location.href = 'login.html';
}

const dateOptions = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
const todayFormatted = new Date().toLocaleDateString('en-US', dateOptions);

const currentDateEl = document.getElementById('currentDateDisplay');
if (currentDateEl) {
    currentDateEl.innerText = todayFormatted;
}



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

let currentAdviceIdx = 0;

function nextAdvice() {
    currentAdviceIdx = (currentAdviceIdx + 1) % advices.length;
    const item = advices[currentAdviceIdx];

    document.getElementById('adviceCategory').innerText = item.category;
    document.getElementById('adviceTitle').innerText = item.title;
    document.getElementById('adviceDescription').innerText = item.description;
    document.getElementById('adviceCounter').innerText = `Tip ${currentAdviceIdx + 1} of ${advices.length}`;
}

function copyTip() {
    const title = document.getElementById('adviceTitle').innerText;
    navigator.clipboard.writeText(title + " — CarePath Daily Health");
    alert('Tip copied to clipboard!');
}




function updateHabits() {
    const checkboxes = document.querySelectorAll('.habit-check');
    let completed = 0;
    checkboxes.forEach((cb, idx) => {
        if (cb.checked) completed++;
        localStorage.setItem('carepath_habit_item_' + idx, cb.checked);
    });

    const label = document.getElementById('habitProgressLabel');
    if (label) {
        label.innerText = `${completed} of ${checkboxes.length} done`;
    }
}

function restoreHabits() {
    const checkboxes = document.querySelectorAll('.habit-check');
    checkboxes.forEach((cb, idx) => {
        if (localStorage.getItem('carepath_habit_item_' + idx) === 'true') {
            cb.checked = true;
        }
    });
    updateHabits();
}





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

let currentMythIdx = 0;

function nextMyth() {
    currentMythIdx = (currentMythIdx + 1) % myths.length;
    document.getElementById('mythText').innerText = `"${myths[currentMythIdx].myth}"`;
    document.getElementById('factText').innerText = myths[currentMythIdx].fact;
}





window.addEventListener('DOMContentLoaded', () => {
    restoreHabits();

    const loggedInUser = localStorage.getItem('carepath_user');
    if (loggedInUser) {
        const authBtn = document.getElementById('authNavBtn');
        if (authBtn) authBtn.innerText = `👤 ${loggedInUser.split('@')[0]}`;
    }
});




// backend: sign in (login) , sign up



// Backend Server URL
const BACKEND_URL = 'http://localhost:3000';

// Redirect to auth page
function handleSignup() {
    window.location.href = 'auth.html';
}

function handleLogin() {
    window.location.href = 'auth.html';
}