const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

router.use(ensureLoggedIn);

router.get('/me', usersCtrl.getCurrentUser);

router.post('/favorites/:gameId', usersCtrl.toggleFavorite);

// Add or remove game from wishlist
router.post('/wishlist/:gameId', ensureLoggedIn, usersCtrl.toggleWishlist);

// Get current user with wishlist
router.get('/me', ensureLoggedIn, usersCtrl.getMe);

module.exports = router;
