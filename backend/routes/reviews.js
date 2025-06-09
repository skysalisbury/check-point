const express = require('express');
const router = express.Router();
const reviewsCtrl = require('../controllers/reviews');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/reviews'

// Protect all defined routes
router.use(ensureLoggedIn);

// GET /api/games/:gameId/reviews (INDEX action)
router.get('/', reviewsCtrl.index);

//POST /api/games/:gameId/reviews (CREATE action)
router.post('/', reviewsCtrl.create);

//GET /api/games/:gameId/reviews/:reviewId (SHOW action)
router.get('/:reviewId', reviewsCtrl.show);

//PUT /api/reviews/:reviewId (UPDATE action)
router.put('/:reviewId', reviewsCtrl.update);

//DELETE /api/reviews/:reviewId (DELETE action)
router.delete('/:reviewId', reviewsCtrl.deleteReview);

module.exports = router;
