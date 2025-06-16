async function toggleFavorite(req, res) {
  try {
    const user = await User.findById(req.user._id);
    const gameId = req.params.gameId;
    const index = user.favorites.indexOf(gameId);
    if (index === -1) {
      user.favorites.push(gameId);
    } else {
      user.favorites.splice(index, 1);
    }
    await user.save();
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle favorite' });
  }
}

async function getFavorites(req, res) {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
}
