const Review = require('../models/review');
const Game = require('../models/game');

module.exports = {
  globalIndex,
  show,
  create,
  update,
  deleteReview,
};

async function globalIndex(req, res) {
  try {
    const reviews = await Review.find({})
      .populate('author game')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all reviews' });
  }
}

async function create(req, res) {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) return res.status(404).json({ message: 'Game not found' });

    const review = await Review.create({
      title: req.body.title,
      text: req.body.text,
      rating: req.body.rating,
      author: req.user._id,
      game: game._id,
    });

    game.reviews.push(review._id);
    await game.save();

    await review.populate('author');
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

async function show(req, res) {
  try {
    const review = await Review.findById(req.params.reviewId).populate(
      'author'
    );
    if (!review || review.game.toString() !== req.params.gameId) {
      return res
        .status(404)
        .json({ message: 'Review not found for this game' });
    }
    res.json(review);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch review' });
  }
}

async function update(req, res) {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (!review.author.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this review' });
    }

    review.text = req.body.text ?? review.text;
    review.rating = req.body.rating ?? review.rating;
    await review.save();

    res.json(review);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to update review' });
  }
}

async function deleteReview(req, res) {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (!review.author.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this review' });
    }

    await Game.findByIdAndUpdate(review.game, {
      $pull: { reviews: review._id },
    });
    await Review.findByIdAndDelete(review._id);

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete review' });
  }
}
