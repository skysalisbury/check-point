const Review = require('../models/review');
const Game = require('../models/game');

module.exports = {
  index,
  show,
  create,
  update,
  deleteReview,
};

async function index(req, res) {
  try {
    const reviews = await Review.find({}).populate('author').populate('game');
    // Below would return all posts for just the logged in user
    // const posts = await Post.find({author: req.user._id});
    res.json(reviews);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch Review' });
  }
}

async function create(req, res) {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) return res.status(404).json({ message: 'Game not found' });

    const review = await Review.create({
      text: req.body.text,
      rating: req.body.rating,
      author: req.user._id,
      game: game._id,
    });

    game.reviews.push(review._id);
    await game.save();

    await review.populate('author');
    res.status(201).json(Review);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

async function show(req, res) {
  try {
    const game = await Game.findById(req.params.gameId).populate(
      'comments.author'
    );
    const review = game.reviews.id(req.params.reviewId); // correct way to access subdoc

    if (!review) return res.status(404).json({ message: 'Review not found' });

    res.json(review);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch review' });
  }
}

async function update(req, res) {
  try {
    const game = await Game.findById(req.params.gameId);
    const review = game.reviews.id(req.params.reviewId);

    if (!review) return res.status(404).json({ message: 'Comment not found' });

    if (!review.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to update this review");
    }

    review.text = req.body.text || review.text;
    await game.save();

    res.json(review);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to update review' });
  }
}

async function deleteReview(req, res) {
  const game = await Game.findById(req.params.gameId);
  game.reviews = game.reviews.filter(
    (review) => review._id.toString() !== req.params.reviewId
  );
  await game.save();
  res.sendStatus(204);
}
