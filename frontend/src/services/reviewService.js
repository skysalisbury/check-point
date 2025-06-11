import sendRequest from './sendRequest';

export async function create(gameId, reviewData) {
  return sendRequest(`/api/games/${gameId}/reviews`, 'POST', reviewData);
}

export async function index(gameId) {
  return sendRequest(`/api/games/${gameId}/reviews`);
}

export async function show(gameId, reviewId) {
  return sendRequest(`/api/games/${gameId}/reviews/${reviewId}`);
}

export async function update(gameId, reviewId, reviewData) {
  return sendRequest(
    `/api/games/${gameId}/reviews/${reviewId}`,
    'PUT',
    reviewData
  );
}

export async function deleteReview(gameId, reviewId) {
  return sendRequest(`/api/games/${gameId}/reviews/${reviewId}`, 'DELETE');
}
