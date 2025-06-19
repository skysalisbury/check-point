// backend/routes/gameReviews.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewsCtrl = require('../controllers/reviews');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// GET /api/games/:gameId/reviews
router.get('/', reviewsCtrl.indexByGame);

router.use(ensureLoggedIn);
// POST /api/games/:gameId/reviews
router.post('/', reviewsCtrl.create);

// GET/PUT/DELETE for game-specific reviews
router.get('/:reviewId', reviewsCtrl.show);
router.put('/:reviewId', reviewsCtrl.update);
router.delete('/:reviewId', reviewsCtrl.deleteReview);

module.exports = router;
