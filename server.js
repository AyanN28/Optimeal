const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files from root

const upload = multer({ dest: 'uploads/' });

// In-memory "database"
let userProfile = null;

// POST /api/profile
app.post('/api/profile', (req, res) => {
    userProfile = req.body;
    res.json({ success: true, message: 'Profile saved securely to server' });
});

// GET /api/profile
app.get('/api/profile', (req, res) => {
    res.json(userProfile || {});
});

// POST /api/plan
app.post('/api/plan', (req, res) => {
    const profile = req.body;
    const dietText = profile.diet && profile.diet !== 'omnivore' ? `${profile.diet} ` : '';
    const allergenAlert = profile.allergies && profile.allergies.length ? `[No ${profile.allergies.join(', ')}] ` : '';
    const goal = profile.goal ? profile.goal.replace('_', ' ') : 'wellness';

    const plan = `Based on your profile, here is your ${allergenAlert}safe ${dietText}meal plan for ${goal}:\n\n` +
    `🍳 Breakfast: Oatmeal with berries and a side of scrambled egg whites.\n\n` +
    `🥗 Lunch: Quinoa salad with grilled tofu/chicken, leafy greens, and olive oil dressing.\n\n` +
    `🍎 Snack: Greek yogurt or a handful of seeds.\n\n` +
    `🍽️ Dinner: Steamed broccoli, sweet potato, and baked salmon/tempeh.\n\n` +
    `💧 Hydration: Aim for at least 2.5L of water today.\n\n` +
    `⚡ Lifestyle: Include a 30-minute brisk walk.`;
    
    // Simulate API delay
    setTimeout(() => res.json({ plan }), 1500);
});

// POST /api/chat
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    const reply = `🤖 As your medical-aware nutrition guide: I've processed your query "${message}". I recommend focusing on whole foods with a low glycemic index. Always ensure it aligns with your specific health conditions.`;
    setTimeout(() => res.json({ reply }), 1000);
});

// POST /api/vision
app.post('/api/vision', upload.single('image'), (req, res) => {
    const score = Math.floor(Math.random() * 40) + 50;
    const html = `
        <div style="font-size: 3rem; font-weight: bold; color: ${score > 75 ? 'var(--primary)' : 'var(--warning)'}">${score}/100</div>
        <div class="badge">Health Score</div>
        <p style="margin-top: 1rem; font-size: 0.9rem; text-align: left;">
            <strong>Analysis:</strong> Contains moderate sodium. Good source of protein.<br>
            <strong>Alternative:</strong> Choose the grilled option instead of fried to save 200 calories and reduce unhealthy fats.
        </p>
    `;
    setTimeout(() => res.json({ html }), 2000);
});

// GET /api/places
app.get('/api/places', (req, res) => {
    const html = `
        <strong>📍 Found nearby:</strong><br><br>
        1. <strong>Green Bowl Cafe</strong> (4.8 ⭐)<br>
        <small>1.2 km away • <span style="color:var(--primary)">Matches your diet</span></small><br><br>
        2. <strong>The Clean Plate</strong> (4.5 ⭐)<br>
        <small>2.0 km away • <span style="color:var(--primary)">Healthy options</span></small>
    `;
    setTimeout(() => res.json({ html }), 1500);
});

// GET /api/calendar
app.get('/api/calendar', (req, res) => {
    const html = `
        <strong>📅 Today's Schedule:</strong><br>
        Busy from 12 PM - 3 PM.<br><br>
        <strong>💡 Suggestion:</strong> Prepare a quick 5-minute wrap for lunch before your meetings start. Plan a full, relaxed meal for dinner.
    `;
    setTimeout(() => res.json({ html }), 1200);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
