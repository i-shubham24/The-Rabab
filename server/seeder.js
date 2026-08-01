import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import MenuItem from './models/MenuItem.js';
import { menuItems } from './data/menu.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await MenuItem.deleteMany();
    await MenuItem.insertMany(menuItems);
    
    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await MenuItem.deleteMany();
    
    console.log('Data Destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
