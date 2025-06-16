import sendRequest from './sendRequest';

export function getCurrentUser() {
  return sendRequest('/api/users/me');
}

export function toggleFavorite(gameId) {
  return sendRequest(`/api/users/favorites/${gameId}`, 'POST');
}
