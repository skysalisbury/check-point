import { useState } from 'react';
import { useNavigate, Link } from 'react-router'; 
import { searchRawgGames, create } from '../../services/gameService';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  async function handleSearch(evt) {
    evt.preventDefault();
    setLoading(true);
    setError('');
    try {
      const rawgResults = await searchRawgGames(query);
      setResults(rawgResults);
    } catch {
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
      alert(`✅ “${game.name}” added to your database!`);
      navigate('/games'); 
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to add “${game.name}”.`);
    }
  }

  return (
    <section className="min-h-screen bg-neutral-900 pt-8 pb-16">

      <div className="mx-auto max-w-4xl px-4">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-4 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search games…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
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

      <div className="mx-auto max-w-4xl px-4">
        {loading && <p className="mt-6 text-gray-400">Loading…</p>}
        {error && <p className="mt-6 text-red-500">{error}</p>}
      </div>

      <ul
        className="mx-auto mt-10 grid max-w-6xl gap-6 px-4
                   sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {results.map((game) => (
          <li key={game.id} className="group">
            <div 
              className="overflow-hidden rounded-md bg-neutral-800 transition
               group-hover:-translate-y-1
               group-hover:shadow-lg group-hover:shadow-emerald-500/30"
            >
              <Link to={`/games/${game.id}`}>
                {game.background_image && (
                  <img
                    src={game.background_image}
                    alt={game.name}
                    className="h-48 w-full object-cover"
                  />
                )}
              </Link>

              <div className="p-3">
                <Link
                  to={`/games/${game.id}`}
                  className="truncate text-gray-100 group-hover:text-emerald-400"
                >
                  {game.name}
                </Link>
                <p className="mt-1 text-sm text-gray-400">
                  {game.released?.slice(0, 4) ?? 'TBA'}
                </p>

                <button
                  type="button"
                  onClick={async () => {
                    await handleAddGame(game); 
                  }}
                  className="mt-3 w-full rounded-md bg-emerald-600 py-1.5 text-sm
                   font-medium text-white transition hover:bg-emerald-500"
                >
                  Add to Games List
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
