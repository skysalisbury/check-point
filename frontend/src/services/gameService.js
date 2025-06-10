import sendRequest from './sendRequest';

const BASE_URL = '/api/games';

export async function index() {
  return sendRequest(BASE_URL);
}

export async function create(gameData) {
  return sendRequest(BASE_URL, 'POST', gameData);
}
