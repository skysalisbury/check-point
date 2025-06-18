import { NavLink, Link, useNavigate } from 'react-router';
import { logOut } from '../../services/authService';
import './NavBar.css';

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogOut() {
    logOut();
    setUser(null);
  }

  return (
    <nav className="NavBar dark:bg-black dark:text-white px-3 py-1 transition-colors duration-300">
      <NavLink to="/">Home</NavLink>
      {user ? (
        <>
          &nbsp; | &nbsp;
          <NavLink to="/games" end>Game List</NavLink>
          &nbsp; | &nbsp;
          <Link to="/reviews">All Reviews</Link>
          &nbsp; | &nbsp;
          <Link to="/search">Search</Link>
          &nbsp; | &nbsp;
          <Link to="/" onClick={handleLogOut}>Log Out</Link>
          &nbsp; | &nbsp;
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
