const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Create admin user data
const adminUser = {
  name: 'Admin User',
  email: 'admin@makeupstudio.com',
  password: 'admin123',
  role: 'admin'
};

// Import data
const importData = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      await User.create(adminUser);
      console.log('Admin user created');
    }
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete data
const destroyData = async () => {
  try {
    // Only delete the admin user for safety
    await User.deleteOne({ email: adminUser.email });
    console.log('Admin user removed');
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Determine which action to take
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 