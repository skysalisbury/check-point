require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const Game = require('../models/game'); // Adjust path if needed

const BASE_URL = 'https://api.rawg.io/api';

async function seedGames() {
  await mongoose.connect(process.env.MONGODB_URI);
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in .env');
  }
  console.log('Connected to MongoDB...');

  try {
    const res = await fetch(
      `${BASE_URL}/games?key=${process.env.RAWG_API_KEY}&tags=singleplayer&publishers=nintendo,sony-interactive-entertainment,ubisoft,ea,rockstar-games,capcom,activision&page_size=50&ordering=-rating`
    );
    const { results } = await res.json();

    for (let game of results) {
      const detailedRes = await fetch(
        `${BASE_URL}/games/${game.id}?key=${process.env.RAWG_API_KEY}`
      );
      const detailedData = await detailedRes.json();

      const existing = await Game.findOne({
        rawgId: detailedData.id.toString(),
      });
      if (existing) continue;

      await Game.create({
        rawgId: detailedData.id.toString(),
        title: detailedData.name,
        coverImage: detailedData.background_image,
        released: detailedData.released || 'N/A',
        genres: detailedData.genres?.map((g) => g.name) || [],
        platforms: detailedData.platforms?.map((p) => p.platform.name) || [],
        developers: detailedData.developers?.map((d) => d.name) || ['N/A'],
        publishers: detailedData.publishers?.map((p) => p.name) || ['N/A'],
        description:
          detailedData.description_raw || detailedData.description || '',
        reviews: [],
      });

      console.log(`Saved: ${detailedData.name}`);
    }
    console.log('Finished seeding top 50 games.');
  } catch (err) {
    console.error('Error seeding games:', err.message);
  } finally {
    mongoose.disconnect();
  }
}

seedGames();
