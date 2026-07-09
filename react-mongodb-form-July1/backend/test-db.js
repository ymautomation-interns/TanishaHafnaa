import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing connection to URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 8000
})
.then(() => {
  console.log('✅ Connection Test SUCCESSFUL!');
  process.exit(0);
})
.catch((err) => {
  console.error('❌ Connection Test FAILED with error:');
  console.error(err);
  process.exit(1);
});
