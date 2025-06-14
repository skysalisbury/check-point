import { useState } from 'react';
import { searchRawgGames, create } from '../../services/gameService';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(evt) {
    evt.preventDefault();
    setLoading(true);
    setError('');
    try {
      const rawgResults = await searchRawgGames(query);
      setResults(rawgResults);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddGame(game) {
    const gameData = {
      rawgId: game.id,
      slug: game.slug,
      name: game.name,
      description: game.description_raw || game.description || '',
      background_image: game.background_image,
      released: game.released,
      website: game.website,
      rating: game.rating,
      metacritic: game.metacritic,
      genres: game.genres?.map((g) => g.name) || [],
      platforms: game.platforms?.map((p) => p.platform.name) || [],
      esrb_rating: game.esrb_rating?.name || 'Not Rated',
    };

    try {
      await create(gameData);
      alert(`✅ "${game.name}" added to your database!`);
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to add "${game.name}".`);
    }
  }
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Search Games</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a game..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <ul style={{ marginTop: '1rem' }}>
        {results.map((game) => (
          <li key={game.id} style={{ marginBottom: '2rem' }}>
            <h3>
              {game.name} ({game.released || 'N/A'})
            </h3>
            {game.background_image && (
              <img
                src={game.background_image}
                alt={game.name}
                style={{
                  width: '200px',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                }}
              />
            )}
            <br />
            <button onClick={() => handleAddGame(game)}>Add to DB</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
