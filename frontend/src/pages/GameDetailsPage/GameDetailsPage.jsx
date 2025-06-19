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
  const [editedReviewData, setEditedReviewData] = useState({
    title: '',
    text: '',
    rating: '',
  });

  const navigate = useNavigate();
  const { gameId } = useParams();

  useEffect(() => {
    async function fetchGame() {
      const gameData = await gameService.show(gameId);
      setGame(gameData);
    }
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    async function fetchReviews() {
      if (!game?._id) return;
      setReviews(await reviewService.indexByGame(game._id));
    }
    fetchReviews();
  }, [game]);

  useEffect(() => {
    async function fetchFavorites() {
      if (!user) return;
      const me = await userService.getCurrentUser();
      setIsFavorite(me.favorites?.some((f) => f._id === gameId));
    }
    fetchFavorites();
  }, [user, gameId]);

  useEffect(() => {
    async function fetchWishlist() {
      if (!user) return;
      const me = await userService.getCurrentUser();
      setIsWishlisted(me.wishlist?.some((g) => g._id === gameId));
    }
    fetchWishlist();
  }, [user, gameId]);

  async function handleToggleWishlist() {
    try {
      await userService.toggleWishlist(gameId);
      setIsWishlisted((p) => !p);
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
    }
  }

  async function handleToggleFavorite() {
    try {
      await userService.toggleFavorite(gameId);
      setIsFavorite((p) => !p);
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
      .then((updated) => {
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? updated : r))
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
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert('You are not authorized to delete this review.');
    }
  }

  function toggleExpand(id) {
    setExpandedReviewId((prev) => (prev === id ? null : id));
  }

  if (!game) return <main className="p-4 text-gray-100">Loading…</main>;

  return (
    <section className="min-h-screen bg-neutral-900 pt-8 pb-16">
      <div className="mx-auto max-w-4xl px-4 text-gray-100">
        <button
          onClick={() => navigate('/games')}
          className="
           mb-6 inline-flex items-center gap-1 text-sm text-emerald-400
           underline transition hover:text-emerald-300"
        >
          ← Back to Game List
        </button>

        <h1 className="mb-4 text-3xl font-bold">{game.title}</h1>
        {game.coverImage && (
          <img
            src={game.coverImage}
            alt={game.title}
            className="mb-6 w-full max-w-sm rounded-md shadow-lg shadow-black/30"
          />
        )}

        <ul className="space-y-1 text-sm text-gray-400">
          <li>
            <strong className="text-gray-300">Released:</strong>{' '}
            {game.released ?? 'N/A'}
          </li>
          <li>
            <strong className="text-gray-300">Genres:</strong>{' '}
            {game.genres?.join(', ') || 'N/A'}
          </li>
          <li>
            <strong className="text-gray-300">Platforms:</strong>{' '}
            {game.platforms?.join(', ') || 'N/A'}
          </li>
          <li>
            <strong className="text-gray-300">Developers:</strong>{' '}
            {game.developers?.join(', ') || 'N/A'}
          </li>
          <li>
            <strong className="text-gray-300">Publishers:</strong>{' '}
            {game.publishers?.join(', ') || 'N/A'}
          </li>
        </ul>

        <p className="mt-4 text-gray-300">
          {game.description || 'No description provided.'}
        </p>

        {user && (
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleToggleFavorite}
              className="
                rounded-md border border-emerald-500 px-4 py-1.5 text-sm
                font-medium text-emerald-400 transition
                hover:bg-emerald-500 hover:text-white
              "
            >
              {isFavorite ? '❤️ Unfavorite' : '🤍 Favorite'}
            </button>
            <button
              onClick={handleToggleWishlist}
              className="
                rounded-md border border-emerald-500 px-4 py-1.5 text-sm
                font-medium text-emerald-400 transition
                hover:bg-emerald-500 hover:text-white
              "
            >
              {isWishlisted ? '📭 Remove from Wishlist' : '📬 Add to Wishlist'}
            </button>
          </div>
        )}

        {user?.isAdmin && !isEditingGame && (
          <button
            onClick={() => setIsEditingGame(true)}
            className="mt-6 text-emerald-400 underline hover:text-emerald-300"
          >
            Edit Game
          </button>
        )}
        {isEditingGame && user?.isAdmin && (
          <GameForm
            game={game}
            setGame={setGame}
            setIsEditingGame={setIsEditingGame}
          />
        )}

        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-semibold">Reviews</h2>
          <ReviewForm gameId={gameId} onReviewAdded={handleAddReview} />

          {reviews.length ? (
            reviews.map((review) => {
              const canEdit =
                review.author &&
                (review.author._id === user?._id || user?.isAdmin);
              const isExpanded = expandedReviewId === review._id;
              const isLong = review.text.length > MAX_PREVIEW_LENGTH;
              const preview = isExpanded
                ? review.text
                : review.text.slice(0, MAX_PREVIEW_LENGTH) +
                  (isLong ? '…' : '');

              return (
                <article
                  key={review._id}
                  className="
                    mb-6 rounded-md border border-neutral-700 bg-neutral-800 p-4
                    shadow-sm shadow-black/20
                  "
                >
                  <h3 className="text-lg font-semibold text-gray-100">
                    {review.title}
                  </h3>
                  <p className="text-gray-300">{preview}</p>
                  {isLong && (
                    <button
                      onClick={() => toggleExpand(review._id)}
                      className="mt-1 text-sm text-emerald-400 underline hover:text-emerald-300"
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                  <p className="mt-1 text-sm text-gray-400">
                    Rating: {review.rating}
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>By:</strong> {review.author?.name || 'Anonymous'}
                  </p>

                  {canEdit && (
                    <div className="mt-3 flex gap-3 text-sm">
                      <button
                        onClick={() => {
                          setIsEditing(review._id);
                          setEditedReviewData({
                            title: review.title,
                            text: review.text,
                            rating: review.rating,
                          });
                        }}
                        className="text-yellow-400 underline hover:text-yellow-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-400 underline hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {isEditing === review._id && (
                    <div className="mt-4 space-y-2">
                      <input
                        type="text"
                        value={editedReviewData.title}
                        onChange={(e) =>
                          setEditedReviewData((d) => ({
                            ...d,
                            title: e.target.value,
                          }))
                        }
                        className="
                          w-full rounded-md border border-neutral-700
                          bg-neutral-800 p-2 text-gray-100
                        "
                      />
                      <textarea
                        value={editedReviewData.text}
                        onChange={(e) =>
                          setEditedReviewData((d) => ({
                            ...d,
                            text: e.target.value,
                          }))
                        }
                        className="
                          w-full rounded-md border border-neutral-700
                          bg-neutral-800 p-2 text-gray-100
                        "
                      />
                      <input
                        type="number"
                        value={editedReviewData.rating}
                        onChange={(e) =>
                          setEditedReviewData((d) => ({
                            ...d,
                            rating: e.target.value,
                          }))
                        }
                        className="
                          w-full rounded-md border border-neutral-700
                          bg-neutral-800 p-2 text-gray-100
                        "
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateReview(review._id)}
                          className="rounded-md bg-emerald-600 px-4 py-1.5 text-white transition hover:bg-emerald-500"
                        >
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
                          className="rounded-md border border-neutral-700 px-4 py-1.5 text-gray-400 transition hover:text-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <p className="text-gray-400">No reviews yet.</p>
          )}
        </section>
      </div>
    </section>
  );
}
