require('dotenv').config({ path: '../.env' });

// Import Mongoose and Game model
const mongoose = require('mongoose');
const Game = require('../models/game');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    const result = await Game.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} games.`);
  } catch (err) {
    console.error('❌ Error deleting games:', err);
  } finally {
    mongoose.connection.close();
  }
});
