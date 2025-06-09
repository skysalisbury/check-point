const Game = require('../models/game');

module.exports = {
  index,
  show,
  create,
  update,
  deleteGame,
};

async function index(req, res) {
  try {
    const games = await Game.find({});
    // Below would return all posts for just the logged in user
    // const posts = await Post.find({author: req.user._id});
    res.json(games);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch Game' });
  }
}

async function create(req, res) {
  try {
    const game = await Game.create(req.body);
    res.json(game);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failed to fetch Games' });
  }
}

async function show(req, res) {
  try {
    const game = await Game.findById(req.params.id).populate('reviews');
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function update(req, res) {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(game);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function deleteGame(req, res) {
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
