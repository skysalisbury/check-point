const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

router.use(ensureLoggedIn);

router.get('/me', usersCtrl.getCurrentUser);
router.post('/favorites/:gameId', usersCtrl.toggleFavorite);

module.exports = router;
