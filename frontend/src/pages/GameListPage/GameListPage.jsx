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
    <div className="p-4">
     <h1 className="text-2xl font-bold mb-4">Game List</h1>
      <input
        type="text"
        placeholder="Search games by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mb-4 border rounded w-full bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />

      {filteredGames.length ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGames.map((game) => (
            <Link
              key={game._id}
              to={`/games/${game._id}`}
            >
              <article className="p-4 bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow hover:shadow-lg transition">
                <header>
                  <h2 className="text-lg font-semibold">{game.title}</h2>
                </header>
                {game.coverImage && (
                  <img
                    src={game.coverImage}
                    alt={`Cover for ${game.title}`}
                    className="w-full h-auto mt-2 rounded"
                  />
                )}
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-4">No Games Found</p>
      )}
    </div>
  );
}

