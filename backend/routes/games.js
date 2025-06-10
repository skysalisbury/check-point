const express = require('express');
const router = express.Router();
const gamesCtrl = require('../controllers/games');
const reviewsCtrl = require('../controllers/reviews');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/posts'

// Protect all defined routes
router.use(ensureLoggedIn);

// GET /api/games (INDEX action)
router.get('/', gamesCtrl.index);

//POST /api/games (CREATE action)
router.post('/', ensureLoggedIn, gamesCtrl.create);

//GET /api/games/:gameId (Show Action)
router.get('/:gameId', gamesCtrl.show);

//PUT /api/games/:gameId (Update Action)
router.put('/:gameId', ensureLoggedIn, gamesCtrl.update);

//DELETE /api/games/:gameId (DELETE Action)
router.delete('/:gameId', ensureLoggedIn, gamesCtrl.deleteGame);

module.exports = router;
