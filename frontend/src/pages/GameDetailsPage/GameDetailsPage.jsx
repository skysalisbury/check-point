import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router';
import ReviewForm from '../../components/ReviewForm/ReviewForm';
import * as gameService from '../../services/gameService';

export default function GameDetailsPage(props) {
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const params = useParams();
  const { gameId } = params;

  useEffect(() => {
    async function fetchGameAndReviews() {
      const gameData = await gameService.show(gameId);
      setGame(gameData);

      const res = await fetch(`/api/games/${gameId}/reviews`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const reviewData = await res.json();
      setReviews(reviewData);
    }
    fetchGameAndReviews();
  }, [gameId]);
  console.log('game state:', game);

  function handleAddReview(newReview) {
  setReviews(prevReviews => [newReview, ...prevReviews]);
}


  if (!game) return <main>Loading...</main>;
  return (
    <div style={{ padding: '1rem' }}>
      <h1>{game.title}</h1>
      <img
        src={game.coverImage}
        alt={game.title}
        style={{ width: '300px', borderRadius: '12px' }}
      />
      <p>
        <strong>Released:</strong> {game.released || 'N/A'}
      </p>
      <p>
        <strong>Genres:</strong> {game.genres?.join(', ') || 'N/A'}
      </p>
      <p>
        <strong>Platforms:</strong> {game.platforms?.join(', ') || 'N/A'}
      </p>
      <p>
        <strong>Developers:</strong> {game.developers?.join(', ') || 'N/A'}
      </p>
      <p>
        <strong>Publishers:</strong> {game.publishers?.join(', ') || 'N/A'}
      </p>

      <section style={{ marginTop: '2rem' }}>
        <h2>Reviews</h2>
        <ReviewForm gameId={gameId} onReviewAdded={handleAddReview} />
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id}>
              <p>
                <strong>{review.title}</strong> by 
                <strong> {review.author?.name || 'Anonymous'}:</strong>{' '}
                {review.text}
              </p>
              <p>Rating: {review.rating}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </section>
    </div>
  );
}
