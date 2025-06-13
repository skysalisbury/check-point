import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { updateGame } from '../../services/gameService';

export default function GameForm({ game, setGame, setIsEditingGame }) {
  const [formData, setFormData] = useState({
    title: game.title || '', // ✅ corrected
    description: game.description || '',
    released: game.released || '',
    genres: game.genres?.join(', ') || '',
    platforms: game.platforms?.join(', ') || '',
    developers: game.developers?.join(', ') || '',
    publishers: game.publishers?.join(', ') || '',
    coverImage: game.coverImage || '',
  });

  const navigate = useNavigate();
  const { gameId } = useParams();

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const payload = {
        ...game,
        ...formData,
        genres: formData.genres.split(',').map((g) => g.trim()),
        platforms: formData.platforms.split(',').map((p) => p.trim()),
        developers: formData.developers.split(',').map((d) => d.trim()),
        publishers: formData.publishers.split(',').map((p) => p.trim()),
      };

      const updatedGame = await updateGame(gameId, payload);

      setGame(updatedGame);
      setIsEditingGame(false);
      navigate(`/games/${gameId}`);
    } catch (err) {
      console.error('Game update error:', err);
      alert('Something went wrong while updating the game.');
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <label>
        Game Title:
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </label>
      <label>
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Released:
        <input
          type="date"
          name="released"
          value={formData.released}
          onChange={handleChange}
        />
      </label>
      <label>
        Genres (comma-separated):
        <input
          type="text"
          name="genres"
          value={formData.genres}
          onChange={handleChange}
        />
      </label>
      <label>
        Platforms (comma-separated):
        <input
          type="text"
          name="platforms"
          value={formData.platforms}
          onChange={handleChange}
        />
      </label>
      <label>
        Developers (comma-separated):
        <input
          type="text"
          name="developers"
          value={formData.developers}
          onChange={handleChange}
        />
      </label>
      <label>
        Publishers (comma-separated):
        <input
          type="text"
          name="publishers"
          value={formData.publishers}
          onChange={handleChange}
        />
      </label>
      <label>
        Cover Image URL:
        <input
          type="text"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleChange}
        />
      </label>

      <button type="submit">Save Changes</button>
      <button
        type="button"
        onClick={() => setIsEditingGame(false)}
        style={{ marginLeft: '1rem' }}
      >
        Cancel
      </button>
    </form>
  );
}
