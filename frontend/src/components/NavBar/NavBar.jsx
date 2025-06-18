import { NavLink, Link, useNavigate } from 'react-router';
import { logOut } from '../../services/authService';

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogOut() {
    logOut();
    setUser(null);
    navigate('/');
  }

  /* reusable link style */
  const base =
    'text-gray-300 transition hover:text-emerald-400 font-medium';

  /* highlight the active route */
  const navClass = ({ isActive }) =>
    `${base} ${isActive ? 'text-emerald-400' : ''}`;

  return (
    <header className="sticky top-0 z-50 bg-neutral-900 border-b border-neutral-800">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* brand / logo */}
        <Link to="/" className="text-emerald-400 text-lg font-bold">
          GameBoxd
        </Link>

        {/* nav links */}
        <ul className="flex items-center gap-6">
          <li>
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
          </li>

          {!user ? (
            /* -------- unauthenticated links -------- */
            <>
              <li>
                <NavLink to="/login" className={navClass}>
                  Log In
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup" className={navClass}>
                  Sign Up
                </NavLink>
              </li>
            </>
          ) : (
            /* -------- authenticated links -------- */
            <>
              <li>
                <NavLink to="/games" className={navClass}>
                  Game List
                </NavLink>
              </li>
              <li>
                <NavLink to="/reviews" className={navClass}>
                  All Reviews
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
                  Log Out
                </button>
              </li>
              <li className="text-sm text-gray-400">
                Hi,&nbsp;{user.name}
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}