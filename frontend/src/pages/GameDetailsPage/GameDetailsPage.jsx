import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import ReviewForm from '../../components/ReviewForm/ReviewForm';
import GameForm from '../../components/GameForm/GameForm';
import * as gameService from '../../services/gameService';
import * as reviewService from '../../services/reviewService';
import * as userService from '../../services/userService';

const MAX_PREVIEW_LENGTH = 100;

export default function GameDetailsPage({ user, ...props }) {
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingGame, setIsEditingGame] = useState(false);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [editedReviewData, setEditedReviewData] = useState({
    title: '',
    text: '',
    rating: '',
  });

  useEffect(() => {
    async function fetchGame() {
      const gameData = await gameService.show(gameId);
      setGame(gameData);
    }
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    async function fetchReviews() {
      if (!game || !game._id) return; // ✅ Wait for game to load
      const gameReviews = await reviewService.indexByGame(game._id);
      setReviews(gameReviews);
    }
    fetchReviews();
  }, [game]);

  useEffect(() => {
    async function fetchFavorites() {
      if (!user) return;
      const currentUser = await userService.getCurrentUser();
      setIsFavorite(currentUser.favorites?.some((fav) => fav._id === gameId));
    }
    fetchFavorites();
  }, [user, gameId]);

  function handleAddReview(newReview) {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  }

  function handleUpdateReview(reviewId) {
    reviewService
      .update(gameId, reviewId, editedReviewData)
      .then((updatedReview) => {
        setReviews((prevReviews) =>
          prevReviews.map((r) => (r._id === reviewId ? updatedReview : r))
        );
        setIsEditing(false);
        setEditedReviewData({ title: '', text: '', rating: '' });
      })
      .catch((err) => {
        console.error('Failed to update review:', err);
        alert('Unauthorized or failed to update review.');
      });
  }

  async function handleDeleteReview(reviewId) {
    try {
      await reviewService.deleteReview(gameId, reviewId);
      setReviews((prevReviews) =>
        prevReviews.filter((r) => r._id !== reviewId)
      );
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert('You are not authorized to delete this review.');
    }
  }

  async function handleToggleFavorite() {
    try {
      await userService.toggleFavorite(gameId);
      setIsFavorite((prev) => !prev);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  }

  function toggleExpand(reviewId) {
    setExpandedReviewId((prevId) => (prevId === reviewId ? null : reviewId));
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
      <p>
        <strong>Description:</strong>{' '}
        {game.description || 'No description provided.'}
      </p>
      {user && (
        <button onClick={handleToggleFavorite}>
          {isFavorite ? '❤️ Unfavorite' : '🤍 Favorite'}
        </button>
      )}

      {user?.isAdmin && !isEditingGame && (
        <button onClick={() => setIsEditingGame(true)}>Edit Game</button>
      )}
      {isEditingGame && user?.isAdmin && (
        <GameForm
          game={game}
          setGame={setGame}
          setIsEditingGame={setIsEditingGame}
        />
      )}

      <section style={{ marginTop: '2rem' }}>
        <h2>Reviews</h2>
        <ReviewForm gameId={gameId} onReviewAdded={handleAddReview} />

        {reviews.length > 0 ? (
          reviews.map((review) => {
            const canEditOrDelete =
              review.author &&
              (review.author._id === user?._id || user?.isAdmin);

            const isExpanded = expandedReviewId === review._id;
            const isLong = review.text.length > MAX_PREVIEW_LENGTH;
            const previewText = isExpanded
              ? review.text
              : review.text.slice(0, MAX_PREVIEW_LENGTH) +
                (isLong ? '...' : '');

            return (
              <div
                key={review._id}
                style={{
                  border: '1px solid #ccc',
                  padding: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <h3>{review.title}</h3>
                <p>{previewText}</p>
                {isLong && (
                  <button onClick={() => toggleExpand(review._id)}>
                    {isExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
                <p>Rating: {review.rating}</p>
                <p>
                  <strong>By:</strong> {review.author?.name || 'Anonymous'}
                </p>

                {canEditOrDelete && (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(review._id);
                        setEditedReviewData({
                          title: review.title,
                          text: review.text,
                          rating: review.rating,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeleteReview(review._id)}>
                      Delete
                    </button>
                  </>
                )}

                {isEditing === review._id && (
                  <div>
                    <input
                      type="text"
                      value={editedReviewData.title}
                      onChange={(e) =>
                        setEditedReviewData({
                          ...editedReviewData,
                          title: e.target.value,
                        })
                      }
                    />
                    <textarea
                      value={editedReviewData.text}
                      onChange={(e) =>
                        setEditedReviewData({
                          ...editedReviewData,
                          text: e.target.value,
                        })
                      }
                    />
                    <input
                      type="number"
                      value={editedReviewData.rating}
                      onChange={(e) =>
                        setEditedReviewData({
                          ...editedReviewData,
                          rating: e.target.value,
                        })
                      }
                    />
                    <button onClick={() => handleUpdateReview(review._id)}>
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedReviewData({
                          title: '',
                          text: '',
                          rating: '',
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>No reviews yet.</p>
        )}
      </section>
    </div>
  );
}
