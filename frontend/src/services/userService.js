import sendRequest from './sendRequest';

export function getCurrentUser() {
  return sendRequest('/api/users/me');
}

export function toggleFavorite(gameId) {
  return sendRequest(`/api/users/favorites/${gameId}`, 'POST');
}

export async function toggleWishlist(gameId) {
  return sendRequest(`/api/users/wishlist/${gameId}`, 'POST');
}
