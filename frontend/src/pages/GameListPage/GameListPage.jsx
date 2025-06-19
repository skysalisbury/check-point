import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'; 
import * as gameService from '../../services/gameService';

export default function GameListPage() {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchGames() {
      const data = await gameService.index();
      setGames(data);
    }
    fetchGames();
  }, []);

  const filteredGames = games.filter((g) =>
    g.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-neutral-900 pt-8 pb-16">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-6 text-2xl font-bold text-gray-100">Game List</h1>

        <form className="relative flex items-center">
          <MagnifyingGlassIcon
            className="pointer-events-none absolute left-4 h-5 w-5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search games by name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full rounded-full bg-neutral-800 pl-12 pr-4 py-3
              text-gray-100 placeholder-gray-500
              border border-neutral-700 focus:border-emerald-500
              focus:ring-2 focus:ring-emerald-500/50
              shadow-lg shadow-black/30 transition
            "
          />
        </form>
      </div>

      <ul
        className="
          mx-auto mt-10 grid max-w-6xl gap-6 px-4
          sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
        "
      >
        {filteredGames.length ? (
          filteredGames.map((game) => (
            <li key={game._id} className="group">
              <Link to={`/games/${game._id}`}>
                <div
                  className="
                    overflow-hidden rounded-md bg-neutral-800 transition
                    group-hover:-translate-y-1
                    group-hover:shadow-lg group-hover:shadow-emerald-500/30
                  "
                >
                  {game.coverImage && (
                    <img
                      src={game.coverImage}
                      alt={`Cover for ${game.title}`}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <div className="p-3">
                    <h2 className="truncate text-gray-100 group-hover:text-emerald-400">
                      {game.title}
                    </h2>

                  </div>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <p className="px-4 text-gray-400">No Games Found</p>
        )}
      </ul>
    </section>
  );
}