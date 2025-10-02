const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'medilocker-secret-key-2024';

// Debug: Check if environment variables are loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded' : 'NOT LOADED');
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'Using default');

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB with better error handling
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not defined in .env file');
  console.log('Please check your .env file and make sure it contains:');
  console.log('MONGODB_URI=your_mongodb_connection_string_here');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas!'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('Please check your MongoDB connection string in the .env file');
});

// ================== SCHEMAS ==================

// User Schema for authentication
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Activity Schema for tracking user actions
const activitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    details: String,
    timestamp: { type: Date, default: Date.now }
});

// Old user data schema (for backward compatibility)
const userDataSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create models
const User = mongoose.model('User', userSchema);
const Activity = mongoose.model('Activity', activitySchema);
const UserData = mongoose.model('UserData', userDataSchema); // Old model for existing data

// ================== MIDDLEWARE ==================

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// ================== ROUTES ==================

// Test route
app.get('/', (req, res) => {
    res.json({ message: '🚀 Backend is running!' });
});

// ================== AUTHENTICATION ROUTES ==================

// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Create token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // Log registration activity
        await Activity.create({
            userId: newUser._id,
            action: 'REGISTRATION',
            details: `User ${name} registered successfully`
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id, email: user.email }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // Log login activity
        await Activity.create({
            userId: user._id,
            action: 'LOGIN',
            details: `User ${user.name} logged in`
        });

        res.json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Get user profile (protected route)
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get user activities (protected route)
app.get('/api/activities', authenticateToken, async (req, res) => {
    try {
        const activities = await Activity.find({ userId: req.user.userId })
            .sort({ timestamp: -1 })
            .limit(10);

        res.json({
            success: true,
            activities
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Log user activity (protected route)
app.post('/api/activities', authenticateToken, async (req, res) => {
    try {
        const { action, details } = req.body;

        const activity = new Activity({
            userId: req.user.userId,
            action,
            details
        });

        await activity.save();

        res.json({
            success: true,
            message: 'Activity logged successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ================== EXISTING ROUTES (for backward compatibility) ==================

// Get all user data (old route - for existing data)
app.get('/api/users', async (req, res) => {
    try {
        const users = await UserData.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new user data (old route - for existing data)
app.post('/api/users', async (req, res) => {
    try {
        const newUser = new UserData(req.body);
        await newUser.save();
        res.status(201).json({ 
            success: true, 
            message: 'User data saved successfully!',
            user: newUser 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Delete user by ID (old route)
app.delete('/api/users/:id', async (req, res) => {
    try {
        await UserData.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ================== PROTECTED USER ROUTES ==================

// Get all users (admin only - protected)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update user profile (protected)
app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { name },
            { new: true }
        ).select('-password');

        // Log profile update activity
        await Activity.create({
            userId: req.user.userId,
            action: 'PROFILE_UPDATE',
            details: `User updated profile information`
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🎯 Server running on http://localhost:${PORT}`);
    console.log(`🔐 Authentication system enabled`);
    console.log(`📊 Old user data routes preserved for compatibility`);
});