const User = require('../models/user');
const Game = require('../models/game');

module.exports = {
  getCurrentUser,
  toggleFavorite,
};

// GET /api/users/me
async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
}

async function toggleFavorite(req, res) {
  try {
    const user = await User.findById(req.user._id);
    const gameId = req.params.gameId;

    const index = user.favorites.findIndex((fav) => fav.toString() === gameId);

    if (index > -1) {
      user.favorites.splice(index, 1); // remove from favorites
    } else {
      user.favorites.push(gameId); // add to favorites
    }

    await user.save();
    await user.populate('favorites');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to toggle favorite' });
  }
}
