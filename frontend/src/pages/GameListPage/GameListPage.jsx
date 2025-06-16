import { useState, useEffect } from "react";
import { Link } from "react-router";
import * as gameService from '../../services/gameService';

export default function GameListPage(props) {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchGames() {
      const games = await gameService.index();
      setGames(games);
    }
    fetchGames();
  }, []);

  const filteredGames = games.filter(game =>
    game.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Game List Page</h1>

      {/* ✅ Search bar input */}
      <input
        type="text"
        placeholder="Search games by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', maxWidth: '400px', padding: '0.5rem', marginBottom: '1rem' }}
      />

      {filteredGames.length ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
          }}
        >
          {filteredGames.map((game) => (
            <Link
              key={game._id}
              to={`/games/${game._id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '5px',
                  width: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <header style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <h2>{game.title}</h2>
                </header>
                {game.coverImage && (
                  <img
                    src={game.coverImage}
                    alt={`Cover for ${game.title}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                      maxWidth: '180px',
                    }}
                  />
                )}
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <p>No Games Found</p>
      )}
    </div>
  );
}

