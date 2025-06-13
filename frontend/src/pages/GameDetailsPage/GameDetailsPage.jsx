import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router';
import ReviewForm from '../../components/ReviewForm/ReviewForm';
import * as gameService from '../../services/gameService';
import * as reviewService from '../../services/reviewService';

export default function GameDetailsPage(props) {
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();
  const { gameId } = params;
  const [editedReviewData, setEditedReviewData] = useState({
    title: '',
    text: '',
    rating: '',
  });

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
          reviews.map((review) => {
            const canEditOrDelete =
              review.author &&
              (review.author._id === props.user?._id || props.user?.isAdmin);
            console.log('review.author:', review.author);
            console.log('user:', props.user);

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
                <p>{review.text}</p>
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
                        setEditedReviewData({ title: '', text: '', rating: 0 });
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
