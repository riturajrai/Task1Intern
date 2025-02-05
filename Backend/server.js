require('dotenv').config();  // Import dotenvconst compression = require('compression');


const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 5000;  // Use PORT from .env, or default to 5000

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors());

// Create a MySQL connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database');
});

// WebSocket server setup
const wss = new WebSocket.Server({ port: 5173 });  // WebSocket on port 5173

wss.on('connection', (ws) => {
  console.log('A new WebSocket client connected');
  
  // Handle messages from the client
  ws.on('message', (message) => {
    console.log('Received from client: %s', message);
  });
 
  // Send a message to the client when they connect
  ws.send('Welcome to the WebSocket server!');
});

// Route to handle form submission (for example, a contact form)
app.post('/submit', (req, res) => {
  const { name, email, phone, message } = req.body;

  // Check if the form data is valid
  if (!name || !email || !message) {
    return res.status(400).send('Name, email, and message are required');
  }

  // SQL query to insert data into the database
  const query = 'INSERT INTO contact_form_data (name, email, phone, message) VALUES (?, ?, ?, ?)';
  
  db.query(query, [name, email, phone, message], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error saving data to the database');
    }
    res.status(200).send('Form data saved successfully');
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
