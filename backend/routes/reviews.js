const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewsCtrl = require('../controllers/reviews');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/reviews'

// Protect all defined routes
router.use(ensureLoggedIn);

// GET /api/games/:gameId/reviews (INDEX action)
router.get('/', reviewsCtrl.globalIndex);

//Index for Game Specific routes
// router.get('/', reviewsCtrl.indexByGame);

//POST /api/games/:gameId/reviews (CREATE action)
router.post('/', ensureLoggedIn, reviewsCtrl.create);

//GET /api/games/:gameId/reviews/:reviewId (SHOW action)
router.get('/:reviewId', reviewsCtrl.show);

//PUT /api/reviews/:reviewId (UPDATE action)
router.put('/:reviewId', ensureLoggedIn, reviewsCtrl.update);

//DELETE /api/reviews/:reviewId (DELETE action)
router.delete('/:reviewId', ensureLoggedIn, reviewsCtrl.deleteReview);

module.exports = router;
