// Backend/server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const profileRoutes = require('./routes/profileRoutes'); // Import profile routes  <--- Add this

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, {
    dbName: 'User_Info' // Keep dbName if needed
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


// Mount auth routes under /api path
app.use('/api/auth', authRoutes); // Mount auth routes under /api/auth
app.use('/api/profile', profileRoutes); // Mount profile routes under /api/profile  <--- Add this

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});