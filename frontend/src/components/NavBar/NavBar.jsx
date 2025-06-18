import { NavLink, Link, useNavigate } from 'react-router';
import { logOut } from '../../services/authService';

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogOut() {
    logOut();
    setUser(null);
    navigate('/');
  }

  /* base link style */
  const base = 'text-gray-300 transition hover:text-emerald-400 font-medium';

  /* active-link helper for NavLink */
  const navClass = ({ isActive }) =>
    `${base} ${isActive ? 'text-emerald-400' : ''}`;

  return (
    <header
      className="
        sticky top-0 z-50
        bg-neutral-900
        border-b border-neutral-800
        shadow-[0_2px_6px_-2px] shadow-emerald-500/40   /* emerald glow */
      "
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* ─── brand ─── */}
        <Link to="/" className="text-lg font-bold text-emerald-400">
          Check-Point
        </Link>

        {/* ─── navigation links ─── */}
        <ul className="flex items-center gap-6">
          <li>
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
          </li>

          {!user ? (
            /* ——— unauthenticated ——— */
            <>
              <li>
                <NavLink to="/login" className={navClass}>
                  Log&nbsp;In
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup" className={navClass}>
                  Sign&nbsp;Up
                </NavLink>
              </li>
            </>
          ) : (
            /* ——— authenticated ——— */
            <>
              <li>
                <NavLink to="/games" className={navClass}>
                  Game&nbsp;List
                </NavLink>
              </li>
              <li>
                <NavLink to="/reviews" className={navClass}>
                  All&nbsp;Reviews
                </NavLink>
              </li>
              <li>
                <NavLink to="/search" className={navClass}>
                  Search
                </NavLink>
              </li>
              <li>
                <button
                  onClick={handleLogOut}
                  className={`${base} hover:text-red-400`}
                >
                  Log&nbsp;Out
                </button>
              </li>
              <li className="text-sm text-gray-400">Hi, {user.name}</li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}