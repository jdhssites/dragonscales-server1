const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Dummy login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log("Received credentials:", username, password);
  if (username.trim() === 'admin' && password.trim() === 'password') {
    const token = 'dummy-token-123';
    console.log("Login success. Sending token.");
    return res.json({ success: true, token });
  } else {
    console.log("Invalid credentials provided.");
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
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
