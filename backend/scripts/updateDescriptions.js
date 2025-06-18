require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const fetch = require('node-fetch'); // npm i node-fetch@2
const Game = require('../models/game'); // ← adjust if path differs

const RAWG_BASE = 'https://api.rawg.io/api';

(async function updateDescriptions() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI missing');
  if (!process.env.RAWG_API_KEY) throw new Error('RAWG_API_KEY missing');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // 1. find games with empty or missing description
  const cursor = Game.find({
    $or: [{ description: { $exists: false } }, { description: '' }],
  }).cursor();

  let updated = 0;
  for await (const game of cursor) {
    try {
      const rawgUrl = `${RAWG_BASE}/games/${game.rawgId}?key=${process.env.RAWG_API_KEY}`;
      const res = await fetch(rawgUrl);
      if (!res.ok) throw new Error(`RAWG fetch ${res.status}`);
      const data = await res.json();

      const newDesc = data.description_raw || data.description || '';
      if (!newDesc) {
        console.log(`ℹ️  No description for ${game.title}`);
        continue;
      }

      game.description = newDesc;
      await game.save();
      updated += 1;
      console.log(`✏️  Updated: ${game.title}`);
    } catch (err) {
      console.error(`⚠️  ${game.title} – ${err.message}`);
    }
  }

  console.log(`\n🎉 Done. Descriptions added to ${updated} game(s).`);
  mongoose.disconnect();
})();
