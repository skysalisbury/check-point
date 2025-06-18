const path = require('path'); // Built into Node
const express = require('express');
const logger = require('morgan');
const app = express();

// Process the secrets/config vars in .env
require('dotenv').config();

// Connect to the database
require('./db');

app.use(logger('dev'));
// Serve static assets from the frontend's built code folder (dist)
app.use(express.static(path.join(__dirname, '../frontend/dist')));
// Note that express.urlencoded middleware is not needed
// because forms are not submitted!
app.use(express.json());

// Middleware to check the request's headers for a JWT and
// verify that it's a valid.  If so, it will assign the
// user object in the JWT's payload to req.user
app.use(require('./middleware/checkToken'));
// API Routes

app.use('/api/auth', require('./routes/auth'));
app.use('/api/rawg', require('./routes/rawg'));
app.use('/api/games/:gameId/reviews', require('./routes/gameReviews'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/games', require('./routes/games'));
app.use('/api/users', require('./routes/users'));
// Routers mounted below ensureLoggedIn middleware
// protects all routes defined in that router

// Use a "catch-all" route to deliver the frontend's production index.html
app.get('/*splat', function (req, res) {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The express app is listening on ${port}`);
});
