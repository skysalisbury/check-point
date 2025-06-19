import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import * as reviewService from '../../services/reviewService';

export default function ReviewListPage() {
  const [reviews, setReviews] = useState([]);


  useEffect(() => {
    (async () => setReviews(await reviewService.getAll()))();
  }, []);

  return (
    <section className="min-h-screen bg-neutral-900 pt-8 pb-16">
      <div className="mx-auto max-w-4xl px-4 text-gray-100">
        <h1 className="mb-6 text-2xl font-bold">All Reviews</h1>

        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet.</p>
        ) : (
          <ul className="space-y-6">
            {reviews.map((review) => (
              <li
                key={review._id}
                className="
                  rounded-md border border-neutral-700 bg-neutral-800 p-4
                  shadow-sm transition
                  hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/30
                "
              >
                <h2 className="text-lg font-semibold text-gray-100">
                  {review.title}
                </h2>

                <p className="mt-1 text-gray-300">
                  <strong className="text-gray-400">Game:</strong>{' '}
                  {review.game ? (
                    <Link
                      to={`/games/${review.game._id}`}
                      className="text-emerald-400 underline hover:text-emerald-300"
                    >
                      {review.game.title}
                    </Link>
                  ) : (
                    'Unknown'
                  )}
                </p>

                <p className="text-gray-300">
                  <strong className="text-gray-400">Author:</strong>{' '}
                  {review.author ? review.author.name : 'Anonymous'}
                </p>

                <p className="text-gray-300">
                  <strong className="text-gray-400">Rating:</strong>{' '}
                  {review.rating}/10
                </p>

                <p className="mt-3 text-gray-200">{review.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}