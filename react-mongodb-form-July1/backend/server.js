import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Profile from './models/Profile.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FALLBACK_DB_PATH = path.join(__dirname, 'profiles-db.json');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// State for db status
let isMongoConnected = false;

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/profiledb';
console.log('Connecting to MongoDB...');

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000 // 5 seconds timeout before failing
})
.then(() => {
  isMongoConnected = true;
  console.log('✨ Successfully connected to MongoDB Database.');
})
.catch((err) => {
  isMongoConnected = false;
  console.warn('⚠️ MongoDB connection failed. MongoDB is likely not installed or running locally.');
  console.warn(`⚠️ FALLBACK: Automatically utilizing local file database: ${FALLBACK_DB_PATH}`);
  
  // Initialize fallback DB file if not exists
  if (!fs.existsSync(FALLBACK_DB_PATH)) {
    fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify([], null, 2));
  }
});

// Helper for local JSON Database CRUD
const readLocalDB = () => {
  try {
    if (!fs.existsSync(FALLBACK_DB_PATH)) {
      return [];
    }
    const data = fs.readFileSync(FALLBACK_DB_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading local JSON file:', error);
    return [];
  }
};

const writeLocalDB = (data) => {
  try {
    fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to local JSON file:', error);
  }
};

// --- API ROUTES ---

// 1. GET ALL PROFILES
app.get('/api/profiles', async (req, res) => {
  if (isMongoConnected) {
    try {
      const profiles = await Profile.find().sort({ createdAt: -1 });
      return res.status(200).json(profiles);
    } catch (error) {
      return res.status(500).json({ message: 'Error retrieving profiles from MongoDB', error: error.message });
    }
  } else {
    // Fallback JSON-file retrieval
    const profiles = readLocalDB();
    // Sort by createdAt descending
    const sorted = [...profiles].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.status(200).json(sorted);
  }
});

// 2. GET SINGLE PROFILE
app.get('/api/profiles/:id', async (req, res) => {
  const { id } = req.params;
  if (isMongoConnected) {
    try {
      const profile = await Profile.findById(id);
      if (!profile) return res.status(404).json({ message: 'Profile not found' });
      return res.status(200).json(profile);
    } catch (error) {
      return res.status(500).json({ message: 'Error retrieving profile', error: error.message });
    }
  } else {
    const profiles = readLocalDB();
    const profile = profiles.find(p => p._id === id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    return res.status(200).json(profile);
  }
});

// 3. CREATE PROFILE
app.post('/api/profiles', async (req, res) => {
  try {
    const { name, email, phone, role, bio, color } = req.body;
    
    if (!name || !email || !phone || !role) {
      return res.status(400).json({ message: 'Name, email, phone, and role are required fields.' });
    }

    if (isMongoConnected) {
      const newProfile = new Profile({
        name,
        email,
        phone,
        role,
        bio: bio || '',
        color: color || '#6366f1'
      });
      const savedProfile = await newProfile.save();
      return res.status(201).json(savedProfile);
    } else {
      // Local Database flow
      const profiles = readLocalDB();
      const newProfile = {
        _id: 'local_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now(),
        name,
        email,
        phone,
        role,
        bio: bio || '',
        color: color || '#6366f1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      profiles.push(newProfile);
      writeLocalDB(profiles);
      return res.status(201).json(newProfile);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create profile', error: error.message });
  }
});

// 4. UPDATE PROFILE
app.put('/api/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, bio, color } = req.body;

    if (!name || !email || !phone || !role) {
      return res.status(400).json({ message: 'Name, email, phone, and role are required fields.' });
    }

    if (isMongoConnected) {
      const updatedProfile = await Profile.findByIdAndUpdate(
        id,
        { name, email, phone, role, bio, color },
        { new: true, runValidators: true }
      );
      if (!updatedProfile) return res.status(404).json({ message: 'Profile not found.' });
      return res.status(200).json(updatedProfile);
    } else {
      // Local Database flow
      const profiles = readLocalDB();
      const index = profiles.findIndex(p => p._id === id);
      if (index === -1) return res.status(404).json({ message: 'Profile not found.' });

      const updatedProfile = {
        ...profiles[index],
        name,
        email,
        phone,
        role,
        bio: bio || '',
        color: color || '#6366f1',
        updatedAt: new Date().toISOString()
      };
      
      profiles[index] = updatedProfile;
      writeLocalDB(profiles);
      return res.status(200).json(updatedProfile);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// 5. DELETE PROFILE
app.delete('/api/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const deletedProfile = await Profile.findByIdAndDelete(id);
      if (!deletedProfile) return res.status(404).json({ message: 'Profile not found.' });
      return res.status(200).json({ message: 'Profile deleted successfully', id });
    } else {
      const profiles = readLocalDB();
      const filtered = profiles.filter(p => p._id !== id);
      if (profiles.length === filtered.length) {
        return res.status(404).json({ message: 'Profile not found.' });
      }
      writeLocalDB(filtered);
      return res.status(200).json({ message: 'Profile deleted successfully', id });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete profile', error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Express server running on port ${PORT}`);
});
