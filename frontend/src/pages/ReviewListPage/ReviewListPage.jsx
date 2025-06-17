import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import * as reviewService from '../../services/reviewService';

export default function ReviewListPage() {
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      const allReviews = await reviewService.getAll();
      setReviews(allReviews);
    }
    fetchReviews();
  }, []);

  return (
    <main>
      <h1>All Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review._id}
          >
            <h2>{review.title}</h2>

            {/* ✅ LINK TO GAME */}
            <p>
              <strong>Game:</strong>{' '}
              {review.game ? (
                <Link to={`/games/${review.game._id}`}>{review.game.title}</Link>
              ) : (
                'Unknown'
              )}
            </p>

            {/* DISPLAY AUTHOR (PROFILE PAGE FOR LATER) */}
            <p>
              <strong>Author:</strong>{' '}
              {review.author ? (
                // For now, just display name. Bookmark link for later.
                review.author.name
              ) : (
                'Anonymous'
              )}
            </p>

            <p>
              <strong>Rating:</strong> {review.rating}/10
            </p>
            <p>{review.text}</p>
          </div>
        ))
      )}
    </main>
  );
}

