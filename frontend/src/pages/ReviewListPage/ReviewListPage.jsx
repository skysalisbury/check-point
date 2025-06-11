import { useEffect, useState } from 'react';
import * as reviewService from '../../services/reviewService';

export default function ReviewListPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchReviews() {
      const allReviews = await reviewService.getAll();
      setReviews(allReviews);
    }
    fetchReviews();
  }, []);

  return (
    <main style={{ padding: '1rem' }}>
      <h1>All Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
            <h2>{review.title}</h2>
            <p><strong>Game:</strong> {review.game?.title || 'Unknown'}</p>
            <p><strong>Author:</strong> {review.author?.name || 'Anonymous'}</p>
            <p><strong>Rating:</strong> {review.rating}/10</p>
            <p>{review.text}</p>
          </div>
        ))
      )}
    </main>
  );
}

