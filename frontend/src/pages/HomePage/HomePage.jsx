import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import * as gameService from '../../services/gameService';

function tokenExists() {
  const t = localStorage.getItem('token');
  if (!t) return false;
  try {
    const { exp } = JSON.parse(atob(t.split('.')[1]));
    return Date.now() < exp * 1000;
  } catch {
    return false; 
  }
}

export default function HomePage({ user }) {
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const location   = useLocation();
  const navigate   = useNavigate();
  const authed     = !!user || tokenExists(); 

  useEffect(() => {
    if (!authed) return;
    const redirect = new URLSearchParams(location.search).get('redirect');
    if (redirect) navigate(redirect, { replace: true });
  }, [authed, location, navigate]);

  useEffect(() => {
    (async () => {
      try {
        const all = await gameService.index();
        setRecent(
          [...all]
            .sort(
              (a, b) =>
                new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id)
            )
            .slice(0, 3)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="min-h-screen bg-neutral-900 flex items-center">
      <div className="relative mx-auto max-w-4xl px-6 text-center text-gray-100">
        <h1 className="text-4xl font-extrabold sm:text-5xl">
          Welcome to <span className="text-emerald-400">Check-Point</span>
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Discover, review, and track your favorite video games!
        </p>

        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold">Recently Added</h2>

          {loading ? (
            <p className="text-gray-400">Loading…</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {recent.map((g) => (
                <li key={g._id} className="group">
                  <Link
                    to={
                      authed
                        ? `/games/${g._id}`
                        : `/login?redirect=/games/${g._id}`
                    }
                  >
                    <div className="overflow-hidden rounded-md bg-neutral-800 transition group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-emerald-500/30">
                      {g.coverImage && (
                        <img
                          src={g.coverImage}
                          alt={g.title}
                          className="h-40 w-full object-cover"
                        />
                      )}
                      <div className="p-3">
                        <h3 className="truncate text-gray-100 group-hover:text-emerald-400">
                          {g.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                          {g.released?.slice(0, 4) ?? 'TBA'}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600/10 via-transparent to-transparent"
        />
      </div>
    </section>
  );
}
