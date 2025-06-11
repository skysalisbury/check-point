import sendRequest from './sendRequest';

export async function create(gameId, reviewData) {
  return sendRequest(`/api/games/${gameId}/reviews`, 'POST', reviewData);
}
