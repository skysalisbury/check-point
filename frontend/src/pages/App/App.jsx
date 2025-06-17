import { useState } from 'react';
import { Routes, Route } from 'react-router';
import { getUser } from '../../services/authService';
import HomePage from '../HomePage/HomePage';
import GameListPage from '../GameListPage/GameListPage';
import ReviewListPage from '../ReviewListPage/ReviewListPage';
import GameDetailsPage from '../GameDetailsPage/GameDetailsPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import LogInPage from '../LogInPage/LogInPage';
import SearchPage from '../SearchPage/SearchPage';
import NavBar from '../../components/NavBar/NavBar';
import './App.css';


export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      <h1 className="text-4xl font-bold text-blue-600 dark:text-white">
        Tailwind is working!
      </h1>
      <NavBar user={user} setUser={setUser} />
      <section id="main-section">
        {user ? (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GameListPage />} />
            <Route path="/reviews" element={<ReviewListPage />} />
            <Route path="/games/:gameId" element={<GameDetailsPage user={user} />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={null} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
            <Route path="/login" element={<LogInPage setUser={setUser} />} />
            <Route path="*" element={null} />
          </Routes>
        )}
      </section>
    </main>
  );
}