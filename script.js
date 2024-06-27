const express = require('express');
const admin = require('firebase-admin');
const app = express();
const port = process.env.PORT || 3000;

const serviceAccount = require('./ac-monitoring-510cf-firebase-adminsdk-f0erk-d74390dd3e.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ac-monitoring-510cf-default-rtdb.firebaseio.com/'
});

const db = admin.database();

// Endpoint to serve initial sensor data
app.get('/data', (req, res) => {
  try {
    db.ref('/sens').once('value', (snapshot) => {
      const data = snapshot.val();
      res.json(data);
    });
  } catch (error) {
    console.error('Error fetching initial data:', error);
    res.status(500).send('Error fetching initial data');
  }
});

// Real-time listener for sensor data updates
db.ref('/sens').on('value', (snapshot) => {
  const data = snapshot.val();
  console.log('New sensor data:', data); 
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
