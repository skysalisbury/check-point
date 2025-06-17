import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import ReviewForm from '../../components/ReviewForm/ReviewForm';
import GameForm from '../../components/GameForm/GameForm';
import * as gameService from '../../services/gameService';
import * as reviewService from '../../services/reviewService';
import * as userService from '../../services/userService';

const MAX_PREVIEW_LENGTH = 100;

export default function GameDetailsPage({ user }) {
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingGame, setIsEditingGame] = useState(false);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [editedReviewData, setEditedReviewData] = useState({ title: '', text: '', rating: '' });

  useEffect(() => {
    async function fetchGame() {
      const gameData = await gameService.show(gameId);
      setGame(gameData);
    }
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    async function fetchReviews() {
      if (!game || !game._id) return;
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

  useEffect(() => {
    async function fetchWishlist() {
      if (!user) return;
      const currentUser = await userService.getCurrentUser();
      setIsWishlisted(currentUser.wishlist?.some((g) => g._id === gameId));
    }
    fetchWishlist();
  }, [user, gameId]);

  async function handleToggleWishlist() {
    try {
      await userService.toggleWishlist(gameId);
      setIsWishlisted((prev) => !prev);
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
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

  function handleAddReview(newReview) {
    setReviews((prev) => [newReview, ...prev]);
  }

  function handleUpdateReview(reviewId) {
    reviewService
      .update(gameId, reviewId, editedReviewData)
      .then((updatedReview) => {
        setReviews((prev) => prev.map((r) => (r._id === reviewId ? updatedReview : r)));
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
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert('You are not authorized to delete this review.');
    }
  }

  function toggleExpand(reviewId) {
    setExpandedReviewId((prevId) => (prevId === reviewId ? null : reviewId));
  }

  if (!game) return <main className="p-4">Loading...</main>;

  return (
    <div className="p-4 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
      <h1 className="text-3xl font-bold mb-4">{game.title}</h1>
      {game.coverImage && (
        <img src={game.coverImage} alt={game.title} className="w-full max-w-sm mb-4 rounded shadow" />
      )}

      <div className="space-y-2 mb-4">
        <p><strong>Released:</strong> {game.released || 'N/A'}</p>
        <p><strong>Genres:</strong> {game.genres?.join(', ') || 'N/A'}</p>
        <p><strong>Platforms:</strong> {game.platforms?.join(', ') || 'N/A'}</p>
        <p><strong>Developers:</strong> {game.developers?.join(', ') || 'N/A'}</p>
        <p><strong>Publishers:</strong> {game.publishers?.join(', ') || 'N/A'}</p>
        <p><strong>Description:</strong> {game.description || 'No description provided.'}</p>
      </div>

      <div className="flex gap-4 mb-6">
        {user && (
          <>
            <button
              onClick={handleToggleFavorite}
              className="px-3 py-1 border rounded dark:border-gray-600 dark:hover:bg-gray-700 hover:bg-gray-200"
            >
              {isFavorite ? '❤️ Unfavorite' : '🤍 Favorite'}
            </button>
            <button
              onClick={handleToggleWishlist}
              className="px-3 py-1 border rounded dark:border-gray-600 dark:hover:bg-gray-700 hover:bg-gray-200"
            >
              {isWishlisted ? '📭 Remove from Wishlist' : '📬 Add to Wishlist'}
            </button>
          </>
        )}
      </div>

      {user?.isAdmin && !isEditingGame && (
        <button onClick={() => setIsEditingGame(true)} className="mb-4 underline text-blue-500">
          Edit Game
        </button>
      )}
      {isEditingGame && user?.isAdmin && (
        <GameForm game={game} setGame={setGame} setIsEditingGame={setIsEditingGame} />
      )}

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Reviews</h2>
        <ReviewForm gameId={gameId} onReviewAdded={handleAddReview} />

        {reviews.length > 0 ? (
          reviews.map((review) => {
            const canEditOrDelete = review.author && (review.author._id === user?._id || user?.isAdmin);
            const isExpanded = expandedReviewId === review._id;
            const isLong = review.text.length > MAX_PREVIEW_LENGTH;
            const previewText = isExpanded
              ? review.text
              : review.text.slice(0, MAX_PREVIEW_LENGTH) + (isLong ? '...' : '');

            return (
              <div key={review._id} className="border p-4 rounded mb-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-semibold">{review.title}</h3>
                <p>{previewText}</p>
                {isLong && (
                  <button
                    onClick={() => toggleExpand(review._id)}
                    className="text-blue-500 hover:underline"
                  >
                    {isExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
                <p className="mt-1">Rating: {review.rating}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>By:</strong> {review.author?.name || 'Anonymous'}
                </p>

                {canEditOrDelete && (
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => {
                        setIsEditing(review._id);
                        setEditedReviewData({
                          title: review.title,
                          text: review.text,
                          rating: review.rating,
                        });
                      }}
                      className="text-yellow-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}

                {isEditing === review._id && (
                  <div className="mt-2 space-y-2">
                    <input
                      type="text"
                      value={editedReviewData.title}
                      onChange={(e) => setEditedReviewData({ ...editedReviewData, title: e.target.value })}
                      className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"
                    />
                    <textarea
                      value={editedReviewData.text}
                      onChange={(e) => setEditedReviewData({ ...editedReviewData, text: e.target.value })}
                      className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"
                    />
                    <input
                      type="number"
                      value={editedReviewData.rating}
                      onChange={(e) => setEditedReviewData({ ...editedReviewData, rating: e.target.value })}
                      className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdateReview(review._id)} className="text-green-600 hover:underline">
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedReviewData({ title: '', text: '', rating: '' });
                        }}
                        className="text-gray-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
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
