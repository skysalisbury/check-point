const BASE_URL = 'https://api.rawg.io/api';

module.exports = {
  searchGames,
  getGameDetails,
};

async function searchGames(req, res) {
  try {
    const query = req.query.query;
    const response = await fetch(
      `${BASE_URL}/games?key=${process.env.RAWG_API_KEY}&search=${query}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching from RAWG:', err);
    res.status(500).json({ message: 'Failed to fetch games from RAWG' });
  }
}

async function getGameDetails(req, res) {
  try {
    const { id } = req.params;
    const response = await fetch(
      `${BASE_URL}/games/${id}?key=${process.env.RAWG_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching game details from RAWG:', err);
    res.status(500).json({ message: 'Failed to fetch game details from RAWG' });
  }
}
