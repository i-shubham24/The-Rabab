import mongoose from 'mongoose';
import MenuItem from './server/models/MenuItem.js';
import { menuItems } from './client/src/data/menuData.js';
import env from './server/config/env.js';

const seedMenu = async () => {
  try {
    console.log('Connecting to MongoDB...', env.mongoUri);
    await mongoose.connect(env.mongoUri);
    console.log('Connected!');

    console.log('Deleting existing menu items...');
    await MenuItem.deleteMany({});

    console.log('Inserting default menu items...');
    // Map to remove the static 'id' and let mongo generate '_id'
    const seedData = menuItems.map(item => {
      const { id, ...rest } = item;
      return rest;
    });

    await MenuItem.insertMany(seedData);
    console.log(`Successfully seeded ${seedData.length} menu items!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding menu:', error);
    process.exit(1);
  }
};

seedMenu();
