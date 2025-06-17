import { NavLink, Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { logOut } from '../../services/authService';
import { toggleDarkMode } from '../../utils/theme';
import './NavBar.css';

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  function handleLogOut() {
    logOut();
    setUser(null);
    // navigate('/'); The <Link> that was clicked will navigate to "/"
  }

  function handleToggle() {
    toggleDarkMode();
    setIsDarkMode((prev) => !prev);
  }

  return (
    <nav className="NavBar bg-white text-black dark:bg-gray-800 dark:text-white transition-colors duration-300 p-4">

      <NavLink to="/">Home</NavLink>
      &nbsp; | &nbsp;
      {user ? (
        <>
          <button
            onClick={handleToggle}
            className="px-3 py-1 border rounded-md transition-colors duration-300
             bg-white text-black dark:bg-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isDarkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
          </button>
          <NavLink to="/games" end>
            Game List
          </NavLink>
          &nbsp; | &nbsp;
          <Link to="/reviews">All Reviews</Link>
          &nbsp; | &nbsp;
          <Link to="/search">Search</Link>
          &nbsp; | &nbsp;
          <Link to="/" onClick={handleLogOut}>
            Log Out
          </Link>
          <span>Welcome, {user.name}</span>
        </>
      ) : (
        <>
          <NavLink to="/login">Log In</NavLink>
          &nbsp; | &nbsp;
          <NavLink to="/signup">Sign Up</NavLink>
        </>
      )}
    </nav>
  );
}
