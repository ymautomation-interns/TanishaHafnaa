import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Role or occupation is required'],
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
    default: '',
  },
  color: {
    type: String,
    default: '#6366f1', // Default indigo color accent
  }
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', ProfileSchema);

export default Profile;
