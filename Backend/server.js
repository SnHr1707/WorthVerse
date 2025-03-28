// --- START OF FILE server.js ---
// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Add cookie-parser
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser()); // Use cookie-parser middleware

// MongoDB Connection
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, {
    dbName: 'User_Info'
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/user', userRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});