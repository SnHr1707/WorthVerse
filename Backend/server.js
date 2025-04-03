// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Removed bodyParser as express.json/urlencoded cover it
const cookieParser = require('cookie-parser');
const path = require('path'); // Import path module
const multer = require('multer'); // Import multer for error handling

// Import Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const jobRoutes = require('./routes/jobRoutes');
const postRoutes = require('./routes/postRoutes');
const settingsRoutes = require('./routes/settingsRoutes'); // <-- Import Settings Routes

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend origin
    credentials: true
}));

// Increase payload size limit for JSON (if needed, e.g., for large text posts)
app.use(express.json({ limit: '10mb' }));
// Increase payload size limit for URL-encoded data (used by forms, less common for APIs)
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());

// --- Serve Static Files (Uploaded Images) ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI, {
    dbName: 'User_Info' // Specify your database name here
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/user', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/settings', settingsRoutes); // <-- Mount Settings Routes

// Basic Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    // Handle specific errors like MulterError
    if (err instanceof multer.MulterError) { // Make sure multer is imported
        return res.status(400).json({ message: `File upload error: ${err.message}` });
    } else if (err.message === 'Not an image! Please upload only images.') {
         return res.status(400).json({ message: err.message });
    }
    // Default error response
    res.status(err.status || 500).json({ message: err.message || 'Something went wrong on the server!' });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Serving uploads from: ${path.join(__dirname, 'uploads')}`);
    console.log(`Access uploads via: http://localhost:${port}/uploads/<filename>`);
});