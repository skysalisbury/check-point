const Game = require('../models/game');
const fetch = require('node-fetch');
const BASE_URL = 'https://api.rawg.io/api';

module.exports = {
  index,
  show,
  create,
  updateGame,
  deleteGame,
};

async function index(req, res) {
  try {
    const games = await Game.find({});
    res.json(games);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch Game' });
  }
}

async function create(req, res) {
  try {
    const rawgId = req.body.rawgId.toString();
    const existing = await Game.findOne({ rawgId });
    if (existing) return res.json(existing);

    const response = await fetch(
      `${BASE_URL}/games/${rawgId}?key=${process.env.RAWG_API_KEY}`
    );
    const data = await response.json();

    const newGame = await Game.create({
      rawgId: data.id.toString(),
      title: data.name,
      coverImage: data.background_image,
      genres: data.genres?.map((g) => g.name) || [],
      platforms: data.platforms?.map((p) => p.platform.name) || [],
      released: data.released,
      developers: data.developers?.map((d) => d.name) || [],
      publishers: data.publishers?.map((p) => p.name) || [],
      description: data.description_raw || '',
      reviews: [],
    });
    res.json(newGame);
  } catch (err) {
    console.error('Failed to create game from RAWG', err);
    res.status(400).json({ message: 'Failed to create game' });
  }
}

async function show(req, res) {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateGame(req, res) {
  try {
    console.log('Incoming update payload:', req.body);
    const updatedGame = await Game.findByIdAndUpdate(
      req.params.gameId,
      req.body,
      { new: true, runValidators: true }
    );
    console.log('Updated game:', updatedGame);

    if (!updatedGame) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(updatedGame);
  } catch (err) {
    console.error('Update error:', err);
    res.status(400).json({ message: 'Failed to update game' });
  }
}

async function deleteGame(req, res) {
  try {
    await Game.findByIdAndDelete(req.params.gameId);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
