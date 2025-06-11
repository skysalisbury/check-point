import sendRequest from './sendRequest';

const BASE_URL = '/api/reviews';

export async function create(gameId, reviewData) {
  return sendRequest(`/api/games/${gameId}/reviews`, 'POST', reviewData);
}

//index
export async function getAll(gameId) {
  return sendRequest(`${BASE_URL}`);
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
