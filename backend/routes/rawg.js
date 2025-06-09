const express = require('express');
const router = express.Router();
const rawgCtrl = require('../controllers/rawg');

// Search Games (Index)
router.get('/search', rawgCtrl.searchGames);

// Get Game Details by Id (Show)
router.get('/:rawgId', rawgCtrl.getGameDetails);

module.exports = router;
