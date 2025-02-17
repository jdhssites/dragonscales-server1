const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Path to our storage file (for simplicity, we use a JSON file)
const storageFile = path.join(__dirname, 'storage.json');

// Middleware to parse JSON bodies and serve static files from "public"
app.use(express.json());
app.use(express.static('public'));

// Ensure the storage file exists
if (!fs.existsSync(storageFile)) {
  fs.writeFileSync(storageFile, JSON.stringify({
    preferences: {},
    staffContent: '',
    sessions: {} // Simple object to store login sessions by token
  }, null, 2));
}

/* ---------------------------
   API Endpoint: Login
--------------------------- */
app.post('/api/login', (req, res) => {
  const username = req.body.username ? req.body.username.trim() : '';
  const password = req.body.password ? req.body.password.trim() : '';
  console.log("Received login credentials:", username, password);
  if (username === 'admin' && password === 'password') {
    const token = 'dummy-token-123';
    res.json({ success: true, token });
  } else {
    console.log("Invalid credentials provided");
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});


/* ---------------------------
   API Endpoint: Preferences
--------------------------- */
// Get user preferences
app.get('/api/preferences', (req, res) => {
  let storageData = JSON.parse(fs.readFileSync(storageFile, 'utf8'));
  res.json(storageData.preferences || {});
});

// Update user preferences
app.post('/api/preferences', (req, res) => {
  const newPrefs = req.body; // e.g., { textColor: "red", theme: "dark" }
  let storageData = JSON.parse(fs.readFileSync(storageFile, 'utf8'));
  storageData.preferences = { ...storageData.preferences, ...newPrefs };
  fs.writeFileSync(storageFile, JSON.stringify(storageData, null, 2));
  res.json({ message: 'Preferences updated successfully!' });
});

/* ---------------------------
   API Endpoint: Staff Content
--------------------------- */
// Get staff editable content
app.get('/api/staff-content', (req, res) => {
  let storageData = JSON.parse(fs.readFileSync(storageFile, 'utf8'));
  res.json({ staffContent: storageData.staffContent || '' });
});

// Update staff editable content
app.post('/api/staff-content', (req, res) => {
  // (In a real application, you would check the Authorization header and verify the token)
  const { content } = req.body;
  let storageData = JSON.parse(fs.readFileSync(storageFile, 'utf8'));
  storageData.staffContent = content;
  fs.writeFileSync(storageFile, JSON.stringify(storageData, null, 2));
  res.json({ message: 'Staff content updated successfully!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
