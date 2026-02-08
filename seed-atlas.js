require('dotenv').config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const ownerSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
  tokenVersion: { type: Number, default: 0 }
});

const Owner = mongoose.model('Owner', ownerSchema);

async function seedDatabase() {
  try {
    // Use MongoDB Atlas connection string from environment
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://school_admin:884800@cluster0.rqnm77d.mongodb.net/school_erp?retryWrites=true&w=majority';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing owners
    await Owner.deleteMany({});
    console.log('✅ Cleared existing owners');

    // Create owner account
    const hashedPassword = await bcryptjs.hash('ChangeMe123!', 10);
    
    const owner = new Owner({
      email: 'owner@school.local',
      passwordHash: hashedPassword,
      tokenVersion: 0
    });

    await owner.save();
    console.log('✅ Owner account created successfully!');
    console.log('   Email: owner@school.local');
    console.log('   Password: ChangeMe123!');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
