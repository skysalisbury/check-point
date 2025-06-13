import sendRequest from './sendRequest';

const BASE_URL = '/api/games';

export async function index() {
  return sendRequest(BASE_URL);
}

export async function create(gameData) {
  return sendRequest(BASE_URL, 'POST', gameData);
}

export async function show(gameId) {
  return sendRequest(`${BASE_URL}/${gameId}`);
}

export async function updateGame(gameId, gameData) {
  return sendRequest(`${BASE_URL}/${gameId}`, 'PUT', gameData);
}

export async function deleteGame(gameId) {
  return sendRequest(`${BASE_URL}/${gameId}`, 'DELETE');
}
